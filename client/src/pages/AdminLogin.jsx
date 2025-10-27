import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use the login endpoint
            const response = await authAPI.login({
                email: formData.email,
                password: formData.password
            });

            // Check if user is admin
            if (response.data.user.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                localStorage.removeItem('token');
                setLoading(false);
                return;
            }

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to admin dashboard
            navigate('/admin');

        } catch (error) {
            console.error('Login error:', error);

            if (error.response?.status === 401) {
                setError('Invalid email or password');
            } else if (error.response?.status === 403) {
                setError('Account is suspended or not approved');
            } else {
                setError(error.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h1 className="text-center mb-4">Admin Login</h1>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ maxWidth: "400px", margin: "0 auto" }}>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <form
                    className="p-4 rounded shadow bg-light"
                    style={{ maxWidth: "400px", margin: "0 auto" }}
                    onSubmit={handleSubmit}
                >
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-bold">
                            Admin Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter admin email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-bold">
                            Password:
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark text-white w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Logging in...
                            </>
                        ) : (
                            'Login as Admin'
                        )}
                    </button>

                    {/* Development Helper - Using Vite's import.meta.env */}
                    {import.meta.env.DEV && (
                        <div className="mt-3 p-2 bg-info bg-opacity-10 border border-info rounded">
                            <small className="text-muted">
                                <strong>Dev Credentials:</strong><br />
                                Email: admin@campuslearn.com<br />
                                Password: admin123
                            </small>
                        </div>
                    )}
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default AdminLogin;