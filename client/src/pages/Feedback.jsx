import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Feedback() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-5 flex-grow-1">
        <div className="bg-light-green p-5 rounded shadow-sm">
          <h2 className="text-center mb-4 text-success">Tutor Feedback</h2>

          <form>
            {/* Tutor Selection */}
            <div className="mb-4">
              <label htmlFor="tutorSelect" className="form-label fw-bold">
                Select Tutor
              </label>
              <select id="tutorSelect" className="form-select">
                <option value="">-- Choose a Tutor --</option>
                <option value="john">John Doe</option>
                <option value="sarah">Sarah Lee</option>
                <option value="michael">Michael Smith</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="form-label fw-bold">Rate Your Tutor</label>
              <div className="d-flex gap-2 fs-3 text-warning">
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
              </div>
              <small className="text-muted">Click to select your rating</small>
            </div>

            {/* Complaint / Feedback */}
            <div className="mb-4">
              <label htmlFor="feedback" className="form-label fw-bold">
                Feedback / Complaint
              </label>
              <textarea
                id="feedback"
                className="form-control"
                rows="4"
                placeholder="Share your experience or issues..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-success px-5">
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Feedback;