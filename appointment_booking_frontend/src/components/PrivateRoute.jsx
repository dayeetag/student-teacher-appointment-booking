import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, role, children }) => {
    if (!user || user.category !== role) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PrivateRoute;