import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function StudentResources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };
    fetchResources();
  }, []);

  return (
    <div>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">Available Resources</h2>
        <div className="row g-3">
          {resources.map((r) => (
            <div key={r._id} className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5>{r.title}</h5>
                  <p className="text-muted small">{r.description}</p>
                  <p className="small text-secondary">
                    Uploaded by: {r.uploadedBy?.fullName || "Unknown"}
                  </p>
                  <a
                    href={`http://localhost:5000${r.fileUrl}`}
                    download
                    className="btn btn-outline-dark btn-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
          {resources.length === 0 && <p>No resources available.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentResources;
