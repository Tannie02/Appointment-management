const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const {
    doctors,
    patients,
    appointments,
    notifications,
    savePatients
} = require("./data");

// Generate five slots
function generateSlots(doctor) {
    let slots = [];
    let start = new Date(
        "2000-01-01T" + doctor.start + ":00"
    );
    for (let i = 0; i < 5; i++) {
        slots.push(start.toTimeString().slice(0, 5));
        start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
}

// Save notification
function addNotification(message, doctorId, patientId) {
    notifications.push({
        id: Date.now(),
        message,
        doctorId,
        patientId,
        date: new Date().toLocaleString()
    });
}

// Get doctors
app.get("/doctors", (req, res) => {
    res.json(doctors);
});

// Get patients
app.get("/patients", (req, res) => {
    res.json(patients);
});

// Login
app.post("/login", (req, res) => {
    const { role, name, email } = req.body;
    let user;
    if (role === "patient") {
        user = patients.find(p =>
            p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            p.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
    }
    if (role === "doctor") {
        user = doctors.find(d =>
            d.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            d.email &&
            d.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
    }
    if (!user) {
        return res.status(401).json({
            message: "Invalid login details"
        });
    }
    res.json({ user });
});

// Patient registration
app.post("/register", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    // Check existing email
    const exists = patients.find(
        p => p.email.toLowerCase() === cleanEmail
    );
    if (exists) {
        return res.status(409).json({
            message: "Email already registered. Please login."
        });
    }
    // Create patient
    const newPatient = {
        id: patients.length > 0
            ? Math.max(...patients.map(p => p.id)) + 1
            : 1,

        name: cleanName,
        email: cleanEmail
    };
    // Add to array
    patients.push(newPatient);
    // Save to JSON file
    savePatients();
    res.status(201).json({
        message: "Registration successful!",
        user: newPatient
    });
});

// Get all patients
app.get("/patients", (req, res) => {
    res.json(patients);
});

// Patient and doctor login
app.post("/login", (req, res) => {
    const { role, name, email } = req.body;
    let user;
    if (role === "patient") {
        user = patients.find(p =>
            p.name.toLowerCase() === name.trim().toLowerCase() &&
            p.email.toLowerCase() === email.trim().toLowerCase()
        );
    }
    if (role === "doctor") {
        user = doctors.find(d =>
            d.name.toLowerCase() === name.trim().toLowerCase() &&
            d.email.toLowerCase() === email.trim().toLowerCase()
        );
    }
    if (!user) {
        return res.status(401).json({
            message: "Invalid login details"
        });
    }
    res.json({ user });
});

// Get available slots
app.get("/slots/:doctorId/:date", (req, res) => {
    const doctor = doctors.find(
        d => d.id === Number(req.params.doctorId)
    );
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }
    const date = req.params.date;
    if (isNaN(new Date(date + "T00:00:00").getTime())) {
        return res.status(400).json({ message: "Invalid date" });
    }
    const weekday = new Date(date + "T00:00:00").getDay();

    if (!doctor.workingDays.includes(weekday)) {
        return res.json([]);
    }
    const slots = generateSlots(doctor);
    const result = slots.map(time => {
        const booking = appointments.find(a =>
            a.doctorId === doctor.id &&
            a.date === date &&
            a.time === time &&
            a.status !== "Cancelled"
        );

        return {
            time,
            status: booking ? "Booked" : "Available",
            patientName: booking ? booking.patientName : ""
        };
    });
    res.json(result);
});

// Book appointment
app.post("/book", (req, res) => {
    const { patientId, doctorId, date, time } = req.body;
    const patient = patients.find(p => p.id === Number(patientId));
    const doctor = doctors.find(d => d.id === Number(doctorId));

    if (!patient || !doctor) {
        return res.status(400).json({
            message: "Invalid patient or doctor"
        });
    }
    const weekday = new Date(date + "T00:00:00").getDay();
    if (
        isNaN(new Date(date + "T00:00:00").getTime()) ||
        !doctor.workingDays.includes(weekday) ||
        !generateSlots(doctor).includes(time) ||
        new Date(date + "T" + time + ":00") <= new Date()
    ) {
        return res.status(400).json({
            message: "Invalid or unavailable date/time"
        });
    }
    // Double-booking check
    const exists = appointments.some(a =>
        Number(a.doctorId) === Number(doctorId) &&
        a.date === date &&
        a.time === time &&
        a.status !== "Cancelled"
    );
    if (exists) {
        return res.status(409).json({
            message: "This slot is already booked!"
        });
    }
    const appointment = {
        id: Date.now(),
        patientId: patient.id,
        doctorId: doctor.id,
        patientName: patient.name,
        doctorName: doctor.name,
        date,
        time,
        status: "Booked"
    };
    appointments.push(appointment);
    addNotification(
        patient.name + " booked an appointment with " +
        doctor.name + " on " + date + " at " + time,
        doctor.id,
        patient.id
    );
    res.json({
        message: "Appointment booked successfully!"
    });
});

// Get appointments
app.get("/appointments", (req, res) => {
    res.json(appointments);
});

// Cancel appointment
app.put("/cancel/:id", (req, res) => {
    const appointment = appointments.find(
        a => a.id === Number(req.params.id)
    );
    if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = "Cancelled";
    addNotification(
        appointment.patientName + " cancelled their appointment",
        appointment.doctorId,
        appointment.patientId
    );
    res.json({ message: "Appointment cancelled" });
});

// Reschedule appointment
app.put("/reschedule/:id", (req, res) => {
    const appointment = appointments.find(
        a => a.id === Number(req.params.id)
    );
    if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.status === "Cancelled") {
        return res.status(400).json({ message: "Appointment is cancelled" });
    }
    const { date, time } = req.body;
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const weekday = new Date(date + "T00:00:00").getDay();
    if (
        isNaN(new Date(date + "T00:00:00").getTime()) ||
        !doctor.workingDays.includes(weekday) ||
        !generateSlots(doctor).includes(time) ||
        new Date(date + "T" + time + ":00") <= new Date()
    ) {
        return res.status(400).json({ message: "Invalid date or time" });
    }
    const conflict = appointments.find(a =>
        a.id !== appointment.id &&
        a.doctorId === appointment.doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== "Cancelled"
    );
    if (conflict) {
        return res.status(409).json({ message: "Slot already booked" });
    }
    appointment.date = date;
    appointment.time = time;
    addNotification(
        appointment.patientName + " rescheduled their appointment",
        appointment.doctorId,
        appointment.patientId
    );
    res.json({ message: "Appointment rescheduled successfully" });
});


// Update status
app.put("/status/:id", (req, res) => {
    const appointment = appointments.find(
        a => a.id === Number(req.params.id)
    );
    if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
    }
    const allowed = ["Booked", "Completed", "Cancelled"];
    if (!allowed.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    appointment.status = req.body.status;
    addNotification(
        "Appointment status updated to " + req.body.status,
        appointment.doctorId,
        appointment.patientId
    );
    res.json({ message: "Status updated" });
});


// Get notifications
app.get("/notifications", (req, res) => {
    res.json(notifications);
});

app.get("/", (req, res) => {
    res.send("MediCare Backend is running!");
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});
