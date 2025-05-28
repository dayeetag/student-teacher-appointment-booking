import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/admin/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("authToken", data.token);
                onLogin(data);
                navigate("/admin"); // Replace with actual admin dashboard route
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("Network error.");
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" required /><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AdminLogin;