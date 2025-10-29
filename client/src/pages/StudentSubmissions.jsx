import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Submissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [file, setFile] = useState(null);
  const [assignmentId, setAssignmentId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await API.get('/submissions/my');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Fetch submissions failed:', err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !assignmentId) {
      return setMessage('Please select a file and assignment.');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      await API.post(`/submissions/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Submission uploaded successfully!');
      setFile(null);
      setAssignmentId('');
      fetchSubmissions();
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <div className="container py-5 flex-grow-1">
        <h2 className="text-center text-success mb-4">My Submissions</h2>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
          <div className="mb-3">
            <label className="form-label">Assignment ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Assignment ID"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload File</label>
            <input type="file" className="form-control" onChange={handleFileChange} required />
          </div>

          <button className="btn btn-success w-100" type="submit">
            Submit Assignment
          </button>
        </form>

        <h4 className="mt-4">Previous Submissions</h4>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>File</th>
                <th>Submitted</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? (
                submissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.assignment?.title || 'Untitled'}</td>
                    <td>
                      <a href={`http://localhost:5000${s.fileUrl}`} target="_blank" rel="noreferrer">
                        View File
                      </a>
                    </td>
                    <td>{new Date(s.submittedAt).toLocaleString()}</td>
                    <td>{s.grade ?? 'Pending'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Submissions;
