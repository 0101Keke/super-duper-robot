import React, { useEffect, useState } from 'react';
import Header from '../Components/StudentNav.jsx';
import Footer from '../Components/Footer.jsx';
import API, { coursesAPI } from '../api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState(new Set());
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  // 1) Fetch all courses
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      coursesAPI.getAll(),            // GET /api/courses
      API.get('/enrollments/my')      // GET /api/enrollments/my
    ])
      .then(([allRes, myRes]) => {
        if (!mounted) return;
        const all = Array.isArray(allRes.data) ? allRes.data : (allRes.data?.courses ?? []);
        setCourses(all);

        // Normalize my enrollments -> ids
        const mineRaw = Array.isArray(myRes.data) ? myRes.data : [];
        const ids = new Set(
          mineRaw.map(item => {
            const c = item?.course && typeof item.course === 'object' ? item.course : item;
            return c?._id || c?.id;
          }).filter(Boolean)
        );
        setEnrolledIds(ids);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Failed to load courses.');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  // 2) Enroll flow with optimistic + persistent UI state
  const enroll = async (courseId) => {
    setError(null);
    setNotice(null);

    // Prevent duplicate clicks
    setBusyIds(prev => new Set(prev).add(courseId));

    try {
      await API.post(`/enrollments/${courseId}/enroll`);
      // Mark enrolled locally
      setEnrolledIds(prev => new Set(prev).add(courseId));
      setNotice('Enrolled successfully 🎉');

      // Trigger a silent refresh so Dashboard/Continue Learning can re-render
      // Option A: fire a custom event any dashboard component can listen for
      window.dispatchEvent(new CustomEvent('enrollment:changed'));

      // Option B (also fine): refetch my enrollments here to stay in sync
      // const my = await API.get('/enrollments/my');
      // setEnrolledIds(new Set(my.data.map(x => (x.course?._id || x._id))));

      // Auto-clear notice
      setTimeout(() => setNotice(null), 2500);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || '';

      if (status === 400 && /already enrolled/i.test(msg)) {
        // Treat as enrolled for UI
        setEnrolledIds(prev => new Set(prev).add(courseId));
        setNotice('You are already enrolled in this course.');
        setTimeout(() => setNotice(null), 2500);
      } else if (status === 401 || status === 403) {
        setError('Please log in to enroll.');
      } else {
        setError(msg || 'Failed to enroll. Please try again.');
      }
    } finally {
      setBusyIds(prev => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });
    }
  };

  const cardThumb = (course) =>
    course?.thumbnail || 'https://via.placeholder.com/640x360?text=Course+Thumbnail';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container my-4 flex-grow-1">
        <h1 className="mb-3">Courses</h1>

        {notice && <div className="alert alert-success py-2">{notice}</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {loading ? (
          <div className="text-muted">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="text-muted">No courses yet.</div>
        ) : (
          <div className="row g-3">
            {courses.map(course => {
              const id = course._id || course.id;
              const isBusy = busyIds.has(id);
              const isEnrolled = enrolledIds.has(id);

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={cardThumb(course)}
                      className="card-img-top"
                      alt={course.title || 'Course thumbnail'}
                      style={{ objectFit: 'cover', height: 180 }}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Course+Thumbnail'; }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title mb-1">{course.title || 'Untitled Course'}</h5>
                      <div className="text-muted small mb-2">
                        {course.category ? `Category: ${course.category}` : ' '}
                      </div>
                      <p className="card-text flex-grow-1">
                        {course.instructor ? `Instructor: ${course.instructor}` : ' '}
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary mt-auto"
                        disabled={isBusy || isEnrolled}
                        onClick={() => enroll(id)}
                      >
                        {isEnrolled ? 'Enrolled' : isBusy ? 'Enrolling…' : 'Enroll'}
                      </button>
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

export default Courses;
