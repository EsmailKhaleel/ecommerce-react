import { Navigate, useLocation } from "react-router-dom";
import SpinnerBig from "../Components/SpinnerBig";
import { useAuth } from "../Context/useAuth";

/**
 * Guards a route behind authentication, and optionally behind the admin role.
 *
 * `user` starts as null while the token is still being exchanged for a profile,
 * so we must wait on `loading` before deciding to redirect - otherwise a signed
 * in user is bounced to /auth on every page refresh.
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SpinnerBig />
            </div>
        );
    }

    if (!user) {
        // Remember where the user was headed so login can return them there
        return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
