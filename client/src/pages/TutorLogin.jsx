import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function tutLogin() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
        // role removed
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    //phone: formData.phone,
                    password: formData.password,
                    role: 'tutor' // hardcoded — all registrants are tutors
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Since all are tutors, always show approval message
            alert('Registration successful! Your account is pending approval.');
            navigate('/tutor');

        } catch (err) {
            setError(err.message || 'Registration failed');
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
                    <label htmlFor="fullName" className="form-label fw-bold">
                        Full Name:
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        className="form-control mb-3"
                        placeholder="Enter Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

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

                    {/*<label htmlFor="phone" className="form-label fw-bold">
                        Phone Number:
                    </label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control mb-3"
                        placeholder="Enter Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    */}


                    <label htmlFor="password" className="form-label fw-bold">
                        Password:
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="form-control mb-3"
                        placeholder="Enter Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />

                    <button 
                        type="submit" 
                        className="btn btn-dark text-white w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/Forgot">Forgot Password?</Link>
                        <br />
                        <span>Don't have an account? </span>
                        <Link to="/TutReg">Register here</Link>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default tutLogin;