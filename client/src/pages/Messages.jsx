import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id; // ✅ fixed ID handling
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter(c =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, contacts]);

  useEffect(() => {
    // Auto-scroll to bottom when new message arrives
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await API.get('/messages/contacts');
      const others = res.data.filter(u => u._id !== userId);
      setContacts(others);
      setFilteredContacts(others);
    } catch (err) {
      console.error('Fetch contacts error:', err);
    }
  };

  const fetchConversation = async (contact) => {
    try {
      setSelectedContact(contact);
      const res = await API.get(`/messages/${userId}/${contact._id}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Fetch conversation error:', err);
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedContact || !text.trim()) return;
    try {
      const payload = {
        sender: userId,
        receiver: selectedContact._id,
        message: text
      };
      const res = await API.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left side - Contacts */}
        <div className="col-md-4 border-end">
          <h5 className="mb-3">Contacts</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="list-group" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            {filteredContacts.length > 0 ? (
              filteredContacts.map(c => (
                <li
                  key={c._id}
                  className={`list-group-item ${selectedContact?._id === c._id ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => fetchConversation(c)}
                >
                  <strong>{c.name || c.email}</strong><br />
                  <small className="text-muted">{c.role}</small>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No users found</li>
            )}
          </ul>
        </div>

        {/* Right side - Messages */}
        <div className="col-md-8">
          {selectedContact ? (
            <>
              <h5 className="mb-3">Chat with {selectedContact.name || selectedContact.email}</h5>
              <div
                className="border p-3 mb-3 bg-light rounded"
                style={{ height: '400px', overflowY: 'auto' }}
              >
                {messages.length === 0 && (
                  <p className="text-muted">No messages yet. Start the conversation!</p>
                )}
                {messages.map(m => (
                  <div
                    key={m._id}
                    className={`mb-2 ${m.sender === userId ? 'text-end' : 'text-start'}`}
                  >
                    <div
                      className={`d-inline-block p-2 rounded ${
                        m.sender === userId ? 'bg-primary text-white' : 'bg-white'
                      }`}
                    >
                      <div>{m.message}</div>
                      <small className="d-block text-muted" style={{ fontSize: '0.8em' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              <form onSubmit={handleSend} className="d-flex">
                <input
                  className="form-control me-2"
                  placeholder="Type a message..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <button className="btn btn-success" type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="text-muted text-center mt-5">
              <p>Select a contact to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
