import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginAPI, refreshToken as refreshTokenAPI } from '../api/auth';
import apiClient from '../api/client';
import { User, AdminLoginResponse, AuthContextType } from '../types';
import { AxiosError } from 'axios';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (accessToken && refreshToken && userId) {
        setUser({
          id: userId,
          role: 'Admin',
          accessToken,
          refreshToken,
        });
        // Set authorization header for authenticated users
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const userId = localStorage.getItem('userId');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!userId || !refreshToken) {
              // No refresh token available, logout
              logout();
              return Promise.reject(error);
            }

            // Try to refresh the token
            const response = await refreshTokenAPI(userId, refreshToken);
            const newAccessToken = response.accessToken;

            // Update access token in localStorage
            localStorage.setItem('accessToken', newAccessToken);

            // Update user state
            setUser((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                accessToken: newAccessToken,
              };
            });

            // Update the authorization header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry the original request
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    keepLoggedIn: boolean = false
  ): Promise<AdminLoginResponse> => {
    try {
      const response = await loginAPI(email, password, keepLoggedIn);
      
      // API returns: accessToken, refreshToken, userId
      const { accessToken, refreshToken, userId } = response;

      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);

      // Set authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Update state
      setUser({
        id: userId,
        role: 'Admin',
        accessToken,
        refreshToken,
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = (redirectToLogin: boolean = true): void => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    // Clear authorization header
    delete apiClient.defaults.headers.common['Authorization'];

    // Clear state
    setUser(null);

    // Redirect to login page if requested
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
