
import { useState } from "react";

function Login({ login, register }) {
    const [role, setRole] = useState("patient");
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    function submit(e) {
        e.preventDefault();
        if (isRegister && role === "patient") {
            register(name, email);
        } else {
            login(role, name, email);
        }
    }
    return (
        <div className="login-page">
            <form className="login-card" onSubmit={submit}>
                <h1>MediCare</h1>
                <p>Hospital Appointment System</p>
                <div className="role-buttons">
                    <button type="button"
                        onClick={() => {
                            setRole("patient");
                            setIsRegister(false);
                        }}>
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRole("doctor");
                            setIsRegister(false);
                        }}>
                        Doctor
                    </button>
                </div>
                <h2> {isRegister ? "Create Account" : "Welcome Back"}</h2>
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
                <button className="primary" type="submit"> {isRegister ? "Register" : "Login"} </button>
                {role === "patient" && (
                    <p className="register-link">
                        {isRegister ? "Already have an account?" : "New patient?"}
                        <button type="button" onClick={() => setIsRegister(!isRegister)}>
                            {isRegister ? "Login" : "Register here"}
                        </button>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Login;
