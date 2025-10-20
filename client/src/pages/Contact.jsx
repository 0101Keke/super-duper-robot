import { useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Contact() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // State for submission feedback
  const [status, setStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    // Simulate async message send (like API call)
    setStatus({ type: 'loading', text: 'Sending your message...' });

    setTimeout(() => {
      setStatus({ type: 'success', text: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' }); // clear form
    }, 1500);
  };

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

              {/* Feedback message */}
              {status && (
                <div
                  className={`alert ${
                    status.type === 'success'
                      ? 'alert-success'
                      : status.type === 'error'
                      ? 'alert-danger'
                      : 'alert-info'
                  }`}
                >
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={status?.type === 'loading'}
                >
                  {status?.type === 'loading' ? 'Sending...' : 'Send Message'}
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
