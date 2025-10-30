// client/src/pages/StudentDash.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentNav from '../Components/StudentNav.jsx';
import Footer from '../Components/Footer.jsx';
import API from '../api';

/* ====================== Calendar (compact) ====================== */
function CalendarBlock() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  const isToday = (y, m, d) =>
    today.getFullYear() === y &&
    today.getMonth() === m &&
    today.getDate() === d;

  const data = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const lastDate = new Date(y, m + 1, 0).getDate();

    // Monday-first
    const jsDow = first.getDay(); // 0=Sun..6=Sat
    const leading = (jsDow + 6) % 7;

    const cells = [];
    for (let i = 0; i < leading; i++) cells.push({ type: 'blank' });
    for (let d = 1; d <= lastDate; d++) {
      cells.push({ type: 'day', day: d, today: isToday(y, m, d) });
    }
    const trailing = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < trailing; i++) cells.push({ type: 'blank' });

    return {
      label: cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
      cells,
      y,
      m,
    };
  }, [cursor]);

  const prevMonth = () =>
    setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0 py-2">
        <div className="d-flex align-items-center justify-content-center position-relative">
          <button
            className="btn btn-sm btn-outline-secondary position-absolute start-0"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="fw-semibold">{data.label}</div>
          <button
            className="btn btn-sm btn-outline-secondary position-absolute end-0"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="px-3">
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {dayNames.map((n) => (
            <div key={n} className="text-center fw-semibold text-muted small py-1">{n}</div>
          ))}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="border rounded">
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridAutoRows: 'minmax(100px, 1fr)'
            }}
          >
            {data.cells.map((cell, idx) => {
              if (cell.type === 'blank') {
                return (
                  <div
                    key={`b-${idx}`}
                    className="border-end border-bottom bg-body-tertiary"
                    style={{ minHeight: 100 }}
                  />
                );
              }
              return (
                <div key={`d-${idx}`} className="border-end border-bottom">
                  <div className="p-2 h-100 d-flex flex-column">
                    <div className="d-flex">
                      <span
                        className={
                          'small ms-auto rounded px-2 py-1 ' +
                          (cell.today ? 'bg-primary text-white' : 'text-muted')
                        }
                        style={{ minWidth: 28, textAlign: 'center' }}
                      >
                        {cell.day}
                      </span>
                    </div>
                    <div className="mt-1 d-flex gap-1 flex-column" style={{ minHeight: 36 }}>
                      {/* events go here later */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
/* ==================== /Calendar (compact) ==================== */

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // keep raw stats for study time fallback
  const [rawStats, setRawStats] = useState({ studyHours: 0 });

  // derived stats for tiles
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0
  });

  const [courses, setCourses] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, enrollRes] = await Promise.all([
        API.get('/dashboard/student'),
        API.get('/enrollments/my')
      ]);

      const dash = dashRes?.data || {};
      setRawStats({ studyHours: dash.studyHours || 0 });

      // normalize enrolled courses
      const payload = enrollRes?.data;
      const enrolledArray = Array.isArray(payload)
        ? payload
        : payload?.courses || payload?.myCourses || payload?.enrolled || [];

      const normalized = enrolledArray.map((c) => {
        const progress =
          typeof c.progress === 'number'
            ? c.progress
            : // fallback: some backends store completed boolean
              (c.completed ? 100 : 0);

        return {
          id: c._id || c.id,
          title: c.title || c.name || 'Untitled Course',
          thumbnail: c.thumbnail,
          category: c.category || 'Course',
          instructor: c.instructor?.name || c.instructor || '',
          progress,
          nextLesson: c.nextLesson || ''
        };
      });

      setCourses(normalized);

      // === derive tiles from normalized enrollments ===
      const enrolledCount = normalized.length;
      const completedCount = normalized.filter(x => x.progress >= 100).length;
      const inProgressCount = normalized.filter(x => x.progress > 0 && x.progress < 100).length;

      setStats({
        enrolledCourses: enrolledCount,
        inProgress: inProgressCount,
        completed: completedCount,
        totalHours: dash.studyHours || 0
      });

      // sidebar mock data
      setUpcomingDeadlines([
        { id: 1, title: 'Next Assignment', course: 'Web Dev', daysLeft: 3, type: 'assignment' },
      ]);
      setRecentActivity([
        { id: 1, text: 'Logged in successfully', time: 'Just now' },
        { id: 2, text: 'Viewed Dashboard', time: 'A few seconds ago' },
      ]);
      setStudyStreak(5);
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCourseClick = (courseId) => navigate(`/courses/${courseId}`);
  const handleLogout = () => { logout(); navigate('/login'); };

  // tile click targets
  const goEnrolled = () => navigate('/courses/my-courses');
  const goInProgress = () => navigate('/courses/my-courses?tab=in-progress');
  const goCompleted = () => navigate('/courses/my-courses?tab=completed');
  const goStudyTime = () => navigate('/progress');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <StudentNav />

      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 text-dark mb-1">
                  {getGreeting()}, {user?.fullName || user?.name || 'Student'}!
                </h1>
                <p className="text-muted mb-0">Ready to continue your learning journey today?</p>
              </div>
              <div>
                <button className="btn btn-success me-2" onClick={() => navigate('/courses')}>Browse Courses</button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>My Profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats (derived + clickable) */}
        <div className="row gy-3 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-1 shadow-sm h-100 hover-shadow" role="button" onClick={goEnrolled}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-primary bg-opacity-10">
                  <i className="fas fa-book text-primary fs-4" />
                </div>
                <div>
                  <div className="fs-4 fw-semibold">{stats.enrolledCourses}</div>
                  <div className="text-muted small">Enrolled Courses</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-1 shadow-sm h-100 hover-shadow" role="button" onClick={goInProgress}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-warning bg-opacity-10">
                  <i className="fas fa-clock text-warning fs-4" />
                </div>
                <div>
                  <div className="fs-4 fw-semibold">{stats.inProgress}</div>
                  <div className="text-muted small">In Progress</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-1 shadow-sm h-100 hover-shadow" role="button" onClick={goCompleted}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-success bg-opacity-10">
                  <i className="fas fa-check-circle text-success fs-4" />
                </div>
                <div>
                  <div className="fs-4 fw-semibold">{stats.completed}</div>
                  <div className="text-muted small">Completed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-1 shadow-sm h-100 hover-shadow">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-info bg-opacity-10">
                  <i className="fas fa-chart-line text-info fs-4" />
                </div>
                <div>
                  <div className="fs-4 fw-semibold">{stats.totalHours}h</div>
                  <div className="text-muted small">Study Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Continue Learning */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                <h5 className="card-title mb-0">Continue Learning</h5>
                <a href="/courses" className="btn btn-sm btn-outline-primary">
                  View all available courses <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </div>
              <div className="card-body">
                <div className="row">
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <div key={course.id} className="col-md-6 col-lg-6 mb-3">
                        <div
                          className="card h-100 border shadow-sm course-card"
                          onClick={() => handleCourseClick(course.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {course.thumbnail && (
                            <img
                              src={course.thumbnail}
                              className="card-img-top"
                              alt={course.title}
                              style={{ height: '140px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body">
                            <span className="badge bg-primary mb-2">{course.category}</span>
                            <h6 className="card-title">{course.title}</h6>
                            {course.instructor && (
                              <p className="card-text small text-muted">By {course.instructor}</p>
                            )}
                            {course.nextLesson && (
                              <div className="mb-2">
                                <small className="text-muted">Next: {course.nextLesson}</small>
                              </div>
                            )}
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-1">
                                <small>Progress</small>
                                <small>{course.progress}%</small>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>
                            <button className="btn btn-sm btn-outline-primary w-100">
                              Continue Learning <i className="fas fa-arrow-right ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="text-center py-4">
                        <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No courses yet. Start learning!</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate('/courses/my-courses')}
                        >
                          My Courses
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <CalendarBlock />
          </div>

          {/* Right Sidebar */}
          <div className="col-xl-3 col-lg-4 col-md-5 col-12 ms-auto mt-5">
                {/* Upcoming Deadlines */}
                <div className="card border-2 shadow-sm mb-4" style={{ maxWidth: 360, marginLeft: 'auto' }}>
                    <div className="card-header bg-white border-0 py-2">
                    <h5 className="card-title mb-1">Upcoming Deadlines</h5>
                    </div>
                    <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        {upcomingDeadlines.map(deadline => (
                        <li key={deadline.id} className="list-group-item py-2">
                            <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1 pe-2">
                                <span className="badge bg-primary me-2 text-capitalize">{deadline.type}</span>
                                <h6 className="mb-1">{deadline.title}</h6>
                                <small className="text-muted">{deadline.course}</small>
                            </div>
                            <span className={`badge ${deadline.daysLeft <= 3 ? 'bg-danger' : 'bg-warning'}`}>
                                {deadline.daysLeft}d
                            </span>
                            </div>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card border-2 shadow-sm mb-5" style={{ maxWidth: 360, marginLeft: 'auto' }}>
                    <div className="card-header bg-white border-0 py-2">
                    <h5 className="card-title mb-0">Recent Activity</h5>
                    </div>
                    <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        {recentActivity.map(activity => (
                        <li key={activity.id} className="list-group-item py-2">
                            <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <span className="fs-6">{activity.icon}</span>
                            </div>
                            <div className="flex-grow-1">
                                <p className="mb-1 small">{activity.text}</p>
                                <small className="text-muted">{activity.time}</small>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
