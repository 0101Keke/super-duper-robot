import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Topics from './pages/Topics';
import UploadResource from './pages/UploadResource';

export default function App() {
  return (
    <div style={{ padding:20 }}>
      <h1>CampusLearn (demo)</h1>
      <Register />
      <hr/>
      <Login />
      <hr/>
      <Topics />
      <hr/>
      <UploadResource />
    </div>
  );
}
