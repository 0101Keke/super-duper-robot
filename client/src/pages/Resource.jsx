import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Resource(){
<div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid py-4 flex-grow-1">
        <div className="row g-4">
          {/* Post Comment Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label htmlFor="comment" className="form-label fw-semibold">
                Post a Comment:
              </label>
              <input
                type="text"
                id="comment"
                className="form-control mb-3"
                placeholder="Enter your comment"
              />
              <button
                type="submit"
                className="btn btn-dark text-white w-100"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Response Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Response:</label>
              <p className="text-muted">No responses yet...</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Comments:</label>
              <ul className="list-unstyled mt-2">
                <li className="border-bottom pb-2 mb-2">User1: Great topic!</li>
                <li className="border-bottom pb-2 mb-2">User2: I totally agree.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
}
export default Resource;
