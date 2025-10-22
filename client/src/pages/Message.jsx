import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // 🔗 Direct backend endpoints (no API abstraction)
  const CONVERSATIONS_URL = 'http://localhost:5000/api/messages/conversations';
  const MESSAGES_URL = (userId) => `http://localhost:5000/api/messages/${userId}`;
  const SEND_MESSAGE_URL = 'http://localhost:5000/api/messages';

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await fetch(CONVERSATIONS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load conversations`);
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConversation) {
          selectConversation(data[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Conversations error:', err);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = async (conversation) => {
    setActiveConversation(conversation);
    setLoadingMessages(true);
    setError(null);

    try {
      const userId = conversation.otherUser?.id || conversation.id;
      const res = await fetch(MESSAGES_URL(userId));
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load messages`);
      const messageList = await res.json();
      setMessages(messageList);
    } catch (err) {
      setError(err.message);
      setMessages([]);
      console.error('Messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const text = newMessage.trim();
    const recipientId = activeConversation.otherUser?.id || activeConversation.id;

    // Optimistic UI update
    const tempMsg = {
      id: 'temp-' + Date.now(),
      content: text,
      senderId: 'current-user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    try {
      const res = await fetch(SEND_MESSAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, message: text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to send message`);
      }

      const sentMsg = await res.json();
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMsg.id ? { ...sentMsg, id: sentMsg.id || tempMsg.id } : msg))
      );
    } catch (err) {
      setError(err.message);
      // Revert optimistic update
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMsg.id));
      console.error('Send error:', err);
    }
  };

  const isCurrentUser = (senderId) => senderId === 'current-user';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1 py-4">
        <div className="row">
          {/* Conversations Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="bg-light p-3 rounded shadow-sm h-100">
              <h5 className="fw-bold mb-3">Chats</h5>

              {error && <div className="alert alert-danger small p-2 mb-2">{error}</div>}

              {loadingConversations ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-muted text-center small">No conversations</p>
              ) : (
                <ul className="list-group">
                  {conversations.map((conv) => (
                    <li
                      key={conv.id}
                      className={`list-group-item list-group-item-action ${
                        activeConversation?.id === conv.id ? 'active' : ''
                      }`}
                      onClick={() => selectConversation(conv)}
                      style={{ cursor: 'pointer' }}
                    >
                      {conv.otherUser?.name || 'Unknown User'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-md-9">
            {activeConversation ? (
              <div
                className="bg-light p-3 rounded shadow-sm d-flex flex-column"
                style={{ height: '75vh' }}
              >
                <div className="border-bottom pb-2 mb-3">
                  <h5 className="mb-0">
                    Chat with{' '}
                    <span className="text-success">
                      {activeConversation.otherUser?.name || 'User'}
                    </span>
                  </h5>
                </div>

                <div
                  className="flex-grow-1 overflow-auto mb-3 p-2 bg-white rounded"
                  style={{ maxHeight: '55vh' }}
                >
                  {loadingMessages ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-muted text-center small">No messages yet</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-2 ${
                          isCurrentUser(msg.senderId) ? 'text-end' : 'text-start'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-3 d-inline-block ${
                            isCurrentUser(msg.senderId)
                              ? 'bg-dark text-white'
                              : 'bg-success text-white'
                          }`}
                          style={{ maxWidth: '80%' }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={loadingMessages}
                  />
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={!newMessage.trim() || loadingMessages}
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-light p-3 rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
                <p className="text-muted">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Messages;