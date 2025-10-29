import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Hero Section */}
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-success mb-3">
                            Welcome to CampusLearn
                        </h1>
                        <p className="lead text-muted mb-4">
                            Your one-stop platform for collaborative learning, discussions, and academic resources
                        </p>

                        {user ? (
                            <div className="d-flex gap-3 justify-content-center">
                                {user.role === 'student' && (
                                    <Link to="/student">
                                        <button className="btn btn-success btn-lg px-5">
                                            Go to Dashboard
                                        </button>
                                    </Link>
                                )}
                                {user.role === 'tutor' && (
                                    <Link to="/tutor">
                                        <button className="btn btn-success btn-lg px-5">
                                            Go to Dashboard
                                        </button>
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/Admin">
                                        <button className="btn btn-success btn-lg px-5">
                                            Go to Admin Panel
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <Link to="/StuReg">
                                    <button className="btn btn-success btn-lg px-4">
                                        Student Registration
                                    </button>
                                </Link>
                                <Link to="/TutReg">
                                    <button className="btn btn-success btn-lg px-4">
                                        Tutor Registration
                                    </button>
                                </Link>
                                <Link to="/AdminReg">
                                    <button className="btn btn-success btn-lg px-4">
                                        Admin Registration
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Section */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 text-center p-4">
                                <div className="card-body">
                                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '80px', height: '80px' }}>
                                        <span className="fs-1">📚</span>
                                    </div>
                                    <h4 className="card-title">Discussion Forums</h4>
                                    <p className="card-text text-muted">
                                        Engage in meaningful discussions with peers and tutors on various topics
                                    </p>
                                    {user && (
                                        <Link to="/Discussion">
                                            <button className="btn btn-outline-success">
                                                Explore Discussions
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 text-center p-4">
                                <div className="card-body">
                                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '80px', height: '80px' }}>
                                        <span className="fs-1">📖</span>
                                    </div>
                                    <h4 className="card-title">Learning Resources</h4>
                                    <p className="card-text text-muted">
                                        Access a wide range of study materials, notes, and educational resources
                                    </p>
                                    {user && (
                                        <Link to="/Resource">
                                            <button className="btn btn-outline-success">
                                                View Resources
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 text-center p-4">
                                <div className="card-body">
                                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '80px', height: '80px' }}>
                                        <span className="fs-1">💬</span>
                                    </div>
                                    <h4 className="card-title">Direct Messaging</h4>
                                    <p className="card-text text-muted">
                                        Connect directly with tutors and classmates for personalized help
                                    </p>
                                    {user && (
                                        <Link to="/Message">
                                            <button className="btn btn-outline-success">
                                                Start Chatting
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded shadow-sm p-5 mt-5">
                        <h2 className="text-success mb-4 text-center">Why Choose CampusLearn?</h2>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h5>✓ Collaborative Learning</h5>
                                <p className="text-muted">
                                    Work together with peers and tutors in a supportive environment
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h5>✓ Expert Tutors</h5>
                                <p className="text-muted">
                                    Get guidance from experienced tutors in various subjects
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h5>✓ Rich Resource Library</h5>
                                <p className="text-muted">
                                    Access comprehensive study materials and educational content
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h5>✓ Active Community</h5>
                                <p className="text-muted">
                                    Join a vibrant community of learners and educators
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    {!user && (
                        <div className="text-center mt-5 bg-success text-white rounded p-5">
                            <h3 className="mb-3">Ready to Start Learning?</h3>
                            <p className="mb-4">Join thousands of students already benefiting from CampusLearn</p>
                            <div className="d-flex gap-3 justify-content-center">
                                <Link to="/StuReg">
                                    <button className="btn btn-light btn-lg px-5">
                                        Sign Up Now
                                    </button>
                                </Link>
                                <Link to="/Contact">
                                    <button className="btn btn-outline-light btn-lg px-5">
                                        Contact Us
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;