
import { useState } from "react";
import Calendar from "../components/Calendar";
import { API } from "../config";

function DoctorDashboard({ user, appointments, refresh }) {
    const [date, setDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const myAppointments = appointments.filter(
        a => a.doctorId === user.id
    );
    const daily = myAppointments.filter(
        a => a.date === date && a.status !== "Cancelled"
    );
    const startHour = Number(user.start.split(":")[0]);
    const startMinute = Number(user.start.split(":")[1]);

    const slots = [];

    for (let i = 0; i < 5; i++) {
        const total = startHour * 60 + startMinute + i * 30;
        const hour = String(Math.floor(total / 60)).padStart(2, "0");
        const minute = String(total % 60).padStart(2, "0");

        slots.push(hour + ":" + minute);
    }
    function updateStatus(id, status) {
        fetch(`${API}/status/` + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            refresh();
        });
    }
    return (
        <div className="page">
            <h1>Welcome, {user.name}</h1>
            <div className="doctor-layout">
                <div>
                    <h2>Appointment Calendar</h2>
                    <Calendar appointments={appointments} doctorId={user.id}  selectedDate={date}  onSelectDate={setDate} />
                </div>
                <div>
                    <h2>Daily Schedule</h2>
                    <h3>{date}</h3>
                    {slots.map(time => {
                        const booking = daily.find(a => a.time === time);
                        return (
                            <div className="schedule-slot" key={time}>
                                <b>{time}</b>
                                {booking ? (
                                    <>
                                        <span className="booked-text">  {booking.patientName} </span>
                                        <select  value={booking.status}   onChange={e => updateStatus(booking.id, e.target.value) } >
                                            <option value="Booked">Booked</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </>
                                ) : (
                                    <span className="available-text">
                                        Available
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <h2>My Patients</h2>
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
                    {myAppointments.map(a => (
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
    );
}

export default DoctorDashboard;
