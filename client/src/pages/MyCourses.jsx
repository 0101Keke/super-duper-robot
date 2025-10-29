import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import API from '../api';

function MyCourses() {
  const [myCoursesRaw, setMyCoursesRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    API.get('/enrollments/my')
      .then((res) => {
        if (!mounted) return;
        // Accept either: [ {title,...} ] OR [ { course: {title,...}, progress, status } ]
        const data = Array.isArray(res.data) ? res.data : [];
        setMyCoursesRaw(data);
      })
      .catch((err) => {
        if (!mounted) return;
        const msg =
          err?.response?.status === 401 || err?.response?.status === 403
            ? 'Please log in to view your courses.'
            : err?.response?.data?.message || 'Failed to load My Courses.';
        setError(msg);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Normalize to a consistent shape for rendering
  const myCourses = useMemo(() => {
    return myCoursesRaw.map((item) => {
      const isWrapped = !!item?.course && typeof item.course === 'object';
      const c = isWrapped ? item.course : item;

      const id = c?._id || c?.id || item?._id || item?.id || Math.random().toString(36).slice(2);
      const title = c?.title || 'Untitled Course';
      const category = c?.category || '';
      const instructor = c?.instructor || '';
      const thumbnail =
        c?.thumbnail || 'https://via.placeholder.com/640x360?text=Course+Thumbnail';

      // progress/status may come from enrollment record (outer item)
      const progress = Number(
        (isWrapped ? item?.progress : c?.progress) ?? 0
      );
      const clampedProgress = Number.isFinite(progress)
        ? Math.max(0, Math.min(100, Math.round(progress)))
        : 0;

      const status = (isWrapped ? item?.status : c?.status) || (clampedProgress >= 100 ? 'Completed' : 'In progress');

      return {
        id,
        title,
        category,
        instructor,
        thumbnail,
        progress: clampedProgress,
        status,
      };
    });
  }, [myCoursesRaw]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="container my-4 flex-grow-1">
        <h1 className="mb-3">My Courses</h1>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-muted">Loading your courses…</div>
        ) : myCourses.length === 0 ? (
          <div className="text-muted">You have not enrolled in any courses yet.</div>
        ) : (
          <div className="row g-3">
            {myCourses.map((course) => (
              <div className="col-12 col-sm-6 col-lg-4" key={course.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={course.thumbnail}
                    className="card-img-top"
                    alt={course.title}
                    style={{ objectFit: 'cover', height: 180 }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/640x360?text=Course+Thumbnail';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{course.title}</h5>
                    <div className="text-muted small mb-2">
                      {course.category ? `Category: ${course.category}` : ' '}
                    </div>
                    <p className="card-text">
                      {course.instructor ? `Instructor: ${course.instructor}` : ' '}
                    </p>

                    {/* Status + progress */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge text-bg-secondary">{course.status}</span>
                      <span className="small">{course.progress}%</span>
                    </div>
                    <div className="progress mb-3" role="progressbar" aria-label="Progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>  
                    <Link
          to={`/courses/${course.id}/assignments`}
          className="btn btn-outline-primary mt-auto"
        >
          View Assignments
        </Link>

                   

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyCourses;
