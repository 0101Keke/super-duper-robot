import React, { useState } from 'react';

const FileUploadModal = ({ onSubmit, onClose }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onSubmit(file);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Submit Assignment</h5>
          <input type="file" className="form-control my-2" onChange={(e) => setFile(e.target.files[0])} />
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={() => onSubmit(file)}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
