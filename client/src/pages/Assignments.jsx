import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import API from '../api';

function Assignments() {
  const { courseId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // UI state per assignment
  const [files, setFiles] = useState({});            // { [assignmentId]: File }
  const [busy, setBusy] = useState(new Set());       // uploading ids
  const [progress, setProgress] = useState({});      // { [assignmentId]: 0..100 }
  const [notice, setNotice] = useState(null);
  const [submittedIds, setSubmittedIds] = useState(new Set()); // mark as submitted in UI

  const normalize = useCallback((raw) => {
    const arr = Array.isArray(raw) ? raw : raw?.assignments || [];
    return arr.map((a) => ({
      id: a._id || a.id,
      title: a.title || 'Untitled Assignment',
      description: a.description || '',
      dueDate: a.dueDate ? new Date(a.dueDate) : null,
      status: a.status || a.submissionStatus || 'Assigned',
      // if backend sends already-submitted information:
      submitted: !!(a.submitted || a.hasSubmitted || false),
      maxScore: a.maxScore,
    })).filter(x => !!x.id);
  }, []);

  const fetchAssignments = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setErr(null);
      const res = await API.get(`/assignments/course/${courseId}`);
      const list = normalize(res.data);
      setAssignments(list);
      // prefill submitted ids if provided by backend
      const preset = new Set(list.filter(x => x.submitted || (/submitted/i.test(x.status))).map(x => x.id));
      setSubmittedIds(preset);
    } catch (e) {
      const msg =
        e?.response?.status === 401 || e?.response?.status === 403
          ? 'Please log in to view assignments.'
          : (e?.response?.data?.message || 'Failed to load assignments.');
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [courseId, normalize]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const onFileChange = (assignmentId, e) => {
    const file = e.target.files?.[0];
    setFiles((prev) => ({ ...prev, [assignmentId]: file || null }));
  };

  const submit = async (assignmentId) => {
    const file = files[assignmentId];
    if (!file) {
      setNotice('Please choose a file first.');
      setTimeout(() => setNotice(null), 2000);
      return;
    }

    // mark busy
    setBusy((prev) => new Set(prev).add(assignmentId));
    setProgress((p) => ({ ...p, [assignmentId]: 0 }));
    setErr(null);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignmentId', assignmentId);

      await API.post('/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress((p) => ({ ...p, [assignmentId]: pct }));
        }
      });

      setNotice('Submission uploaded successfully 🎉');
      // Mark as submitted in UI
      setSubmittedIds((prev) => new Set(prev).add(assignmentId));
      // Optionally refresh to reflect any server-side status:
      fetchAssignments();

      // clear file input selection for that assignment
      setFiles((prev) => ({ ...prev, [assignmentId]: null }));
      setTimeout(() => setNotice(null), 2500);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to submit. Please try again.';
      setErr(msg);
    } finally {
      setBusy((prev) => {
        const next = new Set(prev);
        next.delete(assignmentId);
        return next;
      });
    }
  };

  const formatDate = (d) =>
    d ? d.toLocaleString() : '';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="container my-4 flex-grow-1">
        <h1 className="mb-3">Assignments</h1>

        {notice && <div className="alert alert-success py-2">{notice}</div>}
        {err && <div className="alert alert-danger py-2">{err}</div>}

        {loading ? (
          <div className="text-muted">Loading assignments…</div>
        ) : assignments.length === 0 ? (
          <div className="text-muted">No assignments for this course.</div>
        ) : (
          <div className="row g-3">
            {assignments.map((a) => {
              const isBusy = busy.has(a.id);
              const pct = progress[a.id] ?? 0;
              const isSubmitted = submittedIds.has(a.id);
              return (
                <div className="col-12" key={a.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="pe-3">
                          <h5 className="card-title mb-1">{a.title}</h5>
                          <div className="text-muted small mb-2">
                            {a.dueDate ? <>Due: {formatDate(a.dueDate)}</> : ' '}
                            {a.maxScore != null && <> · Max: {a.maxScore}</>}
                          </div>
                          {a.description && <p className="mb-2">{a.description}</p>}
                          <span className={`badge ${isSubmitted ? 'text-bg-success' : 'text-bg-secondary'}`}>
                            {isSubmitted ? 'Submitted' : (a.status || 'Assigned')}
                          </span>
                        </div>

                        <div style={{ minWidth: 280 }} className="ms-auto">
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => onFileChange(a.id, e)}
                              disabled={isBusy}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => submit(a.id)}
                              disabled={isBusy || isSubmitted || !files[a.id]}
                            >
                              {isSubmitted ? 'Submitted' : (isBusy ? 'Uploading…' : 'Submit')}
                            </button>
                          </div>

                          {isBusy && (
                            <div className="progress mt-2" role="progressbar" aria-label="Upload progress">
                              <div className="progress-bar" style={{ width: `${pct}%` }}>
                                {pct}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Assignments;
