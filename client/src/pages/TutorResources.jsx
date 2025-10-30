import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function TutorResources() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("file", formData.file);

    try {
      const res = await axios.post("http://localhost:5000/api/resources/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Resource uploaded successfully!");
      setFormData({ title: "", description: "", file: null });
    } catch (err) {
      setMessage("❌ Upload failed. " + (err.response?.data?.message || ""));
    }
  };

  return (
    <div>
      <Header />
      <div className="container my-5" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Upload a New Resource</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            name="title"
            className="form-control mb-3"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label className="form-label fw-bold">Description</label>
          <textarea
            name="description"
            className="form-control mb-3"
            value={formData.description}
            onChange={handleChange}
          />

          <label className="form-label fw-bold">Select File</label>
          <input
            type="file"
            name="file"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-dark w-100">
            Upload Resource
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default TutorResources;
