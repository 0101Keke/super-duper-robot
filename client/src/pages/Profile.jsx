import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user} = useAuth();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* BIO Section */}
        <div className="bg-light-green p-4 rounded shadow-sm mb-4 text-center">
          <h3 className="fw-bold mb-3">BIO</h3>
          <p><strong>Name:</strong> {user?.fullName || user?.name || 'Student'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        {/* Update Profile Section */}
        <div className="bg-light-green p-4 rounded shadow-sm mb-4">
          <h5 className="fw-semibold mb-3">Update Profile</h5>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter new password"
              />
            </div>
            <button type="submit" className="btn btn-dark text-white w-100 mt-2">
              Save Changes
            </button>
          </form>
        </div>

        {/* Extra Section */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h4>Profile Details</h4>
          <p className="text-muted">
            This section can display additional information such as recent activity,
            badges, or statistics.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
