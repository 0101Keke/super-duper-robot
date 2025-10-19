import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Discussion() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid py-4 flex-grow-1">
        {/* Top controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-dark text-white px-4">New Topic</button>
          <input
            type="search"
            placeholder="Search..."
            className="form-control w-25 border-success"
          />
        </div>

        {/* Three side-by-side sections */}
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-success text-white shadow-sm">
              <h5>General Discussions</h5>
              <p className="mb-0">Join community topics and student chat threads.</p>
            </div>
          </div>

          {/* Middle Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Course Help</h5>
              <p className="mb-0">Ask questions or share study resources here.</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Announcements</h5>
              <p className="mb-0">Stay updated with the latest platform news.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Discussion;