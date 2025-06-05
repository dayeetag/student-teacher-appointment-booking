import React, { useState, useEffect } from "react"

const Appointments = ({user}) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [confirmedAppt, setConfirmedAppt] = useState([])
    const [apptRequests, setApptRequests] = useState([])

    const fetchAppt = async () => {
        try {
            setLoading(true)
            const res1 = await fetch(`http://127.0.0.1:8000/teachers/getConfirmedAppointments/?teacher_email=${encodeURIComponent(user.email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data1 = await res1.json();
            if (res1.ok) {
                setConfirmedAppt(data1.appointments)
            } else {
                setError(data1.error || "Error");
            }
            const res2 = await fetch(`http://127.0.0.1:8000/teachers/getPendingAppointments/?teacher_email=${user.email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data2 = await res2.json();
            if (res2.ok) {
                setApptRequests(data2.appointments)
            } else {
                setError(data1.error || "Error");
            }
        } catch {
            setError("Server error. Try again.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setError("")
        fetchAppt()
    }, [])


    const handleConfirm = async(id) =>{
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/teachers/confirmAppointment/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id}),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                fetchAppt()
            } else {
                setError(data.error || "Confirmation failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }


    const handleCancel = async(id) =>{
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/teachers/cancelAppointment/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id}),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message)
                fetchAppt()
            } else {
                setError(data.error || "Cancellation failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    }
    
    if(loading) return (<>Loading...</>)

    return (
        <>
            <p className="text-3xl font-bold py-8">Confirmed Appointments</p>
            {confirmedAppt.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Student</td>
                            <td className="p-4">Date</td>
                            <td className="p-4">Message</td>
                        </tr>
                    </thead>
                    <tbody>
                        {confirmedAppt.map((a, i) => {
                            return (
                                <tr key={a.id} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{a.student}</td>
                                    <td className="p-2">{new Date(a.appt_date).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })} </td>
                                    <td className="p-2">{a.message}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No confirmed appointments</p>
            }
            <p className="text-3xl font-bold py-8">Appointment Requests</p>
            {apptRequests.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Student</td>
                            <td className="p-4">Date</td>
                            <td className="p-4">Message</td>
                            <td className="p-4" colSpan={2}>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {apptRequests.map((a, i) => {
                            return (
                                <tr key={a.id} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{a.student}</td>
                                    <td className="p-2">{new Date(a.appt_date).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })} </td>
                                    <td className="p-2">{a.message}</td>
                                    <td className="p-2">
                                        <button className="bg-green-500 p-2 text-white rounded-md" onClick={()=> handleConfirm(a.id)}>Confirm</button>
                                    </td>
                                    <td className="p-2">
                                        <button className="bg-red-500 p-2 text-white rounded-md" onClick={() => handleCancel(a.id)}>Cancel</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No appointment requests</p>
            }
            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
        </>
    )
}

export default Appointments