import apiClient from './client';
import {
  RegistrationRequestsPagedResponse,
  RegistrationRequestDetail,
  RegistrationStatus,
} from '../types';

/**
 * Get Paginated Registration Requests
 * GET /registration-requests
 */
export const getRegistrationRequests = async (
  page: number,
  pageSize: number,
  filters?: {
    status?: RegistrationStatus;
    email?: string;
    commercialLicenseNumber?: string;
  }
): Promise<RegistrationRequestsPagedResponse> => {
  const params: any = { page, pageSize };
  
  if (filters?.status !== undefined) {
    params.status = filters.status;
  }
  if (filters?.email) {
    params.email = filters.email;
  }
  if (filters?.commercialLicenseNumber) {
    params.commercialLicenseNumber = filters.commercialLicenseNumber;
  }

  const response = await apiClient.get<RegistrationRequestsPagedResponse>(
    '/registration-requests',
    { params }
  );
  return response.data;
};

/**
 * Get Registration Request Details
 * GET /registration-requests/{registrationRequestId}
 */
export const getRegistrationRequestById = async (
  registrationRequestId: string
): Promise<RegistrationRequestDetail> => {
  const response = await apiClient.get<RegistrationRequestDetail>(
    `/registration-requests/${registrationRequestId}`
  );
  return response.data;
};

/**
 * Approve Registration Request
 * POST /registration-requests/{registrationRequestId}/approve
 */
export const approveRegistrationRequest = async (
  registrationRequestId: string
): Promise<void> => {
  await apiClient.post(`/registration-requests/${registrationRequestId}/approve`);
};

/**
 * Deny Registration Request
 * POST /registration-requests/{registrationRequestId}/deny
 */
export const denyRegistrationRequest = async (
  registrationRequestId: string
): Promise<void> => {
  await apiClient.post(`/registration-requests/${registrationRequestId}/deny`);
};
