
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Booking from "./pages/Booking";
import MyAppointments from "./pages/MyAppointments";
import Notifications from "./pages/Notifications";

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [page, setPage] = useState("home");
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const API = "http://localhost:5001";
    function refresh() {
        fetch(API + "/doctors")
            .then(res => res.json())
            .then(data => setDoctors(data));

        fetch(API + "/appointments")
            .then(res => res.json())
            .then(data => setAppointments(data));

        fetch(API + "/notifications")
            .then(res => res.json())
            .then(data => setNotifications(data));
    }
    useEffect(() => {
        refresh();
    }, []);
    function login(selectedRole, name, email) {
        fetch(API + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: selectedRole,
                name,
                email
            })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }
            setUser(data.user);
            setRole(selectedRole);
            setPage(selectedRole === "patient" ? "home" : "dashboard");
            refresh();
        })
        .catch(error => alert(error.message));
    }
    function register(name, email) {
    fetch(API + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message);
        }
        alert(data.message);
        setUser(data.user);
        setRole("patient");
        setPage("home");
        refresh();
    })
    .catch(error => alert(error.message));
}
    function logout() {
        setUser(null);
        setRole("");
        setPage("home");
    }
    if (!user) {
        return <Login login={login} resgister={register} />;
    }
    return (
        <div>
            <Navbar role={role}setPage={setPage}logout={logout} />
            {role === "patient" && page === "home" && ( <PatientDashboard user={user} appointments={appointments}doctors={doctors} setPage={setPage}/> )}
            {role === "patient" && page === "doctors" && (
                <div className="page">
                    <h1>Available Doctors</h1>
                    <div className="doctor-grid">
                        {doctors.map(d => (
                            <div className="doctor-card" key={d.id}>
                                <h3>{d.name}</h3>
                                <p>{d.specialization}</p>
                                <p>Working hours start: {d.start}</p>
                                <button onClick={() => setPage("booking")}> Book Appointment </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {role === "patient" && page === "booking" && (<Booking user={user} doctors={doctors} refresh={refresh} />)}
            {role === "patient" && page === "appointments" && ( <MyAppointments user={user} appointments={appointments} refresh={refresh} /> )}
            {role === "doctor" && page === "dashboard" && ( <DoctorDashboard user={user} appointments={appointments}  refresh={refresh}/> )}
            {role === "doctor" && page === "calendar" && ( <DoctorDashboard user={user}  appointments={appointments}  refresh={refresh} /> )}
            {role === "doctor" && page === "patients" && (
                <div className="page">
                    <h1>My Patients</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments
                                .filter(a => a.doctorId === user.id)
                                .map(a => (
                                    <tr key={a.id}>
                                        <td>{a.patientName}</td>
                                        <td>{a.date}</td>
                                        <td>{a.time}</td>
                                        <td>{a.status}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
            {page === "notifications" && (
                <Notifications
                    notifications={notifications}
                    user={user}
                />
            )}
        </div>
    );
}

export default App;
