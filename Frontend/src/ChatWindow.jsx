import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, user, setUser } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport ? window.visualViewport.height : window.innerHeight);
        };
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        } else {
            window.addEventListener('resize', handleResize);
        }
        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            } else {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isOpen && !e.target.closest('.userIconDiv') && !e.target.closest('.dropDown')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isOpen]);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        try {
            const response = await fetch("https://sigmagpt-sne6.onrender.com/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: prompt, threadId: currThreadId })
            });
            const res = await response.json();

            if (!response.ok) {
                alert("Message send nahi hua, dobara try karo.");
                setLoading(false);
                return;
            }

            setReply(res.reply);
        } catch (err) {
            alert("Server se connection nahi ho pa raha.");
            console.log(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply]);

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
        <div className="chatWindow" style={{
            height: `${windowHeight}px`,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%'
        }}>
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    {user ? (
                        <div className="dropDownItem" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </div>
                    ) : (
                        <div className="dropDownItem" onClick={() => {
                            setIsOpen(false);
                            // sidebar open karne ka signal — user sidebar se login kare
                        }}>
                            <i className="fa-solid fa-right-to-bracket"></i> Log in
                        </div>
                    )}
                </div>
            )}

            <Chat />

            <div className="loader">
                <ScaleLoader color="#fff" loading={loading} />
            </div>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        id="chatInput"
                        name="chatInput"
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;