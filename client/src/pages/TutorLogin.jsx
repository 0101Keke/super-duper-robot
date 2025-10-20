import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        cv: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            
            // Validate file
            if (file) {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(file.type)) {
                    setError('Only PDF, DOC, and DOCX files are allowed');
                    e.target.value = '';
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    setError('File size must be less than 10MB');
                    e.target.value = '';
                    return;
                }
                setFormData({
                    ...formData,
                    cv: file
                });
                setError('');
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.role === 'tutor' && !formData.cv) {
            setError('CV is required for tutor registration');
            setLoading(false);
            return;
        }

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('password', formData.password);
            submitData.append('role', formData.role);
            if (formData.cv) {
                submitData.append('cv', formData.cv);
            }

            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: submitData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'tutor') {
                alert('Registration successful! Your account is pending approval.');
                navigate('/login');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h2 className="text-center mb-4">Create Account</h2>
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

                    <label htmlFor="phone" className="form-label fw-bold">
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

                    <label htmlFor="role" className="form-label fw-bold">
                        Register as:
                    </label>
                    <select
                        name="role"
                        className="form-select mb-3"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>
                    {formData.role === 'tutor' && (
                        <small className="text-muted d-block mb-3">
                            * Tutor accounts require admin approval
                        </small>
                    )}

                    {formData.role === 'tutor' && (
                        <div className="mb-3">
                            <label htmlFor="cv" className="form-label fw-bold">
                                Upload CV:
                            </label>
                            <input
                                type="file"
                                name="cv"
                                className="form-control"
                                accept=".pdf,.doc,.docx"
                                onChange={handleChange}
                                required
                            />
                            <small className="text-muted">PDF, DOC, DOCX up to 10MB</small>
                            {formData.cv && (
                                <div className="mt-2 text-success">
                                    ✓ {formData.cv.name} selected
                                </div>
                            )}
                        </div>
                    )}

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
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted">
                            Already have an account?{' '}
                            <a href="/login" className="text-decoration-none">
                                Login here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Register;