

import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.name || user?.email}!</p>
            <div style={{ marginTop: '2rem' }}>
                <h2>Your Information:</h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        </div>
    );
};

export default Dashboard;