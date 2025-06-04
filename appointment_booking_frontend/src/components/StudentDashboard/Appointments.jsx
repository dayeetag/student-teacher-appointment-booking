import React, { useState, useEffect } from "react"

const Appointments = ({ user }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [appts, setAppts] = useState([])
    const [confirmedAppt, setConfirmedAppt] = useState([])
    const [pendingAppt, setPendingAppt] = useState([])


    const fetchAppts = async () => {
        try {
            setLoading(true)
            const res = await fetch(`http://127.0.0.1:8000/students/getAppointments/?student_email=${encodeURIComponent(user.email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setAppts(data.appointments)
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
        fetchAppts()
    }, [])

    useEffect(() => {
        setConfirmedAppt(appts.filter(a => a.approved === "true"))
        setPendingAppt(appts.filter(a => a.approved === "pending"))
    }, [appts])


    if (loading) return (<>Loading...</>)

    return (
        <>
            <p className="text-3xl font-bold py-8">Confirmed Appointments</p>
            {confirmedAppt.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Mentor</td>
                            <td className="p-4">Date</td>
                            <td className="p-4">Message</td>
                        </tr>
                    </thead>
                    <tbody>
                        {confirmedAppt.map((a, i) => {
                            return (
                                <tr key={a.email} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{a.teacher}</td>
                                    <td className="p-2">{a.appt_date}</td>
                                    <td className="p-2">{a.message}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No confirmed appointment details</p>
            }
            <p className="text-3xl font-bold py-8">Pending Appointment Requests</p>
            {pendingAppt.length > 0 ?
                <table className="w-full">
                    <thead className="font-bold">
                        <tr className="bg-stone-900 text-white">
                            <td className="p-4">Mentor</td>
                            <td className="p-4">Date</td>
                            <td className="p-4">Message</td>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingAppt.map((a, i) => {
                            return (
                                <tr key={a.email} className={i % 2 !== 0 ? 'bg-gray-100' : ''}>
                                    <td className="p-2">{a.teacher}</td>
                                    <td className="p-2">{a.appt_date}</td>
                                    <td className="p-2">{a.message}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> :
                <p>No pending appointment request details</p>
            }
            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
        </>
    )
}

export default Appointments