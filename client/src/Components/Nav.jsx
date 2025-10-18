import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Nav() {
    const { user, logout } = useAuth();

    return (
        <div className="d-flex justify-content-center gap-3 py-3">
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
                    <Link to="/AdmLogin">
                        <button className="btn btn-dark text-white">Admin</button>
                    </Link>
                </>
            ) : (
                <>
                    {user.userType === 'student' && (
                        <Link to="/student">
                            <button className="btn btn-dark text-white">Dashboard</button>
                        </Link>
                    )}
                        {user.userType === 'tutor' && (
                        <Link to="/tutor">
                            <button className="btn btn-dark text-white">Dashboard</button>
                        </Link>
                    )}
                        {user.userType === 'admin' && (
                        <Link to="/admin">
                            <button className="btn btn-dark text-white">Admin Panel</button>
                        </Link>
                    )}
                    <button className="btn btn-dark text-white" onClick={logout}>
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}

export default Nav;