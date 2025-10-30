import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth(); // logged-in user
  const [recipientId, setRecipientId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // If you have a list of users, you can render contacts and set recipientId by clicking them.
  useEffect(() => {}, []);

  const fetchConversation = async () => {
    if (!recipientId) {
      alert('Enter recipient user id (or implement contacts list).');
      return;
    }
    setLoading(true);
    try {
      // try API endpoint pattern /messages/:user1/:user2
      const res = await API.get(`/messages/${user?.id || user?._id}/${recipientId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Fetch conversation error:', err);
      alert('Could not fetch conversation. Check backend endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientId || !text.trim()) return;
    try {
      const payload = {
        sender: user?.id || user?._id,
        receiver: recipientId,
        message: text
      };
      const res = await API.post('/messages', payload);
      // append locally
      setMessages(prev => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="container py-4">
      <h2>Messages</h2>

      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label">Recipient (user id)</label>
          <input
            className="form-control mb-2"
            placeholder="Enter recipient user id"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
          <div>
            <button className="btn btn-outline-primary me-2" onClick={fetchConversation}>Load Conversation</button>
          </div>
        </div>
      </div>

      <div className="card mb-3" style={{ minHeight: 200 }}>
        <div className="card-body">
          {loading ? <p>Loading messages...</p> : (
            messages.length === 0 ? <p>No messages yet</p> :
            messages.map(m => (
              <div key={m._id || `${m.sender}-${m.createdAt}`} className={`mb-2 ${m.sender === (user?.id || user?._id) ? 'text-end' : ''}`}>
                <div className={`d-inline-block p-2 rounded ${m.sender === (user?.id || user?._id) ? 'bg-success text-white' : 'bg-light'}`}>
                  <small className="d-block text-muted">{m.sender === (user?.id || user?._id) ? 'You' : m.sender}</small>
                  <div>{m.message}</div>
                  <small className="d-block text-muted">{new Date(m.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={handleSend}>
        <div className="mb-2">
          <textarea className="form-control" rows="2" placeholder="Write a message..." value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={!recipientId}>Send</button>
        </div>
      </form>
    </div>
  );
};

export default Messages;
