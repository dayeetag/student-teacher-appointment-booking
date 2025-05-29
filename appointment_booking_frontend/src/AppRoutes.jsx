import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/Admin/AdminDashbooard";

const AppRoutes = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (user?.category && location.pathname === "/") {
            console.log(user)
            navigate(`/${user.category}/`);
        }
    }, [user, navigate, location]);

    return (
        <Routes>
            <Route path="/" element={<Login onLogin={setUser} />} />
            
            <Route
                path="/student/*"
                element={
                    <PrivateRoute user={user} role="student">
                        <StudentDashboard user={user} onLogout={() => setUser(null)} />
                    </PrivateRoute>
                }
            />
            <Route
                path="/teacher/*"
                element={
                    <PrivateRoute user={user} role="teacher">
                        <TeacherDashboard user={user} onLogout={() => setUser(null)} />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute user={user} role="admin">
                        <AdminDashboard user={user} onLogout={() => setUser(null)} />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;