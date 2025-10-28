import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import axios from 'axios';

function Admin() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        tutors: 0,
        courses: 0,
        reports: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real data from backend
    useEffect(() => {
        fetchDashboardData();

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch statistics
            const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: {
                    'x-auth-token': localStorage.getItem('token') // Include token if using auth
                }
            });

            // Fetch recent users
            const usersResponse = await axios.get('http://localhost:5000/api/admin/users/recent', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            // Update state with real data
            if (statsResponse.data) {
                setStats({
                    users: statsResponse.data.totalUsers || 0,
                    tutors: statsResponse.data.totalTutors || 0,
                    courses: statsResponse.data.totalCourses || 0,
                    reports: statsResponse.data.unresolvedReports || 0,
                });
            }

            if (usersResponse.data) {
                setRecentUsers(usersResponse.data);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);

            // If API fails, you can still show something
            setStats({
                users: 0,
                tutors: 0,
                courses: 0,
                reports: 0,
            });
            setRecentUsers([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column min-vh-100 bg-light">
                <Header />
                <main className="container py-4 flex-grow-1">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading dashboard data...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />

            <main className="container py-4 flex-grow-1">
                <h1 className="fw-bold mb-4 text-center">Admin Dashboard</h1>

                {/* Auto-refresh indicator */}
                <div className="text-center mb-3">
                    <small className="text-muted">
                        <i className="bi bi-arrow-clockwise"></i> Auto-refreshes every 30 seconds
                    </small>
                </div>

                {/* Dashboard Stats - Now with real data! */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card text-center shadow-sm border-0 bg-success-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Total Users</h5>
                                <h2 className="counter">{stats.users}</h2>
                                <small className="text-muted">Registered users</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card text-center shadow-sm border-0 bg-info-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Tutors</h5>
                                <h2 className="counter">{stats.tutors}</h2>
                                <small className="text-muted">Approved tutors</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card text-center shadow-sm border-0 bg-warning-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Courses</h5>
                                <h2 className="counter">{stats.courses}</h2>
                                <small className="text-muted">Active courses</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card text-center shadow-sm border-0 bg-danger-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Reports</h5>
                                <h2 className="counter">{stats.reports}</h2>
                                <small className="text-muted">Unresolved</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table - Now with real data! */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Users</h5>
                        <button
                            className="btn btn-light btn-sm"
                            onClick={fetchDashboardData}
                        >
                            <i className="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                    <div className="card-body">
                        {recentUsers.length === 0 ? (
                            <p className="text-center text-muted">No users registered yet</p>
                        ) : (
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user, index) => (
                                        <tr key={user._id || index}>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span
                                                    className={`badge ${user.role === 'tutor' ? 'bg-info' :
                                                            user.role === 'admin' ? 'bg-danger' : 'bg-success'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button
                        className="btn btn-dark px-4 py-2"
                        onClick={() => navigate('/admin/users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className="btn btn-dark px-4 py-2"
                        onClick={() => navigate('/admin/tutors')}
                    >
                        Manage Tutors
                    </button>
                    <button
                        className="btn btn-dark px-4 py-2"
                        onClick={() => navigate('/admin/reports')}
                    >
                        View Reports
                    </button>
                    <button
                        className="btn btn-dark px-4 py-2"
                        onClick={fetchDashboardData}
                    >
                        Refresh Data
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Admin;