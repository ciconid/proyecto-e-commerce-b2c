import { create } from "zustand";
import type { User } from "../types/auth.types";


interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;

    // Actions
    setAuth(user: User, accessToken: string, refreshToken: string): void;
    clearAuth(): void;
    updateUser(user: User): void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Estado inicial
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),

    setAuth(user, accessToken, refreshToken) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        set({user, accessToken, refreshToken});
    },

    clearAuth() {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        set({user: null, accessToken: null, refreshToken: null});
    },

    updateUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        
        set({user});
    },


}));