import React, { useState } from 'react';
import API from '../api';

export default function UploadResource(){
  const [title,setTitle]=useState('');
  const [filePath,setFilePath]=useState('');
  const [type,setType]=useState('PDF');
  const [topicId,setTopicId]=useState('');
  const [msg,setMsg]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/resources/upload', { title, filePath, type, topicId });
      setMsg('Uploaded id: ' + res.data._id);
    } catch(err) {
      setMsg(err.response?.data?.message || 'error');
    }
  };
  return (
    <div>
      <h3>Upload Resource</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <input placeholder="File URL" value={filePath} onChange={e=>setFilePath(e.target.value)} required/>
        <input placeholder="Topic ID" value={topicId} onChange={e=>setTopicId(e.target.value)} required/>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option>PDF</option><option>Video</option><option>Audio</option><option>Link</option><option>Other</option>
        </select>
        <button>Upload</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
