
function Navbar({ role, setPage, logout }) {
    const patientLinks = [
        ["home", "Home"],
        ["doctors", "Doctors"],
        ["booking", "Book Appointment"],
        ["appointments", "My Appointments"],
        ["notifications", "Notifications"]
    ];
    const doctorLinks = [
        ["dashboard", "Dashboard"],
        ["calendar", "Calendar"],
        ["patients", "My Patients"],
        ["notifications", "Notifications"]
    ];
    const links = role === "patient" ? patientLinks : doctorLinks;
    return (
        <nav className="navbar">
            <h2>MediCare</h2>
            <div className="nav-links">
                {links.map(link => (
                    <button key={link[0]} onClick={() => setPage(link[0])}>{link[1]}</button>
                ))}
                <button className="logout" onClick={logout}> Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
