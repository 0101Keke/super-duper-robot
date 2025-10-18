import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Use your Gemini API key (from Google AI Studio)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I'm CampusLearn TutorBot. I can help you find a tutor, view resources, or book a session. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const reply = result.response.text();

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong. Please try again later." },
      ]);
    }
  };

  const handlePromptClick = (promptText) => {
    setInput(promptText);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "white" }}
          >
            <path
              d="M12 3L1 9L12 15L23 9L12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12.5L5 17.5L12 21L19 17.5V12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>CampusLearn</span>
        </div>

        <div className="nav-links">
          <a href="/" className="nav-link active">
            Home
          </a>
          <a href="/student" className="nav-link">
            Student
          </a>
          <a href="/tutor" className="nav-link">
            Tutor
          </a>
          <a href="/admin" className="nav-link">
            Admin
          </a>
        </div>

        <div className="nav-actions">
          <input type="search" placeholder="Search" className="search-bar" />
          <div className="profile">
            <div className="profile-icon"></div>
            <span>Profile</span>
          </div>
        </div>
      </nav>

      <main className="chat-area">
        <div id="message-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.from}`}>
              <div className="content">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          <div id="example-prompts">
            <button className="prompt-button" onClick={() => handlePromptClick("Find Tutor")}>
              Find Tutor
            </button>
            <button className="prompt-button" onClick={() => handlePromptClick("View Resources")}>
              View Resources
            </button>
            <button className="prompt-button" onClick={() => handlePromptClick("Book Session")}>
              Book Session
            </button>
          </div>

          <form id="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              id="chat-input"
              placeholder="Type your question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              required
            />
            <button type="submit" id="send-button" aria-label="Send message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
