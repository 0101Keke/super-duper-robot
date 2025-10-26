import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Nav from '../components/Nav.jsx';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  }, [api, courseId]);

  const handleSubmitAssignment = async (assignmentId) => {
    if (!selectedFile) return alert('Please select a file first!');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post(`/assignments/${courseId}/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Assignment submitted successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('❌ Failed to submit assignment.');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center py-5 text-danger">Course not found.</div>;
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-green shadow-sm">
        <div className="container-fluid">
          <Nav />
        </div>
      </nav>

      <div className="container py-4">
        <h2 className="text-dark mb-2">{course.title}</h2>
        <p className="text-muted">{course.description}</p>

        <hr />

        <h4>📘 Resources</h4>
        <div className="row">
          {course.resources?.length > 0 ? (
            course.resources.map((r, i) => (
              <div key={i} className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm">
                  <h6>{r.name}</h6>
                  <p className="small text-muted">{r.type}</p>
                  <a
                    href={`http://localhost:5000${r.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success"
                  >
                    View / Download
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No resources uploaded yet.</p>
          )}
        </div>

        <hr />

        <h4>🧾 Assignments</h4>
        {course.assignments?.length > 0 ? (
          course.assignments.map((a) => (
            <div key={a._id} className="card p-3 mb-3 shadow-sm">
              <h5>{a.title}</h5>
              <p className="text-muted">{a.description}</p>
              <p>
                <strong>Deadline:</strong>{' '}
                {new Date(a.deadline).toLocaleDateString()}
              </p>

              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button
                onClick={() => handleSubmitAssignment(a._id)}
                className="btn btn-dark"
              >
                Submit Assignment
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted">No assignments available yet.</p>
        )}

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default CourseDetail;
