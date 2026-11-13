# MediCare Appointment Management

A simple hospital appointment app with a React/Vite frontend and an Express API. Patients can browse doctors, view available slots, book or cancel appointments, and see notifications. Doctors can view their schedules and update appointment status.

## Project structure

```text
appointment-management/
├── backend/   Express API and sample patient data
└── frontend/  React app built with Vite
```

## Requirements

- Node.js 
- npm

## Run locally

Open two terminal windows from the project directory.

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start the frontend

Then, in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Sample login accounts

Use the patient or doctor name and email exactly as listed below. These are demo accounts, not password-protected credentials.

| Role | Name | Email |
| --- | --- | --- |
| Patient | Rahul | rahul.patient@gmail.com |
| Doctor | Dr. Priya | priya@gmail.com |
