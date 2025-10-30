// client/src/pages/StudentDash.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentNav from '../Components/StudentNav.jsx';
import Footer from '../Components/Footer.jsx';
import API from '../api'; // axios instance with baseURL /api

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    enrolledCourses: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0
  });

  const [courses, setCourses] = useState([]); // will hold ENROLLED courses for "Continue Learning"
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
      // Get dashboard stats + student's enrolled courses in parallel
      const [dashRes, enrollRes] = await Promise.all([
        API.get('/dashboard/student'),
        API.get('/enrollments/my') // <-- enrolled courses for the logged-in student
      ]);

      const data = dashRes.data || {};

      setStats({
        enrolledCourses: data.totalCourses || 0,
        inProgress: data.inProgress || 0,
        completed: data.completedCourses || 0,
        totalHours: data.studyHours || 0
      });

      // Normalize enrolled courses for the "Continue Learning" cards
      const payload = enrollRes?.data;
      const enrolledArray = Array.isArray(payload)
        ? payload
        : payload?.courses || payload?.myCourses || payload?.enrolled || [];

      const normalized = enrolledArray.map((c) => ({
        id: c._id || c.id,
        title: c.title || c.name || 'Untitled Course',
        thumbnail: c.thumbnail,
        category: c.category || 'Course',
        instructor: c.instructor?.name || c.instructor || '',
        progress: typeof c.progress === 'number' ? c.progress : 0,
        nextLesson: c.nextLesson || ''
      }));

      setCourses(normalized);

      // Mocked sidebar widgets (leave as-is)
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

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      {/* Top Navigation (student-only) */}
      <StudentNav />

      <div className="container-fluid py-4">
        {/* Header Section */}
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
                <button className="btn btn-success me-2" onClick={() => navigate('/courses')}>
                  Browse Courses
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
                  My Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                    <i className="fas fa-book text-primary fs-4"></i>
                  </div>
                  <div>
                    <h3 className="card-title mb-0">{stats.enrolledCourses}</h3>
                    <p className="text-muted mb-0">Enrolled Courses</p>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    +2 this month
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                    <i className="fas fa-clock text-warning fs-4"></i>
                  </div>
                  <div>
                    <h3 className="card-title mb-0">{stats.inProgress}</h3>
                    <p className="text-muted mb-0">In Progress</p>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-info">Active</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                    <i className="fas fa-check-circle text-success fs-4"></i>
                  </div>
                  <div>
                    <h3 className="card-title mb-0">{stats.completed}</h3>
                    <p className="text-muted mb-0">Completed</p>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    +3 this week
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                    <i className="fas fa-chart-line text-info fs-4"></i>
                  </div>
                  <div>
                    <h3 className="card-title mb-0">{stats.totalHours}h</h3>
                    <p className="text-muted mb-0">Study Time</p>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    +5h this week
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Left Column - Main Content */}
          <div className="col-lg-8">
            {/* Continue Learning Section */}
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
                      <div key={course.id} className="col-md-6 col-lg-4 mb-3">
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
                                <div
                                  className="progress-bar"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
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

            {/* Performance Chart Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                <h5 className="card-title mb-0">Weekly Progress</h5>
                <select className="form-select form-select-sm w-auto">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-end justify-content-around py-4" style={{ height: '200px' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center mx-1">
                      <div
                        className="bg-primary rounded mx-auto"
                        style={{ height: `${Math.random() * 120 + 30}px`, width: '30px' }}
                      ></div>
                      <small className="text-muted mt-2 d-block">{day}</small>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <small className="text-muted">Hours studied per day</small>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                <h5 className="card-title mb-0">Recent Achievements</h5>
                <a href="/achievements" className="btn btn-sm btn-outline-primary">
                  View All <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-center p-3 border rounded h-100">
                      <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-star text-warning fs-4"></i>
                      </div>
                      <h6 className="mb-1">Fast Learner</h6>
                      <p className="small text-muted mb-0">Completed 5 courses</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-center p-3 border rounded h-100">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-fire text-success fs-4"></i>
                      </div>
                      <h6 className="mb-1">10-Day Streak</h6>
                      <p className="small text-muted mb-0">Consistent learning</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-center p-3 border rounded h-100">
                      <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-trophy text-info fs-4"></i>
                      </div>
                      <h6 className="mb-1">Top Performer</h6>
                      <p className="small text-muted mb-0">95% average score</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-center p-3 border rounded h-100 opacity-50">
                      <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-lock text-secondary fs-4"></i>
                      </div>
                      <h6 className="mb-1">Course Master</h6>
                      <p className="small text-muted mb-0">Complete 10 courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            {/* Study Streak Widget */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">Study Streak</h5>
                <div className="my-4">
                  <div className="bg-warning rounded-circle d-inline-flex flex-column align-items-center justify-content-center text-white" style={{ width: '100px', height: '100px' }}>
                    <span className="h3 mb-0">{studyStreak}</span>
                    <small>days</small>
                  </div>
                </div>
                <p className="text-success mb-3">
                  <i className="fas fa-fire me-1"></i>
                  Amazing! Keep it up!
                </p>
                <div className="d-flex justify-content-center">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-circle mx-1 ${i < studyStreak % 7 ? 'bg-warning' : 'bg-light'}`}
                      style={{ width: '12px', height: '12px' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Upcoming Deadlines</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {upcomingDeadlines.map(deadline => (
                    <li key={deadline.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
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
              <div className="card-footer bg-white border-0">
                <button className="btn btn-outline-primary w-100">
                  View Calendar
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Recent Activity</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {recentActivity.map(activity => (
                    <li key={activity.id} className="list-group-item">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <span className="fs-5">{activity.icon}</span>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">{activity.text}</p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/notes')}>
                      <i className="fas fa-sticky-note me-2"></i>
                      My Notes
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/forum')}>
                      <i className="fas fa-comments me-2"></i>
                      Forum
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/tutors')}>
                      <i className="fas fa-chalkboard-teacher me-2"></i>
                      Find Tutor
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/progress')}>
                      <i className="fas fa-chart-bar me-2"></i>
                      Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-lightbulb text-warning me-2"></i>
                  Today's Tip
                </h5>
                <p className="card-text">
                  "Take regular breaks using the Pomodoro Technique: 25 minutes of focused study, followed by a 5-minute break."
                </p>
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
