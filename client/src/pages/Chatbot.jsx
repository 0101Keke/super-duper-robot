import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./chatbot.css";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

if (data.structured) {
  let structuredHTML = "";

  if (data.type === "tutor") {
    structuredHTML = `
      <div class="structured-reply">
        <h5 class="fw-bold text-success">${data.data.title}</h5>
        <p>${data.data.description}</p>
        ${data.data.tutors
          .map(
            (t) => `
            <div class="tutor-card border p-2 rounded mb-2">
              <strong>${t.name}</strong><br>
              📧 ${t.email}<br>
              🧾 Bio: ${t.bio}<br>
              🆔 Staff ID: ${t.staffId}
            </div>
          `
          )
          .join("")}
      </div>
    `;
  } else if (data.type === "resource") {
    structuredHTML = `
      <div class="structured-reply">
        <h5 class="fw-bold text-primary">${data.data.title}</h5>
        <p>${data.data.description}</p>
        ${data.data.resources
          .map(
            (r) => `
            <div class="resource-card border p-2 rounded mb-2">
              <strong>${r.title}</strong><br>
              📘 Course: ${r.course}<br>
              💡 Type: ${r.fileType}<br>
              👨‍🏫 Tutor: ${r.tutor}<br>
              🔗 <a href="${r.fileUrl}" target="_blank" class="text-success">Open Resource</a>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  setMessages((prev) => [...prev, { sender: "bot", text: structuredHTML }]);
}
 else {
  // Handle normal text (Gemini)
  const structuredReply = formatReply(data.reply);
  setMessages((prev) => [...prev, { sender: "bot", text: structuredReply }]);
}

    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format Gemini's raw text output into readable UI
  const formatReply = (reply) => {
    if (!reply) return "No response.";
    return reply
      .replace(/\n- /g, "<br>• ")
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const handleQuickAction = (action) => {
    setUserInput(action);
    handleSend(action);
  };

  return (
    <div className="chatbot-page d-flex flex-column min-vh-100 bg-light">
      {/* ✅ Header (with Nav included inside) */}
      <Header />

      {/* ✅ Chatbot Section */}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="chatbot-container shadow-sm p-3 bg-white rounded" style={{ maxWidth: "900px", width: "100%" }}>
          <div className="chat-header text-center mb-3">
            <h1 className="fw-bold text-success">CampusLearn Assistant</h1>
            <p className="text-muted">Your academic guide, ready to help you succeed! 🌟</p>
          </div>

          <div className="quick-actions d-flex justify-content-center gap-3 mb-3">
            <button className="btn btn-outline-success" onClick={() => handleQuickAction("Find Tutor")}>
              🎓 Find Tutor
            </button>
            <button className="btn btn-outline-success" onClick={() => handleQuickAction("View Resources")}>
              📚 View Resources
            </button>
            
          </div>

          <div className="chat-window border rounded p-3 mb-3" id="message-container" style={{ height: "400px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender} mb-2`}
              >
                <div
                  className={`content p-2 rounded ${msg.sender === "user" ? "bg-success text-white" : "bg-light border"}`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="content loading">Typing...</div>
              </div>
            )}
          </div>

          <div className="chat-input-section">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              id="chat-form"
              className="d-flex border rounded overflow-hidden"
            >
              <input
                type="text"
                id="chat-input"
                value={userInput}
                placeholder="Type your question..."
                onChange={(e) => setUserInput(e.target.value)}
                className="form-control border-0"
              />
              <button
                type="submit"
                id="send-button"
                className="btn btn-success d-flex align-items-center justify-content-center"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}

export default Chatbot;
