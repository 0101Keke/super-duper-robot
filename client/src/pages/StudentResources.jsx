import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import StudentNav from '../Components/StudentNav.jsx';
import Footer from '../components/Footer.jsx';

function StudentResources() {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/resources/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(res.data.resources || []);
        setCourseTitle(res.data.courseTitle || 'Course');
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    };
    fetchResources();
  }, [courseId, token]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <StudentNav />
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4 text-center">{courseTitle} Resources</h2>
        <div className="row g-3">
          {resources.map((r, index) => (
            <div key={index} className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <i className="fas fa-file-alt fa-2x text-primary mb-3"></i>
                  <h6 className="fw-semibold">{r.name}</h6>
                  <p className="text-muted small">{r.type}</p>
                  <a
                    href={`http://localhost:5000${r.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm mt-2"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}

          {resources.length === 0 && (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-folder-open fa-3x mb-3"></i>
              <p>No resources uploaded yet for this course.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentResources;
