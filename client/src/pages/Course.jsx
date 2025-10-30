import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { coursesAPI, usersAPI } from '../api.js'; // ✅ use centralized API

function AssignStudent() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Fetch all courses & students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [coursesRes, studentsRes] = await Promise.all([
          coursesAPI.getAll(),
          usersAPI.getAllStudents()
        ]);

        setCourses(coursesRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load courses or students. Please try again later.');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Assign student to course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCourse || !selectedStudent) {
      setError('Please select both a course and a student.');
      return;
    }

    try {
      setLoading(true);
      const res = await coursesAPI.assignStudent(selectedCourse, selectedStudent);

      if (res.status === 200 || res.status === 201) {
        setSuccess('✅ Student successfully added to course!');
        setSelectedCourse('');
        setSelectedStudent('');
        setTimeout(() => navigate('/tutor-dashboard'), 1500);
      } else {
        setError(res.data?.message || 'Failed to assign student.');
      }
    } catch (err) {
      console.error('Error assigning student:', err);
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Assign Student to Course</h1>
          <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="card shadow-sm border-0 p-4 bg-light">
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {success && <div className="alert alert-success mb-3">{success}</div>}

          {fetching ? (
            <div className="text-center py-4">
              <div className="spinner-border text-dark" role="status"></div>
              <p className="mt-2 fw-semibold">Loading data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Select Course */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Select Course</label>
                <select
                  className="form-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={fetching}
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title || course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Student */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Select Student</label>
                <select
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={fetching}
                >
                  <option value="">-- Choose a student --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.fullName || student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 fw-semibold"
                disabled={loading || fetching}
              >
                {loading ? 'Assigning...' : 'Assign Student'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AssignStudent;
