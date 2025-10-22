import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TutorReg() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        cv: null,
        role: 'tutor'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                cv: e.target.files[0]
            });
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

        try {
            // For file upload, you might need to use FormData
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('password', formData.password);
            submitData.append('role', 'tutor');
            if (formData.cv) {
                submitData.append('cv', formData.cv);
            }

            await authAPI.register(submitData);
            navigate('/TutLogin'); // Redirect to tutor login
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h2 className="text-center mb-4">Tutor Registration</h2>
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
                        Tutor Email:
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
                    {/* <label htmlFor="cv" className="form-label">CV:</label>
                    <input
                        type="file"
                        name="cv"
                        className="form-control"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                    />
                    <small className="text-muted">PDF, DOC, DOCX up to 10MB</small> */}

                    <button type="submit" className="btn btn-dark text-white w-100 mt-3">
                        Register
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default TutorReg;