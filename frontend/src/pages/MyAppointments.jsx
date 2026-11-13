
function MyAppointments({ user, appointments, refresh }) {
    const list = appointments.filter(
        a => a.patientId === user.id
    );
    function cancel(id) {
        if (!window.confirm("Cancel this appointment?")) return;
        fetch(`${API}/cancel/` + id, {
            method: "PUT"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            refresh();
        });
    }
    return (
        <div className="page">
            <h1>My Appointments</h1>

            <table>
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map(a => (
                        <tr key={a.id}>
                            <td>{a.doctorName}</td>
                            <td>{a.date}</td>
                            <td>{a.time}</td>
                            <td>{a.status}</td>
                            <td>
                                {a.status === "Booked" &&
                                    <button onClick={() => cancel(a.id)}>
                                        Cancel
                                    </button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyAppointments;
