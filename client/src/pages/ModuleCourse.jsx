import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function ModuleCourse() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        <h1 className="text-center text-success mb-4">Add Module or Course</h1>

        <div className="row g-4">
          {/* Div 1 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Module Details</h4>
              <p>Add new module information here.</p>
              <button className="btn btn-success">Add Module</button>
            </div>
          </div>

          {/* Div 2 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Course Information</h4>
              <p>Manage or update your course details.</p>
              <button className="btn btn-success">Add Course</button>
            </div>
          </div>

          {/* Div 3 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Assignments</h4>
              <p>Link assignments to modules or courses.</p>
              <button className="btn btn-success">Add Assignment</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ModuleCourse;
