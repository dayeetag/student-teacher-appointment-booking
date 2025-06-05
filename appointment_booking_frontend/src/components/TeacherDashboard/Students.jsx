import React, { useState, useEffect } from "react";

const Students = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://127.0.0.1:8000/teachers/getStudents/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setStudents(data.students);
            } else {
                setError(data.error || "Error");
            }
        } catch {
            setError("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setError("");
        fetchStudents();
    }, []);

    if (loading) return <>Loading...</>;

    return (
        <>
            <p className="text-3xl font-bold py-8">Student Details</p>
            {students.length > 0 ? (
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Name</td>
                            <td className="p-4">Email</td>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, i) => {
                            return (
                                <tr key={s.email} className={i % 2 !== 0 ? "bg-gray-100" : ""}>
                                    <td className="p-2">{s.name}</td>
                                    <td className="p-2">{s.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No student details</p>
            )}
            {error && (
                <div className="text-red-500 text-center font-bold">{error}</div>
            )}
        </>
    );
};

export default Students;
