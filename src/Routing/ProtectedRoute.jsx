import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { useEffect } from "react";
import { useAuth } from "../Context/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/auth");
        }
    }, [user, navigate]);
    if (user === undefined) return <Spinner></Spinner>;
    return children;
};

export default ProtectedRoute;
