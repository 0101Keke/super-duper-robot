import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.username || user?.email}!</p>
            <div style={{ marginTop: '2rem' }}>
                <h2>Your Courses</h2>
                <p>No courses yet. Start learning!</p>
            </div>
        </div>
    );
};

export default Dashboard;