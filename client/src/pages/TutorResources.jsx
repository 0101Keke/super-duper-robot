import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TutorResources() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !file) return setMessage('Please select a course and file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/resources/upload/${selectedCourse}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMessage('✅ Upload successful!');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <div className="container my-5 flex-grow-1" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Upload Course Resource</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">Select Course</label>
          <select
            className="form-select mb-3"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Choose a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <label className="form-label fw-bold">Choose File</label>
          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default TutorResources;
