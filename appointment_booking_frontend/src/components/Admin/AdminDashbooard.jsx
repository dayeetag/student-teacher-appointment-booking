import React, { useState } from "react";
import StudentRegistration from "./StudentRegistration";
import TeacherDetails from "./TeacherDetails";
import AddTeacher from "./AddTeacher";

const componentMap = {
    StudentRegistration: StudentRegistration,
    TeacherDetails: TeacherDetails,
    AddTeacher: AddTeacher
};

const AdminDashboard = ({onLogout}) => {
    const [componentName, setComponentName] = useState("StudentRegistration");
    const ComponentToRender = componentMap[componentName];


    return (
        <div className="h-screen w-screen flex">
            <nav className="h-full w-1/5 flex flex-col justify-between bg-blue-950 text-white">
                <div className="flex flex-col">
                    <button onClick={() => setComponentName("StudentRegistration")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="StudentRegistration" ? 'bg-indigo-950' : ''}`}>Student Registrations</button>
                    <button onClick={() => setComponentName("TeacherDetails")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="TeacherDetails" ? 'bg-indigo-950' : ''}`}>Mentor Details</button>
                    <button onClick={() => setComponentName("AddTeacher")} className={`text-left p-4 hover:bg-indigo-950 active:bg-indigo-950 ${componentName==="AddTeacher" ? 'bg-indigo-950' : ''}`}>Add Mentor</button>
                </div>
                <button className="bg-white text-black p-4 m-4 rounded-lg font-bold" onClick={onLogout}>Logout</button>
            </nav>
            <div className="flex-1 p-8">
                {ComponentToRender ? <ComponentToRender /> : <p>Component not found</p>}
            </div>
        </div>
    )
}

export default AdminDashboard