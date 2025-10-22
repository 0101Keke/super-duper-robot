import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Resources() {
  // State for resources
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for upload form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch resources on page load
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, url: newUrl }),
      });

      const result = await response.json();
      
      // Add new resource to list (with mock ID since backend returns message)
      const newResource = {
        id: resources.length + 1,
        name: newName,
        url: newUrl
      };
      setResources([...resources, newResource]);
      
      // Clear form and show success
      setNewName('');
      setNewUrl('');
      setUploadSuccess(true);
      
      // Hide form and success message after 2 seconds
      setTimeout(() => {
        setShowUploadForm(false);
        setUploadSuccess(false);
      }, 2000);

    } catch (err) {
      alert('Failed to upload resource: ' + err.message);
    }
  };

  const getFileType = (url) => {
    if (url.includes('.pdf')) return ' PDF';
    if (url.includes('.mp4') || url.includes('.avi')) return '🎥 Video';
    if (url.includes('.jpg') || url.includes('.png')) return '🖼️ Image';
    if (url.includes('.doc')) return ' Document';
    return '📎 File';
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1> Learning Resources</h1>
            <p className="text-muted">Access study materials and course resources</p>
          </div>
          <button 
            className="btn btn-dark"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? '✕ Cancel' : '⬆ Upload Resource'}
          </button>
        </div>

        {/* Upload Form (Toggle) */}
        {showUploadForm && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Upload New Resource</h5>
              
              {uploadSuccess && (
                <div className="alert alert-success">
                   Resource uploaded successfully!
                </div>
              )}

              <form onSubmit={handleUploadResource}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="resourceName" className="form-label">
                      Resource Name
                    </label>
                    <input
                      type="text"
                      id="resourceName"
                      className="form-control"
                      placeholder="e.g., JavaScript Tutorial"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="resourceUrl" className="form-label">
                      Resource URL
                    </label>
                    <input
                      type="url"
                      id="resourceUrl"
                      className="form-control"
                      placeholder="https://example.com/file.pdf"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-dark">
                      Upload Resource
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger">
             Error: {error}
          </div>
        )}

        {/* Resources Grid */}
        {!loading && !error && (
          <div className="row g-4">
            {resources.length === 0 ? (
              <div className="col-12">
                <div className="text-center p-5 bg-light rounded">
                  <h3 className="text-muted">No resources available</h3>
                  <p>Upload the first resource to get started!</p>
                </div>
              </div>
            ) : (
              resources.map((resource) => (
                <div key={resource.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm resource-card">
                    <div className="card-body">
                      {/* File Type Badge */}
                      <div className="mb-2">
                        <span className="badge bg-light text-dark border">
                          {getFileType(resource.url)}
                        </span>
                      </div>

                      {/* Resource Name */}
                      <h5 className="card-title">{resource.name}</h5>

                      {/* Resource URL (truncated) */}
                      <p className="card-text text-muted small">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {resource.url.length > 50 
                            ? resource.url.substring(0, 50) + '...' 
                            : resource.url}
                        </a>
                      </p>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-3">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-dark btn-sm flex-grow-1"
                        >
                          Open Resource
                        </a>
                        <a
                          href={resource.url}
                          download
                          className="btn btn-outline-dark btn-sm"
                          title="Download"
                        >
                          Download
                        </a>
                      </div>
                    </div>

                    {/* Resource ID (footer) */}
                    <div className="card-footer bg-light text-muted small">
                      Resource ID: {resource.id}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Resource Count */}
        {!loading && !error && resources.length > 0 && (
          <div className="mt-4 text-center text-muted">
            Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Resources;