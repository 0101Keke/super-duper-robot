import { Link } from 'react-router-dom';
import Nav from './Nav';

function Header() {
    return (
        <header className="bg-success py-3 shadow">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Left: Logo */}
                <div className="d-flex align-items-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width="40"
                        height="40"
                        className="me-2"
                    />
                </div>

                {/* Center: Navigation */}
                <Nav className="d-flex gap-3" />

                {/* Right: Search + Profile */}
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search..."
                        style={{ width: "150px" }}
                    />
                    <Link to="/profile">
                        <button className="btn btn-dark text-white">Profile</button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;