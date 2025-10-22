import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function TopicsManager() {
  // State for topics list
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for creating new topic
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // State for viewing single topic
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [comments, setComments] = useState([
    { id: 1, user: 'User1', text: 'Great topic!' },
    { id: 2, user: 'User2', text: 'I totally agree.' }
  ]);
  const [newComment, setNewComment] = useState('');

  // State for active tab
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'view'

  // Fetch all topics when page loads
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/topics');
      if (!response.ok) throw new Error('Failed to fetch topics');
      const data = await response.json();
      setTopics(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle creating new topic
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create topic');
      }

      const result = await response.json();
      
      // Add new topic to list
      setTopics([...topics, result.topic]);
      
      // Clear form
      setNewTitle('');
      setNewDescription('');
      setCreateSuccess(true);
      
      // Switch to list view after 2 seconds
      setTimeout(() => {
        setActiveTab('list');
        setCreateSuccess(false);
      }, 2000);

    } catch (err) {
      setCreateError(err.message);
    }
  };

  // Handle viewing a topic
  const handleViewTopic = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`);
      if (!response.ok) throw new Error('Topic not found');
      const data = await response.json();
      setSelectedTopic(data);
      setActiveTab('view');
      
      // Reset comments for demo (in real app, fetch from backend)
      setComments([
        { id: 1, user: 'User1', text: 'Great topic!' },
        { id: 2, user: 'User2', text: 'I totally agree.' }
      ]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle adding comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: 'CurrentUser',
      text: newComment
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  // Handle deleting topic
  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete topic');

      // Remove from list
      setTopics(topics.filter(t => t.id !== topicId));
      
      // If we're viewing this topic, go back to list
      if (selectedTopic?.id === topicId) {
        setActiveTab('list');
        setSelectedTopic(null);
      }

      alert('Topic deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
               All Topics
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
               Create Topic
            </button>
          </li>
          {selectedTopic && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveTab('view')}
              >
                Select {selectedTopic.title}
              </button>
            </li>
          )}
        </ul>

        {/* TAB 1: List All Topics */}
        {activeTab === 'list' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Discussion Topics</h1>
              <button 
                className="btn btn-dark"
                onClick={() => setActiveTab('create')}
              >
                + Create New Topic
              </button>
            </div>

            {loading && (
              <div className="text-center p-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && (
              <div className="row g-4">
                {topics.length === 0 ? (
                  <div className="col-12">
                    <p className="text-muted text-center">
                      No topics yet. Be the first to create one!
                    </p>
                  </div>
                ) : (
                  topics.map((topic) => (
                    <div key={topic.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">{topic.title}</h5>
                          <p className="card-text text-muted">{topic.description}</p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => handleViewTopic(topic.id)}
                            >
                              View Discussion →
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteTopic(topic.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Create New Topic */}
        {activeTab === 'create' && (
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <h1 className="mb-4">Create New Topic</h1>

              {createSuccess && (
                <div className="alert alert-success">
                   Topic created successfully! Redirecting...
                </div>
              )}

              {createError && (
                <div className="alert alert-danger">{createError}</div>
              )}

              <form onSubmit={handleCreateTopic}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="e.g., Web Development Best Practices"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-semibold">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe what this topic is about..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-dark">
                    Create Topic
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveTab('list')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: View Single Topic with Comments */}
        {activeTab === 'view' && selectedTopic && (
          <div>
            {/* Topic Header */}
            <div className="mb-4">
              <button
                className="btn btn-outline-secondary btn-sm mb-3"
                onClick={() => setActiveTab('list')}
              >
                ← Back to Topics
              </button>
              <h1>{selectedTopic.title}</h1>
              <p className="text-muted lead">{selectedTopic.description}</p>
              <hr />
            </div>

            <div className="row g-4">
              {/* Post Comment Section */}
              <div className="col-md-4">
                <div className="bg-light p-4 rounded shadow-sm">
                  <h5 className="fw-semibold mb-3">Post a Comment</h5>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      className="form-control mb-3"
                      rows="3"
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-dark w-100">
                      Submit Comment
                    </button>
                  </form>
                </div>
              </div>

              {/* Topic Info Section */}
              <div className="col-md-4">
                <div className="bg-light p-4 rounded shadow-sm">
                  <h5 className="fw-semibold mb-3">Topic Info</h5>
                  <p><strong>ID:</strong> {selectedTopic.id}</p>
                  <p><strong>Title:</strong> {selectedTopic.title}</p>
                  <p><strong>Total Comments:</strong> {comments.length}</p>
                  <button
                    className="btn btn-danger btn-sm w-100 mt-3"
                    onClick={() => handleDeleteTopic(selectedTopic.id)}
                  >
                    Delete Topic
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="col-md-4">
                <div className="bg-light p-4 rounded shadow-sm">
                  <h5 className="fw-semibold mb-3">
                    Comments ({comments.length})
                  </h5>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {comments.length === 0 ? (
                      <p className="text-muted">No comments yet. Be the first!</p>
                    ) : (
                      <ul className="list-unstyled">
                        {comments.map((comment) => (
                          <li key={comment.id} className="border-bottom pb-2 mb-2">
                            <strong className="text-primary">{comment.user}:</strong>{' '}
                            {comment.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default TopicsManager;