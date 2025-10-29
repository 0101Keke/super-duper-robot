import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import axios from 'axios';

function ManageTutors() {
    const navigate = useNavigate();
    const [tutors, setTutors] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchTutors();
    }, []);

    useEffect(() => {
        filterTutors();
    }, [searchTerm, statusFilter, tutors]);

    const fetchTutors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/admin/users/all', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            // Filter only tutors from all users
            const tutorUsers = response.data.filter(user => user.role === 'tutor');
            setTutors(tutorUsers);
            setFilteredTutors(tutorUsers);
        } catch (error) {
            console.error('Error fetching tutors:', error);
            alert('Failed to load tutors');
        } finally {
            setLoading(false);
        }
    };

    const filterTutors = () => {
        let filtered = tutors;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(tutor =>
                tutor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(tutor => tutor.status === statusFilter);
        }

        setFilteredTutors(filtered);
    };

    const handleDeleteTutor = async (tutorId, tutorName) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${tutorName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/admin/users/${tutorId}`,
                {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                }
            );

            alert('Tutor deleted successfully');
            fetchTutors(); // Refresh the list
        } catch (error) {
            console.error('Error deleting tutor:', error);
            alert('Failed to delete tutor: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleStatus = async (tutorId, currentStatus, tutorName) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        const action = newStatus === 'banned' ? 'ban' : 'unban';

        if (!window.confirm(`Are you sure you want to ${action} ${tutorName}?`)) {
            return;
        }

        try {
            await axios.put(
                `http://localhost:5000/api/admin/users/${tutorId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                }
            );

            alert(`Tutor ${action}ned successfully`);
            fetchTutors();
        } catch (error) {
            console.error('Error updating tutor status:', error);
            alert(`Failed to ${action} tutor`);
        }
    };

    const handleViewDetails = (tutorId) => {
        navigate(`/admin/tutor/${tutorId}`);
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
                        <p className="mt-2">Loading tutors...</p>
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
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold text-success">Manage Tutors</h1>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin')}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Dashboard
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card bg-info-subtle text-center">
                            <div className="card-body">
                                <h5>Total Tutors</h5>
                                <h2>{tutors.length}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-success-subtle text-center">
                            <div className="card-body">
                                <h5>Active Tutors</h5>
                                <h2>{tutors.filter(t => t.status === 'active').length}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-danger-subtle text-center">
                            <div className="card-body">
                                <h5>Banned Tutors</h5>
                                <h2>{tutors.filter(t => t.status === 'banned').length}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-funnel me-2"></i>
                            Filter Tutors
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="banned">Banned Only</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tutors Table */}
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-people me-2"></i>
                            Tutors List ({filteredTutors.length})
                        </h5>
                    </div>
                    <div className="card-body">
                        {filteredTutors.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                <p className="text-muted mt-3">No tutors found</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>CV</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTutors.map((tutor, index) => (
                                            <tr key={tutor._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <strong>{tutor.fullName || tutor.username}</strong>
                                                </td>
                                                <td>{tutor.email}</td>
                                                <td>{tutor.phone || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${tutor.status === 'active' ? 'bg-success' :
                                                            tutor.status === 'banned' ? 'bg-danger' :
                                                                'bg-warning'
                                                        }`}>
                                                        {tutor.status || 'active'}
                                                    </span>
                                                </td>
                                                <td>{new Date(tutor.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {tutor.cv ? (
                                                        <a
                                                            href={`http://localhost:5000${tutor.cv}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="bi bi-file-earmark-pdf"></i> View
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">No CV</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button
                                                            className="btn btn-outline-info"
                                                            onClick={() => handleViewDetails(tutor._id)}
                                                            title="View Details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button
                                                            className={`btn btn-outline-${tutor.status === 'banned' ? 'success' : 'warning'
                                                                }`}
                                                            onClick={() => handleToggleStatus(
                                                                tutor._id,
                                                                tutor.status,
                                                                tutor.fullName || tutor.username
                                                            )}
                                                            title={tutor.status === 'banned' ? 'Unban' : 'Ban'}
                                                        >
                                                            <i className={`bi bi-${tutor.status === 'banned' ? 'check-circle' : 'slash-circle'
                                                                }`}></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDeleteTutor(
                                                                tutor._id,
                                                                tutor.fullName || tutor.username
                                                            )}
                                                            title="Delete Tutor"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
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
            </main>

            <Footer />
        </div>
    );
}

export default ManageTutors;