import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API from '../api';
import "./chatbot.css";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
  if (!userInput.trim()) return;
  const msg = { sender: 'user', text: userInput };
  setMessages(prev => [...prev, msg]);
  setUserInput('');
  setIsLoading(true);

  try {
    const res = await API.post('/chatbot', { message: userInput });
    const data = res.data;

    // Structured handling
    if (data.type === 'tutors') {
      // render a friendly summary + create buttons for booking
      const text = data.reply + '\n' + data.data.map(t => `${t.name} — ${t.availability}`).join('\n');
      setMessages(prev => [...prev, { sender: 'bot', text, meta: data }]);
    } else if (data.type === 'resources') {
      const text = data.reply;
      setMessages(prev => [...prev, { sender: 'bot', text, meta: data }]);
    } else {
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    }
  } catch (err) {
    console.error('Chatbot error', err);
    setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
  } finally {
    setIsLoading(false);
  }
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
            <button className="btn btn-outline-success" onClick={() => handleQuickAction("Book Session")}>
              📅 Book Session
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
