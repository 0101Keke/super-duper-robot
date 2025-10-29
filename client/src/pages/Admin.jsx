import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx'; // Reverted to original import
import Footer from '../components/Footer.jsx'; // Reverted to original import
import axios from 'axios';

// Enums from your Course model for the dropdowns
const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Computer Science', 'Languages', 'Arts', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function Admin() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        tutors: 0,
        courses: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // --- Create Course Modal State ---
    const [showModal, setShowModal] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: SUBJECTS[0],
        level: LEVELS[0],
        tutor: '',
        price: 0,
        duration: '',
        code:'',
        startDate: '',
        endDate: ''
    });
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(() => fetchDashboardData(true), 30000);
        return () => clearInterval(interval);
    }, []);

    // --- NEW: Fetch tutors list when the "Create Course" modal is opened ---
    useEffect(() => {
        if (showModal) {
            const fetchTutors = async () => {
                try {
                    setModalError(null); // Clear previous errors
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:5000/api/admin/tutors', {
                        headers: { 'x-auth-token': token }
                    });
                    setTutors(res.data);

                    // Set default tutor and reset form data
                    if (res.data.length > 0) {
                        setFormData(f => ({
                            ...f,
                            tutor: res.data[0]._id, // Set default tutor
                            // Reset other fields
                            title: '', description: '', subject: SUBJECTS[0], level: LEVELS[0],
                            price: 0, duration: '', startDate: '', endDate: ''
                        }));
                    }
                } catch (err) {
                    console.error("Failed to fetch tutors", err);
                    setModalError("Failed to load tutors list. Please try again.");
                }
            };
            fetchTutors();
        }
    }, [showModal]); // Re-run when modal is shown

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError('');

            const [statsResponse, usersResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }),
                axios.get('http://localhost:5000/api/admin/users/recent', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                })
            ]);

            if (statsResponse.data) {
                setStats({
                    users: statsResponse.data.totalUsers || 0,
                    tutors: statsResponse.data.totalTutors || 0,
                    courses: statsResponse.data.totalCourses || 0,
                });
            }

            if (usersResponse.data) {
                setRecentUsers(usersResponse.data);
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
            setStats({ users: 0, tutors: 0, courses: 0 });
            setRecentUsers([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleViewUser = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        const action = newStatus === 'banned' ? 'ban' : 'unban';

        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            await axios.put(
                `http://localhost:5000/api/admin/users/${userId}/status`,
                { status: newStatus },
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            alert(`User ${action}ned successfully`);
            fetchDashboardData(true);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert(`Failed to ${action} user`);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Delete ${userName}? This cannot be undone.`)) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/admin/users/${userId}`,
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            alert('User deleted successfully');
            fetchDashboardData(true);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = recentUsers.filter(user => {
        const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

   

    // Generic handler for form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle the new course form submission
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalError(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            await axios.post(
                'http://localhost:5000/api/admin/courses',
                formData, // Send the whole state object
                config
            );

            alert('Course created successfully!');
            setShowModal(false);
            fetchDashboardData(true); // Refresh dashboard stats (course count)

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to create course';
            console.error(errMsg);
            setModalError(errMsg);
        } finally {
            setModalLoading(false);
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
                {/* --- MODIFIED: Added button to header --- */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h1 className="fw-bold text-success mb-0">Admin Dashboard</h1>
                    {/* --- NEW "Create Course" Button --- */}
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create New Course
                    </button>
                </div>


                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <div className="text-center mb-3">
                    <small className="text-muted">
                        <i className="bi bi-clock"></i> Last updated: {lastUpdated.toLocaleTimeString()}
                        {refreshing && <span className="spinner-border spinner-border-sm ms-2"></span>}
                    </small>
                </div>

               
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card text-center shadow-sm border-0 bg-success-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Total Users</h5>
                                <h2 className="counter">{stats.users}</h2>
                                <small className="text-muted">Registered users</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-center shadow-sm border-0 bg-info-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Tutors</h5>
                                <h2 className="counter">{stats.tutors}</h2>
                                <small className="text-muted">Approved tutors</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-center shadow-sm border-0 bg-warning-subtle">
                            <div className="card-body">
                                <h5 className="fw-bold">Courses</h5>
                                <h2 className="counter">{stats.courses}</h2>
                                <small className="text-muted">Active courses</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Users ({recentUsers.length})</h5>
                        <button className="btn btn-light btn-sm" onClick={() => fetchDashboardData(true)} disabled={refreshing}>
                            <i className="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-select"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="student">Students Only</option>
                                    <option value="tutor">Tutors Only</option>
                                    <option value="admin">Admins Only</option>
                                </select>
                            </div>
                        </div>

                        {filteredUsers.length === 0 ? (
                            <p className="text-center text-muted">No users found</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id}>
                                                <td><strong>{user.fullName || user.username}</strong></td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' :
                                                        user.role === 'tutor' ? 'bg-info' : 'bg-success'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'
                                                        }`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-primary" onClick={() => handleViewUser(user._id)} title="View">
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        {user.role !== 'admin' && (
                                                            <>
                                                                <button
                                                                    className={`btn btn-outline-${user.status === 'banned' ? 'success' : 'warning'}`}
                                                                    onClick={() => handleToggleStatus(user._id, user.status)}
                                                                >
                                                                    <i className={`bi bi-${user.status === 'banned' ? 'check-circle' : 'slash-circle'}`}></i>
                                                                </button>
                                                                <button className="btn btn-outline-danger" onClick={() => handleDeleteUser(user._id, user.fullName)}>
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions - REMOVED MANAGE USERS AND VIEW REPORTS */}
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button className="btn btn-dark px-4 py-2" onClick={() => navigate('/admin/manage-tutors')}>
                        <i className="bi bi-person-badge me-2"></i>
                        Manage Tutors
                    </button>
                    <button className="btn btn-primary px-4 py-2" onClick={() => fetchDashboardData(true)} disabled={refreshing}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </main>

            <Footer />

            {/* --- NEW "Create Course" Modal --- */}
            <div
                className={`modal fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none', overflowY: 'auto' }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Course</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <form onSubmit={handleCreateCourse}>
                            <div className="modal-body">

                                {modalError && (
                                    <div className="alert alert-danger">{modalError}</div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Course Title</label>
                                    <input type="text" className="form-control" id="title" name="title"
                                        value={formData.title} onChange={handleChange} required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Course Description</label>
                                    <textarea className="form-control" id="description" name="description" rows="3"
                                        value={formData.description} onChange={handleChange} required
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <select className="form-select" id="subject" name="subject"
                                            value={formData.subject} onChange={handleChange} required>
                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="level" className="form-label">Level</label>
                                        <select className="form-select" id="level" name="level"
                                            value={formData.level} onChange={handleChange} required>
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="tutor" className="form-label">Tutor</label>
                                        <select className="form-select" id="tutor" name="tutor"
                                            value={formData.tutor} onChange={handleChange} required>
                                            <option value="" disabled>Select a tutor...</option>
                                            {tutors.map(t => (
                                                <option key={t._id} value={t._id}>
                                                    {t.fullName || t.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="price" className="form-label">Price (R)</label>
                                        <input type="number" className="form-control" id="price" name="price"
                                            value={formData.price} onChange={handleChange} min="0" required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="duration" className="form-label">Duration (hours)</label>
                                        <input type="number" className="form-control" id="duration" name="duration"
                                            value={formData.duration} onChange={handleChange} min="1" required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="startDate" className="form-label">Start Date</label>
                                        <input type="date" className="form-control" id="startDate" name="startDate"
                                            value={formData.startDate} onChange={handleChange} required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="endDate" className="form-label">End Date</label>
                                        <input type="date" className="form-control" id="endDate" name="endDate"
                                            value={formData.endDate} onChange={handleChange} required
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="mb-3">
                                <label htmlFor="code" className="form-label">Course Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    name="code"  
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., CS101"
                                    maxLength={10} // Optional: limit length
                                    pattern="^[A-Z0-9]+$" // Optional: enforce format (e.g., uppercase letters/numbers)
                                    title="Code must be uppercase letters and numbers only." // Optional: show pattern hint
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                                    {modalLoading ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Backdrop */}
            {showModal && (
                <div className="modal-backdrop fade show"></div>
            )}

        </div>
    );
}

export default Admin;

