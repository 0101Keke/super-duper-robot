import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function ThankYou() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="bg-light-green p-5 rounded shadow-sm text-center">
          <h1 className="text-success mb-3">Thank You!</h1>
          <p className="lead text-muted mb-4">
            Your message has been received. We’ll get back to you shortly.
          </p>
          <a href="/" className="btn btn-success text-white">
            Return Home
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default ThankYou;
