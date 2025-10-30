import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DiscussionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchDiscussion();
    // eslint-disable-next-line
  }, [id]);

  const fetchDiscussion = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/discussions/${id}`);
      setDiscussion(res.data);
    } catch (err) {
      console.error('Fetch discussion error:', err);
      setDiscussion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const payload = {
        content: replyText,
        author: user?.id || user?._id
      };
      const res = await API.post(`/discussions/${id}/reply`, payload);
      setDiscussion(res.data);
      setReplyText('');
    } catch (err) {
      console.error('Reply error:', err);
      alert('Failed to post reply');
    }
  };

  if (loading) return <div className="container py-4"><p>Loading...</p></div>;
  if (!discussion) return <div className="container py-4"><p>Discussion not found.</p></div>;

  return (
    <div className="container py-4">
      <div className="card mb-3">
        <div className="card-body">
          <h3>{discussion.title}</h3>
          <p>{discussion.content}</p>
          <small className="text-muted">By {discussion.author?.name || discussion.author?.email || 'Unknown'} · {new Date(discussion.createdAt).toLocaleString()}</small>
        </div>
      </div>

      <div className="mb-3">
        <h5>Replies ({discussion.replies?.length || 0})</h5>
        {discussion.replies?.map((r, idx) => (
          <div key={idx} className="card mb-2">
            <div className="card-body">
              <p>{r.content}</p>
              <small className="text-muted">By {r.author?.name || r.author?.email || 'Unknown'} · {new Date(r.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleReply}>
            <div className="mb-2">
              <textarea
                className="form-control"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="3"
                placeholder="Write a reply..."
                required
              />
            </div>
            <div>
              <button className="btn btn-primary" type="submit">Post Reply</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;
