import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to CampusLearn</h1>
            <p>Your e-learning platform</p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/login" style={{ marginRight: '1rem' }}>
                    <button style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>Login</button>
                </Link>
                <Link to="/register">
                    <button style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;