// User & Auth Types
export interface User {
  id: string;
  role: 'Contractor' | 'Supplier';
  userClass: string;
  firstName: string;
  lastName: string;
  companyName: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userClass: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Contractor' | 'Supplier';
  userClass: string;
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
}

export interface OTPVerifyResponse {
  otpSuccessToken: string;
}

// Registration Types
export interface RegistrationData {
  userType: 'Contractor' | 'Supplier';
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  commercialLicenseFile: File | null;
  taxLicenseFile: File | null;
  website: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  password: string;
  retryPassword: string;
}

// Request & Bid Types
export interface MaterialItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  specifications?: string;
}

export interface Request {
  id: number;
  title: string;
  description: string;
  items: MaterialItem[];
  deadline: string;
  createdAt: string;
  status: 'open' | 'closed';
  bidsCount: number;
  contractorId: number;
  contractorName: string;
  contractorCompany: string;
  deliveryLocation?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface Bid {
  id: number;
  requestId: number;
  supplierId: number;
  supplierName: string;
  supplierCompany: string;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Form Error Types
export interface FormErrors {
  [key: string]: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, keepLoggedIn?: boolean) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
