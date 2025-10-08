import React, { useState } from 'react';
import API from '../api';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMsg('Logged in ' + res.data.user.name);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        <button>Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
