import React, {useState, useEffect} from "react"

const AddTeacher = () =>{
    const [error, setError] = useState("")

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [department, setDepartment] = useState("")
    const [subject, setSubject] = useState("")

    const handleSubmit = async() => {
        setError("")
        if(name===""||email===""||password===""||department===""||subject===""){
            setError("All fields are mandatory")
            return
        }
        try {
            const res = await fetch("http://127.0.0.1:8000/adminapp/addTeacher/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, department, subject }),
            })
            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                setName("")
                setEmail("")
                setPassword("")
                setDepartment("")
                setSubject("")
            } else {
                setError(data.error || "Mentor account creation failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }

    return(
        <>
            <p className="text-3xl font-bold py-8">Add Mentor Details</p>
            <table className="w-full">
                <tbody>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"/></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="text" placeholder="Password"  value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"/></td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td><input type="text" placeholder="Name"  value={name} onChange={(e)=>setName(e.target.value)} required className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"/></td>
                    </tr>
                    <tr>
                        <td>Department</td>
                        <td><input type="text" placeholder="Department"  value={department} onChange={(e)=>setDepartment(e.target.value)} required className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"/></td>
                    </tr>
                    <tr>
                        <td>Subject</td>
                        <td><input type="text" placeholder="Subject"  value={subject} onChange={(e)=>setSubject(e.target.value)} required className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"/></td>
                    </tr>
                </tbody>
                
            </table>
            <button onClick={handleSubmit} className="p-4 mt-8 bg-stone-900 text-white rounded-md">Save Details</button>
            {error && <div className="text-red-500 font-bold mt-16">{error}</div>}
        </>
    )
}

export default AddTeacher