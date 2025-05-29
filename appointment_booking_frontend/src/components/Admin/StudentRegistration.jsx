import React, { useState, useEffect } from "react"

const StudentRegistration = () => {
    const [loading, setLoading] = useState(true)
    const [pendingRegistrations, setPendingRegistrations] = useState([]);
    const [error, setError] = useState("")

    const fetchRegistrations = async () => {
        try {
            setLoading(true)
            const res = await fetch("http://127.0.0.1:8000/adminapp/getPendingRequests/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setPendingRegistrations(data.pending_signups)
            } else {
                setError(data.error || "Error");
            }
        } catch {
            setError("Server error. Try again.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setError("")
        fetchRegistrations()
    }, [])

    const handleApprove = async (email) => {
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/adminapp/approve/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                fetchRegistrations()

            } else {
                setError(data.error || "Approval failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }

    if (loading) return (<>Loading...</>)

    return (
        <>
            <p className="text-3xl font-bold py-8">Student Registrations</p>
            {pendingRegistrations.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Email</td>
                            <td className="p-4">Name</td>
                            <td className="p-4">Submission Date</td>
                            <td className="p-4">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRegistrations.map((reg, i) => {
                            return (
                                <tr key={reg.email} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{reg.email}</td>
                                    <td className="p-2">{reg.name}</td>
                                    <td className="p-2">{new Date(reg.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</td>
                                    <td className="p-2"><button className="bg-blue-950 p-2 text-white rounded-md" onClick={() => handleApprove(reg.email)}>Approve</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No pending registrations</p>
            }
            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
        </>
    )
}

export default StudentRegistration