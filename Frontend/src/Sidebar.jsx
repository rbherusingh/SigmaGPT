import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function Sidebar() {
    const {
        allThreads, setAllThreads,
        currThreadId, setCurrThreadId,
        setNewChat, setPrompt, setReply,
        setPrevChats, user, setUser
    } = useContext(MyContext);

    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const getAllThreads = async () => {
        try {
            const response = await fetch("https://sigmagpt-sne6.onrender.com/api/thread", {
                credentials: "include"
            });
            if (!response.ok) { alert("Threads load nahi hue, dobara try karo."); return; }
            const res = await response.json();
            setAllThreads(res.map(thread => ({ threadId: thread.threadId, title: thread.title })));
        } catch (err) {
            alert("Server se connection nahi ho pa raha.");
            console.log(err);
        }
    };

    useEffect(() => { getAllThreads(); }, [currThreadId]);

    // Dropdown se login/signup modal open karne ke liye
    useEffect(() => {
        const openLogin = () => { setShowLogin(true); setShowAuthModal(true); };
        const openSignup = () => { setShowLogin(false); setShowAuthModal(true); };
        document.addEventListener('openLogin', openLogin);
        document.addEventListener('openSignup', openSignup);
        return () => {
            document.removeEventListener('openLogin', openLogin);
            document.removeEventListener('openSignup', openSignup);
        };
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsOpen(false);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setIsOpen(false);
        try {
            const response = await fetch(`https://sigmagpt-sne6.onrender.com/api/thread/${newThreadId}`);
            if (!response.ok) { alert("Chat load nahi hua, dobara try karo."); return; }
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            alert("Server se connection nahi ho pa raha.");
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`https://sigmagpt-sne6.onrender.com/api/thread/${threadId}`, { method: "DELETE" });
            if (!response.ok) { alert("Thread delete nahi hua, dobara try karo."); return; }
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) createNewChat();
        } catch (err) {
            alert("Server se connection nahi ho pa raha.");
            console.log(err);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("https://sigmagpt-sne6.onrender.com/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.log(err);
        }
        setUser(null);
    };

    return (
        <>
            {!isOpen && (
                <button className="hamburger" onClick={() => setIsOpen(true)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            )}

            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
            )}

            <section className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebarTop">
                    <button className="sidebarHamburger" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <button className="newChatBtn" onClick={createNewChat}>
                        <img src="/blacklogo.png" alt="gpt logo" className="logo" />
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>

                <ul className="history">
                    {allThreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }}
                            ></i>
                        </li>
                    ))}
                </ul>

                {/* AUTH SECTION */}
                <div className="sidebarAuth">
                    {user ? (
                        <>
                            <p className="sidebarUsername">👤 {user}</p>
                            <button className="authBtn logoutBtn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="authBtn loginBtn" onClick={() => { setShowLogin(true); setShowAuthModal(true); setIsOpen(false); }}>
                                Login
                            </button>
                            <button className="authBtn signupBtn" onClick={() => { setShowLogin(false); setShowAuthModal(true); setIsOpen(false); }}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                <div className="sign">
                    <p>By Bheru Singh &hearts;</p>
                </div>
            </section>

            {/* AUTH MODAL */}
            {showAuthModal && (
                <div className="authModalOverlay" onClick={() => setShowAuthModal(false)}>
                    <div className="authModalBox" onClick={(e) => e.stopPropagation()}>
                        <button className="authModalClose" onClick={() => setShowAuthModal(false)}>✕</button>
                        {showLogin
                            ? <Login onSwitch={() => setShowLogin(false)} onSuccess={() => setShowAuthModal(false)} />
                            : <Signup onSwitch={() => setShowLogin(true)} onSuccess={() => setShowAuthModal(false)} />
                        }
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;