
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'Student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== REGISTRATION ATTEMPT ===');
    console.log(' Form data:', formData);
    console.log('Field check:', {
      username: formData.username || 'MISSING',
      email: formData.email || 'MISSING',
      password: formData.password ? '***' : 'MISSING',
      userType: formData.userType || 'MISSING'
    });

    // Validate fields before sending
    if (!formData.username || !formData.email || !formData.password || !formData.userType) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling register function...');
      await register(formData);
      console.log(' Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(' Registration failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>
      
      {error && (
        <div style={{ 
          color: 'white',
          backgroundColor: '#f44336',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Username: *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email: *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password: *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Enter password (min 6 characters)"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            User Type: *
          </label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>

     
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Register;