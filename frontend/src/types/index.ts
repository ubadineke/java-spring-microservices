// ========================================
// Authentication Types
// ========================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface AuthUser {
    email: string;
    token: string;
}

// ========================================
// Patient Types
// ========================================

export interface Patient {
    id: string;
    name: string;
    email: string;
    address: string;
    dateOfBirth: string;
    registeredDate: string;
}

export interface CreatePatientRequest {
    name: string;
    email: string;
    address: string;
    dateOfBirth: string;
    registeredDate: string;
}

export interface UpdatePatientRequest {
    name: string;
    email: string;
    address: string;
    dateOfBirth: string;
}

// ========================================
// API Error Type
// ========================================

export interface ApiError {
    message: string;
    status?: number;
}
