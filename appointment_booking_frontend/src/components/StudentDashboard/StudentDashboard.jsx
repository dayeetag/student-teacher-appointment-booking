import React, { useState } from "react";
import TeacherDetails from "./TeacherDetails";
import AppointmentRequestForm from "./AppointmentRequestForm";
import Appointments from "./Appointments";

const componentMap = {
    TeacherDetails: TeacherDetails,
    AppointmentRequestForm: AppointmentRequestForm,
    Appointments: Appointments
};

const StudentDashboard = ({user, onLogout}) => {
    const [componentName, setComponentName] = useState("TeacherDetails");
    const ComponentToRender = componentMap[componentName];


    return (
        <div className="h-screen w-screen flex">
            <nav className="h-full w-1/5 flex flex-col justify-between bg-blue-950 text-white">
                <div className="flex flex-col">
                    <button onClick={() => setComponentName("TeacherDetails")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="TeacherDetails" ? 'bg-indigo-950' : ''}`}>Mentor Details</button>
                    <button onClick={() => setComponentName("AppointmentRequestForm")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="AppointmentRequestForm" ? 'bg-indigo-950' : ''}`}>Submit Appointment Request</button>
                    <button onClick={() => setComponentName("Appointments")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="Appointments" ? 'bg-indigo-950' : ''}`}>Appointments</button>
                </div>
                <button className="bg-white text-black p-4 m-4 rounded-lg font-bold" onClick={onLogout}>Logout</button>
            </nav>
            <div className="flex-1 p-8">
                {ComponentToRender ? <ComponentToRender user={user}/> : <p>Component not found</p>}
            </div>
        </div>
    )
}

export default StudentDashboard