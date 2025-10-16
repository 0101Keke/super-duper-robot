import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';






const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                        MyApp
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                                Dashboard
                            </Link>
                            <span>Welcome, {user.name || user.email}</span>
                            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                                Login
                            </Link>
                            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;