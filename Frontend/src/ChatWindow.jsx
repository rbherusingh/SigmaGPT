import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, setUser} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    // Keyboard aane pe height adjust karo
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

    // Dropdown band karo bahar tap karne pe
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
        if(!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://sigmagpt-sne6.onrender.com/api/chat", options);
            const res = await response.json();

            if(!response.ok) {
                alert("Message send nahi hua, dobara try karo.");
                setLoading(false);
                return;
            }

            setReply(res.reply);
        } catch(err) {
            alert("Server se connection nahi ho pa raha. Check karo backend chalu hai.");
            console.log(err);
        }

        setLoading(false);
    }

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await fetch("https://sigmagpt-sne6.onrender.com/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        setUser(null);
    };

    return (
        <div className="chatWindow" style={{height: `${windowHeight}px`}}>
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

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
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;