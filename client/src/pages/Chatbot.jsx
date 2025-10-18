import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I'm CampusLearn TutorBot — I can help you find a tutor, view resources, or book a session.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Send message to backend
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn’t get a response right now.";

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error connecting to server." },
      ]);
    }
  };

  const handlePromptClick = (promptText) => setInput(promptText);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L1 9L12 15L23 9L12 3Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12.5L5 17.5L12 21L19 17.5V12.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>CampusLearn</span>
        </div>

        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/student" className="nav-link">Student</a>
          <a href="/tutor" className="nav-link">Tutor</a>
          <a href="/admin" className="nav-link">Admin</a>
        </div>
      </nav>

      <main className="chat-area">
        <div id="message-container">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              <div className="content">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          <div id="example-prompts">
            <button className="prompt-button" onClick={() => handlePromptClick("Find Tutor")}>Find Tutor</button>
            <button className="prompt-button" onClick={() => handlePromptClick("View Resources")}>View Resources</button>
            <button className="prompt-button" onClick={() => handlePromptClick("Book Session")}>Book Session</button>
          </div>

          <form id="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              id="chat-input"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button type="submit" id="send-button" aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
