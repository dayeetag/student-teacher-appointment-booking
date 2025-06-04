import React, { useState, useEffect } from "react"

const TeacherDetails = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [teachers, setTeachers] = useState([])

    const fetchTeachers = async () => {
        try {
            setLoading(true)
            const res = await fetch("http://127.0.0.1:8000/students/getTeacherDetails/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setTeachers(data.teachers)
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
        fetchTeachers()
    }, [])

    
    if(loading) return (<>Loading...</>)

    return (
        <>
            <p className="text-3xl font-bold py-8">Mentor Details</p>
            {teachers.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Email</td>
                            <td className="p-4">Name</td>
                            <td className="p-4">Department</td>
                            <td className="p-4">Subject</td>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t, i) => {
                            return (
                                <tr key={t.email} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{t.email}</td>
                                    <td className="p-2">{t.name}</td>
                                    <td className="p-2">{t.department}</td>
                                    <td className="p-2">{t.subject}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No mentor details</p>
            }
            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
        </>
    )
}

export default TeacherDetails