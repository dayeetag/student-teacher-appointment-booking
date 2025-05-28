import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/adminapp/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("authToken", data.token);
                onLogin(data);
                console.log(data.category)
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><Link to="/student-registration/">Register as a Student</Link></p>
        </div>
    );
};

export default Login;