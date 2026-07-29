import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import "./Auth.css";

function Signup({ onSwitch, onSuccess }) {
    const { setUser } = useContext(MyContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async () => {
        try {
            const response = await fetch("https://sigmagpt-sne6.onrender.com/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password })
            });
            const res = await response.json();
            if (!response.ok) return setError(res.error);
            setUser(res.name);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="authContainer">
            <h2>Sign Up</h2>
            {error && <p className="authError">{error}</p>}
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Sign Up</button>
            <p>Pehle se account hai? <span onClick={onSwitch}>Login</span></p>
        </div>
    );
}

export default Signup;