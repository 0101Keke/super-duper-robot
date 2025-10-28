import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Nav from '../components/Nav.jsx';

const Discussions = () => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    loadDiscussions();
  }, [loadDiscussions]);

  const loadDiscussions = async () => {
    const res = await api.get(`/discussions/${courseId}`);
    setDiscussions(res.data);
  };

  const handleCreate = async () => {
    await api.post(`/discussions/${courseId}`, { title, content });
    setTitle('');
    setContent('');
    loadDiscussions();
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-green shadow-sm">
        <div className="container-fluid">
          <Nav />
        </div>
      </nav>

      <div className="container py-4">
        <h3>💬 Course Discussions</h3>

        <div className="mb-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Topic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button className="btn btn-success" onClick={handleCreate}>
            Post Discussion
          </button>
        </div>

        {discussions.map((d) => (
          <div key={d._id} className="card p-3 mb-3 shadow-sm">
            <h5>{d.title}</h5>
            <p>{d.content}</p>
            <small className="text-muted">by {d.author?.fullName}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussions;
