import apiClient from './client';
import { AdminLoginResponse, RefreshTokenResponse, OTPResponse, OTPVerifyResponse } from '../types';

/**
 * Admin Login
 * POST /auth/admin/login
 */
export const login = async (
  email: string,
  password: string,
  keepLoggedIn: boolean = false
): Promise<AdminLoginResponse> => {
  const response = await apiClient.post<AdminLoginResponse>('/auth/admin/login', {
    email,
    password,
    keepLoggedIn,
  });
  return response.data;
};

/**
 * Refresh Token
 * POST /auth/refresh
 */
export const refreshToken = async (
  userId: string,
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    userId,
    refreshToken,
  });
  return response.data;
};

/**
 * Send OTP
 * POST /auth/otp
 */
export const sendOTP = async (
  email: string,
  purpose: string = 'PasswordReset'
): Promise<OTPResponse> => {
  const response = await apiClient.post<OTPResponse>('/auth/otp', {
    email,
    purpose,
  });
  return response.data;
};

/**
 * Verify OTP
 * POST /auth/otp/verify
 */
export const verifyOTP = async (
  otpRequesterToken: string,
  purpose: string,
  otpNumber: string
): Promise<OTPVerifyResponse> => {
  const response = await apiClient.post<OTPVerifyResponse>('/auth/otp/verify', {
    otpRequesterToken,
    purpose,
    otpNumber,
  });
  return response.data;
};

/**
 * Resend OTP
 * POST /auth/resend-otp
 */
export const resendOTP = async (
  otpToken: string,
  purpose: string = 'PasswordReset'
): Promise<OTPResponse> => {
  const response = await apiClient.post<OTPResponse>('/auth/resend-otp', {
    otpToken,
    purpose,
  });
  return response.data;
};

/**
 * Reset Password
 * POST /auth/password-reset
 */
export const resetPassword = async (
  otpSuccessToken: string,
  newPassword: string
): Promise<void> => {
  const response = await apiClient.post('/auth/password-reset', {
    otpSuccessToken,
    newPassword,
  });
  return response.data;
};
