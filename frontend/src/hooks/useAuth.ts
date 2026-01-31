import { useAuthStore } from "../store/authStore";


export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    const isAuthenticated = !!user && !!accessToken;
    const isAdmin = user?.role === 'admin';

    return {
        user,
        isAuthenticated,
        isAdmin
    }



};