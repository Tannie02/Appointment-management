
import { useState } from "react";

function Calendar({ appointments, doctorId, onSelectDate, selectedDate }) {
    const [month, setMonth] = useState(new Date());
    const year = month.getFullYear();
    const monthNumber = month.getMonth();
    const days = new Date(year, monthNumber + 1, 0).getDate();
    const firstDay = (new Date(year, monthNumber, 1).getDay() + 6) % 7;
    function hasBooking(day) {
        const date = year + "-" +
            String(monthNumber + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");
        return appointments.some(a =>
            a.doctorId === Number(doctorId) &&
            a.date === date &&
            a.status !== "Cancelled"
        );
    }
    function selectDay(day) {
        const date = year + "-" +
            String(monthNumber + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");

        onSelectDate(date);
    }
    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={() =>
                    setMonth(new Date(year, monthNumber - 1, 1))
                }>❮</button>
                <h3>
                    {month.toLocaleString("default", { month: "long" })} {year}
                </h3>
                <button onClick={() =>
                    setMonth(new Date(year, monthNumber + 1, 1))
                }>❯</button>
            </div>
            <div className="calendar-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div className="day-name" key={day}>{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={"empty" + i}></div>
                ))}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const date = year + "-" +
                        String(monthNumber + 1).padStart(2, "0") + "-" +
                        String(day).padStart(2, "0");
                    return (
                        <button
                            key={day}
                            className={
                                "calendar-day " +
                                (hasBooking(day) ? "has-booking " : "") +
                                (selectedDate === date ? "selected-day" : "")
                            }
                            onClick={() => selectDay(day)}>
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>);
}

export default Calendar;
