import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function StudentLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
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
      await login(formData);
      navigate('/student'); // Redirect to student dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Student Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form
          className="p-4 rounded shadow bg-green"
          style={{ maxWidth: "400px", margin: "0 auto" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Student Email:
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Submit
          </button>
          
          <div className="text-center mt-3">
            <Link to="/Forgot">Forgot Password?</Link>
            <br />
            <span>Don't have an account? </span>
            <Link to="/StuReg">Register here</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default StudentLogin;