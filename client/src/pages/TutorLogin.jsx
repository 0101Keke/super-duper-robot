import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TutorLogin() {
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
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Check if user is a tutor
            if (data.user.role === 'tutor') {
                if (data.user.isApproved) {
                    navigate('/tutor');
                } else {
                    setError('Your account is pending admin approval');
                    localStorage.clear();
                    setLoading(false);
                }
            } else {
                setError('Invalid credentials for tutor login');
                localStorage.clear();
                setLoading(false);
            }

        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h2 className="text-center mb-4">Tutor Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form
                    className="bg-green"
                    style={{ maxWidth: "500px", margin: "0 auto" }}
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="email" className="form-label fw-bold">
                        Email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="form-control mb-3"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password" className="form-label fw-bold">
                        Password:
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="form-control mb-3"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-dark text-white w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted">
                            Don't have an account?{' '}
                            <a href="/tutor-register" className="text-decoration-none">
                                Register as Tutor
                            </a>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default TutorLogin;