import { Link } from 'react-router-dom';

function Footer() {
    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    return (
        <footer className="bg-success py-4 mt-auto">
            <div className="container">
                <div className="row">
                    {/* Column 1: About */}
                    <div className="col-md-3 mb-3">
                        <h5 className="text-white fw-bold mb-3">CampusLearn</h5>
                        <p className="text-white-50 small">
                            Your collaborative learning platform for academic success.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-md-3 mb-3">
                        <h6 className="text-white fw-bold mb-3">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-white-50 text-decoration-none">
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/Discussion" className="text-white-50 text-decoration-none">
                                    Discussions
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/Resource" className="text-white-50 text-decoration-none">
                                    Resources
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/Contact" className="text-white-50 text-decoration-none">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div className="col-md-3 mb-3">
                        <h6 className="text-white fw-bold mb-3">Support</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/Feedback" className="text-white-50 text-decoration-none">
                                    Give Feedback
                                </Link>
                            </li>
                            <li className="mb-2">
                                <button
                                    className="btn btn-link text-white-50 text-decoration-none p-0"
                                    onClick={() => alert('FAQ page coming soon!')}
                                >
                                    FAQ
                                </button>
                            </li>
                            <li className="mb-2">
                                <button
                                    className="btn btn-link text-white-50 text-decoration-none p-0"
                                    onClick={handleCopy}
                                >
                                    Copy Link
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="col-md-3 mb-3">
                        <h6 className="text-white fw-bold mb-3">Get in Touch</h6>
                        <p className="text-white-50 small mb-2">
                            <i className="bi bi-envelope me-2"></i>
                            info@campuslearn.com
                        </p>
                        <p className="text-white-50 small mb-2">
                            <i className="bi bi-phone me-2"></i>
                            +27 12 345 6789
                        </p>
                        <Link to="/Contact">
                            <button className="btn btn-light btn-sm mt-2">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>

                <hr className="bg-white-50 my-4" />

                {/* Bottom Row */}
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p className="text-white-50 small mb-0">
                        &copy; {new Date().getFullYear()} CampusLearn. All rights reserved.
                    </p>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success text-white btn-sm fw-semibold"
                            onClick={() => alert('FAQ page coming soon!')}
                        >
                            FAQ
                        </button>
                        <button
                            className="btn btn-success text-white btn-sm fw-semibold"
                            onClick={handleCopy}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;