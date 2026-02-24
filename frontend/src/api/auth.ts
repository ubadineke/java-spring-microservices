import apiClient from './client';
import type { LoginRequest, LoginResponse } from '../types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    validateToken: async (): Promise<boolean> => {
        try {
            await apiClient.get('/auth/validate');
            return true;
        } catch {
            return false;
        }
    },
};
