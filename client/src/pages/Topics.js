import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Topics(){
  const [topics, setTopics] = useState([]);
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [moduleCode,setModuleCode]=useState('');

  useEffect(()=>{ fetch(); },[]);
  const fetch = async ()=> {
    try { const res = await API.get('/topics'); setTopics(res.data);} catch(e){ console.error(e); }
  };

  const create = async (e) => {
    e.preventDefault();
    try { await API.post('/topics', { title, description: desc, moduleCode}); fetch(); } catch(e){ alert(e.response?.data?.message||'err'); }
  };

  return (
    <div>
      <h3>Topics</h3>
      <form onSubmit={create}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <input placeholder="Module code" value={moduleCode} onChange={e=>setModuleCode(e.target.value)} required/>
        <input placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} required/>
        <button>Create Topic</button>
      </form>

      <ul>
        {topics.map(t => <li key={t._id}>{t.title} - {t.moduleCode} - by {t.creator?.name}</li>)}
      </ul>
    </div>
  );
}
