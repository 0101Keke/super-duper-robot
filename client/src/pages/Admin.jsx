import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Admin() {
  const [stats, setStats] = useState({
    users: 0,
    tutors: 0,
    courses: 0,
    reports: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);

  // Simulated data fetch (replace with your API call)
  useEffect(() => {
    // Simulate API data
    setStats({
      users: 128,
      tutors: 12,
      courses: 34,
      reports: 5,
    });

    setRecentUsers([
      { id: 1, name: 'Alice Johnson', role: 'Student', email: 'alice@example.com' },
      { id: 2, name: 'Mark Daniels', role: 'Tutor', email: 'mark@example.com' },
      { id: 3, name: 'Sarah Patel', role: 'Student', email: 'sarah@example.com' },
    ]);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <main className="container py-4 flex-grow-1">
        <h1 className="fw-bold mb-4 text-center">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-success-subtle">
              <div className="card-body">
                <h5 className="fw-bold">Total Users</h5>
                <h2>{stats.users}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-info-subtle">
              <div className="card-body">
                <h5 className="fw-bold">Tutors</h5>
                <h2>{stats.tutors}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-warning-subtle">
              <div className="card-body">
                <h5 className="fw-bold">Courses</h5>
                <h2>{stats.courses}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-danger-subtle">
              <div className="card-body">
                <h5 className="fw-bold">Reports</h5>
                <h2>{stats.reports}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Users</h5>
            <button className="btn btn-light btn-sm">View All</button>
          </div>
          <div className="card-body">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'Tutor' ? 'bg-info' : 'bg-success'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <button className="btn btn-dark px-4 py-2">Manage Users</button>
          <button className="btn btn-dark px-4 py-2">Manage Tutors</button>
          <button className="btn btn-dark px-4 py-2">View Reports</button>
          <button className="btn btn-dark px-4 py-2">Settings</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Admin;
