import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import Spinner from "../Components/Spinner";
import { Children, useEffect } from "react";

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
