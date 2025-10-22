import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
                            src="/logo.png"
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
                                <button className="btn btn-dark text-white">Student</button>
                            </Link>
                            <Link to="/TutLogin">
                                <button className="btn btn-dark text-white">Tutor</button>
                            </Link>
                            <Link to="/AdminLogin">
                                <button className="btn btn-dark text-white">Admin</button>
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
                                </>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/Admin">
                                    <button className="btn btn-dark text-white">Admin Panel</button>
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                {/* Right: Search + Profile/Logout */}
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search..."
                        style={{ width: "150px" }}
                    />
                    {user ? (
                        <>
                            <Link to="/profile">
                                <button className="btn btn-dark text-white">Profile</button>
                            </Link>
                            <button className="btn btn-danger text-white" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/StuLogin">
                            <button className="btn btn-dark text-white">Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;