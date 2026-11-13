
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
function Booking({ user, doctors, refresh }) {
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [slots, setSlots] = useState([]);
    function loadSlots(id, selectedDate) {
        if (!id || !selectedDate) return;

        fetch(`${API}/slots/` + id + "/" + selectedDate)
            .then(res => res.json())
            .then(data => setSlots(data));
    }
    useEffect(() => {
        if (doctorId && date) {
            loadSlots(doctorId, date);
        }
    }, [doctorId, date]);
    function book(e) {
        e.preventDefault();
        fetch(`${API}/book"`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: user.id,
                doctorId,
                date,
                time
            })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            alert(data.message);
            setTime("");
            refresh();
            loadSlots(doctorId, date);
        }).catch(error => alert("Booking failed: " + error.message));
    }
    return (
        <div className="page">
            <h1>Book an Appointment</h1>
            <form onSubmit={book} className="booking-form">
                <label>Select Doctor</label>
                <select required value={doctorId}
                    onChange={e => {
                        setDoctorId(e.target.value);
                        setTime("");
                    }}>
                    <option value="">Choose Doctor</option>
                    {doctors.map(d => (
                        <option value={d.id} key={d.id}>
                            {d.name} - {d.specialization}
                        </option>
                    ))}
                </select>
                <label>Select Date</label>
                <input type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    required
                    value={date}
                    onChange={e => {
                        setDate(e.target.value);
                        setTime("");
                    }}/>
                <label>Available Slots</label>
                <div className="slot-list">
                    {slots.map(s => (
                        <button type="button" key={s.time}  disabled={s.status === "Booked"}  className={time === s.time ? "chosen-slot" : ""} onClick={() => setTime(s.time)}>
                            {s.time}
                            <br />
                            {s.status}
                        </button>
                    ))}
                </div>
                <button className="primary" disabled={!time}>Confirm Appointment</button>
            </form>
        </div>
    );
}

export default Booking;
