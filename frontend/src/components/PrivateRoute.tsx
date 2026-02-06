import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


interface PrivateRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

function PrivateRoute({children, requireAdmin = false}: PrivateRouteProps) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);

    if (!accessToken) {
        return(<Navigate to={"/login"} replace />);
    }

    if (requireAdmin && user?.role !== "admin") {
        return(<Navigate to={"/products"} replace />);
    }


    return(
        <>
            |{children}
        </>
    );
}

export default PrivateRoute;