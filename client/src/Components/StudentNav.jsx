// client/src/components/StudentNav.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CLlogo from "../assets/CLlogo.jpeg";

export default function StudentNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-success py-3 shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo + Brand (matches Header exactly) */}
        <div className="d-flex align-items-center">
          <Link to="/student" className="text-decoration-none">
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

        {/* Center: Student navigation */}
        <nav className="d-flex gap-3">
          <Link to="/student">
            <button className="btn btn-dark text-white">Dashboard</button>
          </Link>
          <Link to="/courses/my-courses">
            <button className="btn btn-dark text-white">My Courses</button>
          </Link>
        </nav>

        {/* Right: Search + Profile/Logout (same look as Header) */}
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
