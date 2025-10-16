export const sendMessageToChatbot = async (message) => {
  const response = await fetch('http://localhost:5001/api/chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return data.reply;
};

/* 
chatbot UI component (for example Chatbot.jsx):
import React, { useState } from 'react';
import { sendMessageToChatbot } from '../services/chatbotService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const reply = await sendMessageToChatbot(input);
    const botMessage = { sender: 'bot', text: reply };
    setMessages((prev) => [...prev, botMessage]);
    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask CampusLearn Assistant..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;
*/