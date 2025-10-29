import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function TutorDash() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingReviews: 0,
  });

  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Simulated data load
  useEffect(() => {
    // You can replace this with API calls later
    setTimeout(() => {
      setStats({
        totalStudents: 42,
        totalCourses: 5,
        pendingReviews: 8,
      });

      setCourses([
        { id: 1, title: 'Web Development Fundamentals', students: 20 },
        { id: 2, title: 'Advanced JavaScript', students: 15 },
        { id: 3, title: 'Database Design', students: 7 },
      ]);

      setSubmissions([
        { id: 1, student: 'Alex M', course: 'Web Dev', date: '2025-10-20', status: 'Pending' },
        { id: 2, student: 'Jamie S', course: 'JS Advanced', date: '2025-10-21', status: 'Reviewed' },
        { id: 3, student: 'Nina P', course: 'Database Design', date: '2025-10-22', status: 'Pending' },
      ]);
    }, 500);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Tutor Dashboard</h1>
          <button className="btn btn-dark">+ New Course</button>
        </div>

        {/* DASHBOARD STATS */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm text-center border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title fw-semibold">Total Students</h5>
                <h2 className="display-6">{stats.totalStudents}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title fw-semibold">Total Courses</h5>
                <h2 className="display-6">{stats.totalCourses}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title fw-semibold">Pending Reviews</h5>
                <h2 className="display-6 text-warning">{stats.pendingReviews}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* COURSES */}
        <div className="mb-5">
          <h4 className="fw-semibold mb-3">My Courses</h4>
          <div className="row g-3">
            {courses.map((course) => (
              <div key={course.id} className="col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="text-muted mb-2">
                      {course.students} enrolled students
                    </p>
                    <button className="btn btn-outline-dark btn-sm">Manage</button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-muted">No courses available yet.</p>
            )}
          </div>
        </div>

        {/* RECENT SUBMISSIONS */}
        <div>
          <h4 className="fw-semibold mb-3">Recent Submissions</h4>
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td>{s.student}</td>
                      <td>{s.course}</td>
                      <td>{s.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            s.status === 'Reviewed'
                              ? 'bg-success'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TutorDash;