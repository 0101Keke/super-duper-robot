import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await API.get('/discussions');
      setDiscussions(res.data || []);
    } catch (err) {
      console.error('Fetch discussions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const payload = {
        title,
        content,
        author: user?.id || user?._id
      };
      const res = await API.post('/discussions', payload);
      setTitle('');
      setContent('');
      // add to top
      setDiscussions(prev => [res.data, ...prev]);
      navigate(`/discussions/${res.data._id}`);
    } catch (err) {
      console.error('Create discussion error:', err);
      alert('Could not create discussion. Check console.');
    }
  };

  return (
    <div className="container py-4">
      <h2>Campus Discussions</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Start a new discussion</h5>
          <form onSubmit={handleCreate}>
            <div className="mb-2">
              <input
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Write something..."
                rows="3"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <button className="btn btn-success" type="submit">Create Discussion</button>
            </div>
          </form>
        </div>
      </div>

      <div>
        {loading ? <p>Loading discussions...</p> :
          (discussions.length === 0 ? <p>No discussions yet.</p> :
            discussions.map(d => (
              <div key={d._id} className="card mb-2">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h5 style={{ cursor: 'pointer' }} onClick={() => navigate(`/discussions/${d._id}`)}>
                      {d.title}
                    </h5>
                    <p className="text-muted small mb-1">{d.content?.slice(0, 140)}{d.content?.length > 140 ? '...' : ''}</p>
                    <small className="text-muted">By {d.author?.name || d.author?.email || 'Unknown'}</small>
                  </div>
                  <div>
                    <small className="text-muted">{new Date(d.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  );
};

export default Discussions;
