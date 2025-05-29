import React, { useState, useEffect } from "react"

const TeacherDetails = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [teachers, setTeachers] = useState([])

    const [editingTeacherID, setEditingTeacherID] = useState("")
    const [editingTeacher, setEditingTeacher] = useState({})

    const fetchTeachers = async () => {
        try {
            setLoading(true)
            const res = await fetch("http://127.0.0.1:8000/adminapp/getAllTeachers/", {
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

    const handleInputChange = (e, field) => {
        const { value } = e.target
        setEditingTeacher(prev => {
            return { ...prev, [field]: value };
        })
    }

    const handleUpdateTeacher = async() =>{
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/adminapp/updateTeacher/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingTeacher),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                setEditingTeacherID("")
                setEditingTeacher({})
                fetchTeachers()
            } else {
                setError(data.error || "Updation failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }

    const handleDeleteTeacher = async(email) =>{
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/adminapp/deleteTeacher/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                setEditingTeacherID("")
                setEditingTeacher({})
                fetchTeachers()
            } else {
                setError(data.error || "Deletion failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }
    
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
                            <td className="p-4" colSpan={2}>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t, i) => {
                            return (
                                <tr key={t.email} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{t.email}</td>
                                    <td className="p-2"><input type="text" readOnly={editingTeacherID !== t.email} value={editingTeacherID === t.email ? editingTeacher.name : t.name} onChange={(e)=>handleInputChange(e, 'name')} className={`p-2 ${editingTeacherID === t.email && 'border rounded-sm bg-white'}`}/></td>
                                    <td className="p-2"><input type="text" readOnly={editingTeacherID !== t.email} value={editingTeacherID === t.email ? editingTeacher.department : t.department} onChange={(e)=>handleInputChange(e, 'department')} className={`p-2 ${editingTeacherID === t.email && 'border rounded-sm bg-white'}`}/></td>
                                    <td className="p-2"><input type="text" readOnly={editingTeacherID !== t.email} value={editingTeacherID === t.email ? editingTeacher.subject : t.subject} onChange={(e)=>handleInputChange(e, 'subject')} className={`p-2 ${editingTeacherID === t.email && 'border rounded-sm bg-white'}`}/></td>
                                    <td className="p-2">
                                        {editingTeacherID === t.email ? 
                                        <button className="bg-blue-950 p-2 text-white rounded-md" onClick={handleUpdateTeacher}>Save</button> :
                                        <button className="bg-blue-950 p-2 text-white rounded-md" onClick={() => { setEditingTeacherID(t.email); setEditingTeacher(t); }}>Edit</button>}
                                    </td>
                                    <td className="p-2"><button className="bg-blue-950 p-2 text-white rounded-md" onClick={() => handleDeleteTeacher(t.email)}>Delete</button></td>
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