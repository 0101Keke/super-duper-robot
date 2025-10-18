import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to  Freedom fighters</h1>
            {user ? (
                <div>
                    <p>You are logged in as {user.email}</p>
                    <Link to="/dashboard">
                        <button style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}>
                            Go to Dashboard
                        </button>
                    </Link>
                </div>
            ) : (
                <div>
                    <p>Please log in to continue</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                        <Link to="/Stulogin">
                            <button style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}>
                                Login
                            </button>
                        </Link>
                        <Link to="/StuReg">
                            <button style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}>
                                Register
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;