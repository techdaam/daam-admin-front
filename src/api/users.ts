import apiClient from './client';
import {
  UsersPagedResponse,
  UserDetailResponse,
  ProfileResponse,
} from '../types';

/**
 * Get Paginated Users List
 * GET /users
 */
export const getUsers = async (
  page: number,
  pageSize: number,
  filters?: {
    city?: string;
    nameSearch?: string;
    emailSearch?: string;
    sortBy?: string;
    sortDescending?: boolean;
  }
): Promise<UsersPagedResponse> => {
  const params: any = { page, pageSize, sortDescending: false };
  
  if (filters?.city) {
    params.city = filters.city;
  }
  if (filters?.nameSearch) {
    params.nameSearch = filters.nameSearch;
  }
  if (filters?.emailSearch) {
    params.emailSearch = filters.emailSearch;
  }
  if (filters?.sortBy) {
    params.sortBy = filters.sortBy;
  }
  if (filters?.sortDescending !== undefined) {
    params.sortDescending = filters.sortDescending;
  }

  const response = await apiClient.get<UsersPagedResponse>('/users', { params });
  return response.data;
};

/**
 * Get User by ID
 * GET /users/{userId}
 */
export const getUserById = async (userId: string): Promise<UserDetailResponse> => {
  const response = await apiClient.get<UserDetailResponse>(`/users/${userId}`);
  return response.data;
};

/**
 * Get User Profile by ID (Admin only)
 * GET /profile/{userId}
 */
export const getUserProfile = async (userId: string): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>(`/profile/${userId}`);
  return response.data;
};

/**
 * Activate User
 * PATCH /users/{userId}/activate
 */
export const activateUser = async (userId: string): Promise<void> => {
  await apiClient.patch(`/users/${userId}/activate`);
};

/**
 * Deactivate User
 * PATCH /users/{userId}/deactivate
 */
export const deactivateUser = async (userId: string): Promise<void> => {
  await apiClient.patch(`/users/${userId}/deactivate`);
};

/**
 * Delete User (Soft Delete)
 * DELETE /users/{userId}
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};
