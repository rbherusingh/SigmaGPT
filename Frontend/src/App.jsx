import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://sigmagpt-sne6.onrender.com/api/auth/me", {
                    credentials: "include"
                });
                const res = await response.json();
                if (res.success) setUser(res.name);
            } catch (err) {
                console.log(err);
            }
        };
        checkAuth();
    }, []);

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
        user, setUser
    };

    return (
        <MyContext.Provider value={providerValues}>
            {!user ? (
                <div className="authWrapper">
                    {showLogin
                        ? <Login onSwitch={() => setShowLogin(false)} />
                        : <Signup onSwitch={() => setShowLogin(true)} />
                    }
                </div>
            ) : (
                <div className='app'>
                    <Sidebar />
                    <ChatWindow />
                </div>
            )}
        </MyContext.Provider>
    );
}

export default App;