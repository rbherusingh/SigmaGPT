import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import "./Auth.css";

function Login({ onSwitch }) {
    const { setUser } = useContext(MyContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
           const response = await fetch("https://sigmagpt-sne6.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
            const res = await response.json();
            if (!response.ok) return setError(res.error);
            setUser(res.name);
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="authContainer">
            <h2>Login</h2>
            {error && <p className="authError">{error}</p>}
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>Account nahi hai? <span onClick={onSwitch}>Sign Up</span></p>
        </div>
    );
}

export default Login;