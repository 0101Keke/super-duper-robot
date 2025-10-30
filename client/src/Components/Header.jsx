import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CLlogo from '../assets/CLlogo.jpeg';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-success py-3 shadow">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Left: Logo */}
                <div className="d-flex align-items-center">
                    <Link to="/" className="text-decoration-none">
                        <img
                            src={CLlogo}
                            alt="CampusLearn Logo"
                            width="40"
                            height="40"
                            className="me-2"
                        />
                        <span className="text-white fw-bold fs-5">CampusLearn</span>
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="d-flex gap-3">
                    <Link to="/">
                        <button className="btn btn-dark text-white">Home</button>
                    </Link>

                    {!user ? (
                        <>
                            <Link to="/StuLogin">
                                <button className="btn btn-dark text-white">Student Login</button>
                            </Link>
                            <Link to="/TutLogin">
                                <button className="btn btn-dark text-white">Tutor Login</button>
                            </Link>
                            <Link to="/AdminLogin">
                                <button className="btn btn-dark text-white">Admin Login</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'student' && (
                                <>
                                    <Link to="/student">
                                        <button className="btn btn-dark text-white">Dashboard</button>
                                    </Link>
                                    <Link to="/Discussion">
                                        <button className="btn btn-dark text-white">Discussion</button>
                                    </Link>
                                    <Link to="/Resource">
                                        <button className="btn btn-dark text-white">Resources</button>
                                    </Link>
                                    <Link to="/chatbot">
                                        <button className="btn btn-dark text-white">AI Assistant</button>
                                    </Link>
                                </>
                            )}
                            {user.role === 'tutor' && (
                                <>
                                    <Link to="/tutor">
                                        <button className="btn btn-dark text-white">Dashboard</button>
                                    </Link>
                                    <Link to="/Resource">
                                        <button className="btn btn-dark text-white">Resources</button>
                                    </Link>
                                    <Link to="/ModuleCourse">
                                        <button className="btn btn-dark text-white">Modules</button>
                                    </Link>
                                    <Link to="/chatbot">
                                        <button className="btn btn-dark text-white">AI Assistant</button>
                                    </Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/Admin">
                                        <button className="btn btn-dark text-white">Admin Panel</button>
                                    </Link>
                                    <Link to="/chatbot">
                                        <button className="btn btn-dark text-white">AI Assistant</button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </nav>

                {/* Right: Profile/Logout */}
                <div className="d-flex align-items-center gap-2">
                    {user ? (
                        <>
                            <Link to="/profile">
                                <button className="btn btn-dark text-white">Profile</button>
                            </Link>
                            <button className="btn btn-danger text-white" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

export default Header;