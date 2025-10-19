import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Contact() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-5 flex-grow-1">
        <h2 className="text-center text-success mb-4">Contact Us</h2>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-md-6">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <h4 className="mb-3">Send us a message</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="4"
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-md-6">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <h4 className="mb-3">Our Contact Information</h4>
              <p>
                <strong>Address:</strong><br />
                123 Green Street,<br />
                Cape Town, South Africa
              </p>

              <p>
                <strong>Phone:</strong><br />
                +27 12 345 6789
              </p>

              <p>
                <strong>Email:</strong><br />
                contact@progskillai.com
              </p>

              <p>
                <strong>Office Hours:</strong><br />
                Mon - Fri, 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;