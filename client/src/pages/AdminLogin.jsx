import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminLogin(){
  const [formData, setFormData] = useState({
    username: '',
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
      navigate('/Admin'); // Redirect to admin dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }
  return(
    <div>
      
      <div className="container my-5">
      <h1 className="text-center mb-4">Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form
          className="p-4 rounded shadow bg-green"
          style={{ maxWidth: "400px", margin: "0 auto" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
          <label htmlFor="name" className="form-label">Admin Username:</label>
          <input type="text" className="form-control" placeholder='Enter Username' required />
          </div>

          <div className="mb-3">
          <label htmlFor="name" className="form-label">Admin Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email'
          onChange={handleChange} required />
          </div>

          <div className="mb-3">
          <label htmlFor="name" className="form-label">Password:</label>
          <input type="password" className="form-control" placeholder='Enter Email' onChange={handleChange} required />
          </div>
           <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Submit
          </button>
          <Link to="/Forgot">Forgot Password?</Link>
            <br />
        </form>
        </div>
  
    </div>
  )
};

export default AdminLogin;
