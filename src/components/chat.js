import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import {
  ref,
  push,
  onChildAdded,
  serverTimestamp,
  query,
  orderByChild,
} from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Css/Chat.css";

function Chat() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const chatRef = ref(db, "family-chat");
    await push(chatRef, {
      text: trimmedMessage,
      createdAt: serverTimestamp(),
      uid: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName || "Anonymous",
    });

    setInputMessage("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isFamilyMember");
    navigate("/login");
  };

  useEffect(() => {
    const chatRef = query(ref(db, "family-chat"), orderByChild("createdAt"));
    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const message = snapshot.val();
      if (message?.text) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="row">
          <h2>GyatChat 💬 (Family)</h2>
          <div className="hamburger-wrapper">
            <div
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <div className={`bar ${menuOpen ? "open" : ""}`}></div>
              <div className={`bar ${menuOpen ? "open" : ""}`}></div>
              <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            </div>
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
                {localStorage.getItem("isFamilyMember") === "true" && (
                  <button className="chat-btn" onClick={() => navigate("/global-chat")}>
                    Global Chat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <h5 className="user-name">
          Welcome {auth.currentUser?.displayName || "Loading..."}
        </h5>
      </header>

      <div className="messages-container">
        <div className="first-message-indicator">
          Note: Messages are visible to family members only.
        </div>

        {messages.length === 0 ? (
          <div className="loading-message">No messages yet.</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.uid === auth.currentUser?.uid ? "own-message" : ""
              }`}
            >
              <div className="message-header">
                <strong>{msg.name}</strong>
              </div>
              <p>{msg.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" disabled={!inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
