import apiClient from './client';
import { ProfileResponse, UpdateProfileRequest } from '../types';

/**
 * Get Current User Profile
 * GET /profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>('/profile');
  return response.data;
};

/**
 * Update Current User Profile
 * PATCH /profile
 * Only updates: firstName, lastName, city
 */
export const updateProfile = async (
  profileData: UpdateProfileRequest
): Promise<void> => {
  const response = await apiClient.patch('/profile', {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    city: profileData.city,
  });
  return response.data;
};
