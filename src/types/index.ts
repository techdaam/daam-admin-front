// User & Auth Types
export interface User {
  id: string;
  role: 'Admin';
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'User' | 'SuperAdmin';
  userClass: 'Admin' | 'Contractors' | 'Suppliers';
  enabled: boolean;
  phoneNumber: string;
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  website: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  city: string;
}

// OTP Types
export interface OTPResponse {
  otpRequesterToken: string;
  allowedRetryAt: string;
  tokenExpireAt: string;
  attempsLeft: number;
  resendTimesLeft: number;
}

export interface OTPVerifyResponse {
  otpSuccessToken: string;
  otpSuccessTokenExpireAt: string;
}

// Registration Request Types
export enum RegistrationStatus {
  Pending = 1,
  Approved = 2,
  Denied = 3
}

export enum RegisterationType {
  Contractor = 0,
  Supplier = 1
}

export interface RegistrationRequestListItem {
  id: string;
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  commercialLicenseObjectKey: string | null;
  taxLicenseObjectKey: string | null;
  website: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  currentStatus: RegistrationStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface RegistrationRequestDetail {
  id: string;
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  website: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  currentStatus: RegistrationStatus;
  type: RegisterationType;
  commercialLicenseUrl: string | null;
  taxLicenseUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface RegistrationRequestsPagedResponse {
  items: RegistrationRequestListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Management Types
export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'User' | 'SuperAdmin';
  userClass: 'Admin' | 'Contractors' | 'Suppliers';
  enabled: boolean;
  phoneNumber: string;
  city: string;
  companyName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserDetailResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UsersPagedResponse {
  items: UserListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Orders Types (Placeholder for future implementation)
export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface OrdersPagedResponse {
  items: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Error Types
export interface FormErrors {
  [key: string]: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, keepLoggedIn?: boolean) => Promise<AdminLoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
