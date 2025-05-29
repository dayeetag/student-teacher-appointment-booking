import React, { useState, useEffect } from "react";

const Login = ({ onLogin }) => {
    const [showRegistrationPage, setShowRegistrationPage] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setEmail("")
        setPassword("")
        setName("")
        setError("")
    }, [showRegistrationPage])

    const handleLogin = async () => {
        setError("");
        if(email==="" || password===""){
            setError("Email and password required")
            return
        }
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
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    };

    const handleRegistration = async () => {
        setError("");
        if(email==="" || password===""|| name===""){
            setError("Email, password and name required")
            return
        }
        try {
            const res = await fetch("http://127.0.0.1:8000/students/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                setShowRegistrationPage(!showRegistrationPage)
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
        
    };

    return (
        <div className="flex h-screen w-screen">
            <div className="w-2/3 h-full bg-blue-950 text-5xl text-white font-bold flex items-center px-16">
                <p>Mentor Appointment App</p>
            </div>
            <div className="flex-1 h-full flex flex-col justify-center items-center gap-y-10 border">
                <div className="h-1/2 w-3/4 p-8 flex flex-col justify-around border border-gray-400 rounded-3xl">
                {
                    !showRegistrationPage ? (
                        <>
                            <p>Email:</p>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="p-2 border border-gray-200 rounded-md"/><br />
                            <p>Password:</p>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="p-2 border border-gray-200 rounded-md" /><br />
                            <button onClick={handleLogin} className="bg-blue-950 p-2 rounded-md text-white">Login</button>
                            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
                        </>
                    ) : (
                        <>
                            <p>Email:</p>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="p-2 border border-gray-200 rounded-md"/><br />
                            <p>Name:</p>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="p-2 border border-gray-200 rounded-md"/><br />
                            <p>Password:</p>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="p-2 border border-gray-200 rounded-md" /><br />
                            <button onClick={handleRegistration} className="bg-blue-950 p-2 rounded-md text-white">Register</button>
                            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
                        </>
                    )
                }
                </div>
                <button onClick={()=>setShowRegistrationPage(!showRegistrationPage)} className="p-4 bg-stone-900 text-white rounded-md">{!showRegistrationPage ? 'Register as a Student' : 'Continue to Login'}</button>
            </div>
            
        </div>
    );
};

export default Login;