import React, { useState } from "react";
import "./chatbot.css";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  // Quick actions (like in AI Studio)
  const handleQuickAction = (action) => {
    setUserInput(action);
    handleSend(action);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h1>CampusLearn Assistant</h1>
        <p>Your academic guide, ready to help you succeed!</p>
      </div>

      <div className="quick-actions">
        <button onClick={() => handleQuickAction("Find Tutor")}>
          🎓 Find Tutor
        </button>
        <button onClick={() => handleQuickAction("View Resources")}>
          📚 View Resources
        </button>
        <button onClick={() => handleQuickAction("Book Session")}>
          📅 Book Session
        </button>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          placeholder="Type your message..."
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send ➤</button>
      </div>
    </div>
  );
}

export default Chatbot;

