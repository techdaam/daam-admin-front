import apiClient from './client';

/**
 * Submit Registration Request
 * POST /registration-requests
 * Note: This endpoint requires multipart/form-data for file uploads
 */
export const submitRegistration = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/registration-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
