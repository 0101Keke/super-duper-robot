import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function StudentReg() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
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

        try {
            await register(formData);
            navigate('/student'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h2 className="text-center mb-4">Student Registration</h2>
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
                        Student Email:
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

                    <button type="submit" className="btn btn-dark text-white w-100 mt-3">
                        Register
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default StudentReg;