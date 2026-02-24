import apiClient from './client';
import type { Patient, CreatePatientRequest, UpdatePatientRequest } from '../types';

export const patientsApi = {
    getAll: async (): Promise<Patient[]> => {
        const response = await apiClient.get<Patient[]>('/api/patients');
        return response.data;
    },

    create: async (patient: CreatePatientRequest): Promise<Patient> => {
        const response = await apiClient.post<Patient>('/api/patients', patient);
        return response.data;
    },

    update: async (id: string, patient: UpdatePatientRequest): Promise<Patient> => {
        const response = await apiClient.put<Patient>(`/api/patients/${id}`, patient);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/patients/${id}`);
    },
};
