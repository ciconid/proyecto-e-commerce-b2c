export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}