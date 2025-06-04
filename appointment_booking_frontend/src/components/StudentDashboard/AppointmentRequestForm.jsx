import React, { useState, useEffect } from "react";

const AppointmentRequestForm = ({ user }) => {
    const [error, setError] = useState("");
    const [teachers, setTeachers] = useState([])

    const [teacher_email, setTeacher] = useState("");
    const [appt_date, setDate] = useState(null);
    const [message, setMessage] = useState("");

    const fetchTeachers = async () => {
        try {
            const res = await fetch(
                "http://127.0.0.1:8000/students/getTeacherDetails/",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data = await res.json();
            if (res.ok) {
                setTeachers(data.teachers);
            } else {
                setError(data.error || "Error");
            }
        } catch {
            setError("Server error. Try again.");
        }
    };

    useEffect(() => {
        setError("");
        fetchTeachers();
        console.log(teachers)
    }, []);

    useEffect(() => {
        console.log(teachers)
    }, [teachers])

    const handleSubmit = async () => {
        setError("");
        if (teacher_email === "" || appt_date === "" || message === "") {
            setError("All fields are mandatory");
            return;
        }
        const student_email = user.email;
        try {
            const res = await fetch(
                "http://127.0.0.1:8000/students/appointmentRequest/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        student_email,
                        teacher_email,
                        appt_date,
                        message,
                    }),
                }
            );
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setTeacher("");
                setDate(null);
                setMessage("");
            } else {
                setError(data.error || "Appointment request submission failed");
            }
        } catch {
            setError("Server error. Try again.");
        }
    };

    return (
        <>
            <p className="text-3xl font-bold py-8">
                Submit Request for Appointment with Mentor
            </p>
            <table className="w-full">
                <tbody>
                    <tr>
                        <td>Teacher Email</td>
                        <td>
                            <select value={teacher_email} onChange={(e) => setTeacher(e.target.value)} className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm">
                                <option disabled value="">Select a mentor</option>
                                {
                                    teachers.map(t => (
                                        <option value={t.email}>{t.email}</option>
                                    ))
                                }
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>
                            <input
                                type="date"
                                value={appt_date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Message</td>
                        <td>
                            <textarea
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="w-1/3 p-2 m-2 border border-gray-200 rounded-sm"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={handleSubmit}
                className="p-4 mt-8 bg-stone-900 text-white rounded-md"
            >
                Submit Request
            </button>
            {error && <div className="text-red-500 font-bold mt-16">{error}</div>}
        </>
    );
};

export default AppointmentRequestForm;
