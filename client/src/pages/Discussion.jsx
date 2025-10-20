import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Discussion() {
  // Example discussion topics
  const [topics] = useState([
    { id: 1, title: 'Best study techniques for exams?', category: 'General Discussions', author: 'Alex' },
    { id: 2, title: 'How to understand recursion?', category: 'Course Help', author: 'Sizwe' },
    { id: 3, title: 'Platform updates - October 2025', category: 'Announcements', author: 'Admin' },
    { id: 4, title: 'Tips for new computer science students', category: 'General Discussions', author: 'Nandi' },
    { id: 5, title: 'Understanding data structures', category: 'Course Help', author: 'Liam' },
  ]);

  // State for search query
  const [search, setSearch] = useState('');

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* Top controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/Topic">
            <button className="btn btn-dark text-white px-4">New Topic</button>
          </Link>
          <input
            type="search"
            placeholder="Search topics..."
            className="form-control w-25 border-success"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="p-3 rounded bg-success text-white shadow-sm">
              <h5>General Discussions</h5>
              <p className="mb-0">Join community topics and student chat threads.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Course Help</h5>
              <p className="mb-0">Ask questions or share study resources here.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Announcements</h5>
              <p className="mb-0">Stay updated with the latest platform news.</p>
            </div>
          </div>
        </div>

        {/* Discussion Topics List */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="mb-3 text-success">Latest Discussions</h4>

          {filteredTopics.length === 0 ? (
            <p className="text-muted">No discussions found.</p>
          ) : (
            <ul className="list-group">
              {filteredTopics.map((topic) => (
                <li
                  key={topic.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Link to={`/topic/${topic.id}`} className="text-decoration-none text-dark fw-bold">
                      {topic.title}
                    </Link>
                    <p className="mb-0 small text-muted">
                      {topic.category} • by {topic.author}
                    </p>
                  </div>
                  <Link to={`/topic/${topic.id}`}>
                    <button className="btn btn-outline-success btn-sm">View</button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Discussion;
