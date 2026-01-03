import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Profile from './pages/Profile';

// Contractor pages
import ContractorDashboard from './pages/contractor/Dashboard';
import CreateRequest from './pages/contractor/CreateRequest';

// Supplier pages
import SupplierDashboard from './pages/supplier/Dashboard';
import BrowseRequests from './pages/supplier/BrowseRequests';

// Placeholder components for routes not yet implemented
interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
    <p>This page is coming soon!</p>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  const userRole = user?.role;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
            {/* Contractor routes */}
            {userRole === 'Contractor' && (
              <>
                <Route index element={<ContractorDashboard />} />
                <Route path="create-request" element={<CreateRequest />} />
                <Route path="my-requests" element={<PlaceholderPage title="طلباتي" />} />
                <Route path="received-bids" element={<PlaceholderPage title="العروض المستلمة" />} />
                <Route path="view-bids/:requestId" element={<PlaceholderPage title="عرض العروض" />} />
                <Route path="active-deals" element={<PlaceholderPage title="الصفقات النشطة" />} />
                <Route path="messages" element={<PlaceholderPage title="الرسائل" />} />
                <Route path="settings" element={<PlaceholderPage title="الإعدادات" />} />
                <Route path="profile" element={<Profile />} />
              </>
            )}

            {/* Supplier routes */}
            {userRole === 'Supplier' && (
              <>
                <Route index element={<SupplierDashboard />} />
                <Route path="browse-requests" element={<BrowseRequests />} />
                <Route path="submit-bid/:requestId" element={<PlaceholderPage title="تقديم عرض" />} />
                <Route path="my-bids" element={<PlaceholderPage title="عروضي" />} />
                <Route path="active-deals" element={<PlaceholderPage title="الصفقات النشطة" />} />
                <Route path="catalog" element={<PlaceholderPage title="كتالوج المنتجات" />} />
                <Route path="messages" element={<PlaceholderPage title="الرسائل" />} />
                <Route path="settings" element={<PlaceholderPage title="الإعدادات" />} />
                <Route path="profile" element={<Profile />} />
              </>
            )}
          </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
