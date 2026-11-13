
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "patients.json");
// Load saved patients
let patients = [];
if (fs.existsSync(filePath)) {
    patients = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Save patients to JSON file
function savePatients() {
    fs.writeFileSync(
        filePath,
        JSON.stringify(patients, null, 4)
    );
}
const doctors = [
    {
        id: 1,
        name: "Dr. Asha",
        email: "asha@gmail.com",
        specialization: "Cardiologist",
        start: "09:00",
        workingDays: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 2,
        name: "Dr. Rahul",
        email: "rahul.doctor@gmail.com",
        specialization: "Dermatologist",
        start: "10:00",
        workingDays: [1, 2, 3, 4, 5]
    },
    {
        id: 3,
        name: "Dr. Priya",
        email: "priya@gmail.com",
        specialization: "Pediatrician",
        start: "09:00",
        workingDays: [1, 2, 3, 4, 5, 6]
    }
];

const appointments = [];
const notifications = [];

module.exports = {
    doctors,
    patients,
    appointments,
    notifications,
    savePatients
};
