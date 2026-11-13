
function PatientDashboard({ user, appointments, doctors, setPage }) {
    const myAppointments = appointments.filter(
        a => a.patientId === user.id
    );
    return (
        <div className="page">
            <h1>Welcome, {user.name}!</h1>
            <p>Manage your hospital appointments.</p>
            <div className="summary">
                <div className="summary-card">
                    <h2>{doctors.length}</h2>
                    <p>Available Doctors</p>
                </div>
                <div className="summary-card">
                    <h2>{myAppointments.filter(a => a.status === "Booked").length}</h2>
                    <p>Upcoming Appointments</p>
                </div>
            </div>
            <button className="primary" onClick={() => setPage("booking")}>  Book an Appointment </button>
        </div>
    );
}

export default PatientDashboard;
