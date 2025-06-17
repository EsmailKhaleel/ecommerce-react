import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { useEffect } from "react";
import { useAuth } from "../Context/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    if (user === undefined) return <Spinner></Spinner>;
    useEffect(() => {
        if(!user){
            navigate("/auth");
        }
    }, [user]);
    return children;
};

export default ProtectedRoute;
