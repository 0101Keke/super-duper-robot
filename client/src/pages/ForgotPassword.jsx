import { useState } from 'react';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    studentEmail: '',
    recoveryEmail: ''
  });

  const [status, setStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { studentEmail, recoveryEmail } = formData;

    if (!studentEmail || !recoveryEmail) {
      setStatus({ type: 'error', text: 'Please fill in both email fields.' });
      return;
    }

    if (studentEmail === recoveryEmail) {
      setStatus({
        type: 'error',
        text: 'Recovery email cannot be the same as your student email.'
      });
      return;
    }

    // Simulate async request
    setStatus({ type: 'loading', text: 'Sending recovery email...' });
    setTimeout(() => {
      setStatus({
        type: 'success',
        text: `A recovery link has been sent to ${recoveryEmail}.`
      });
      setFormData({ studentEmail: '', recoveryEmail: '' });
    }, 1500);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4 text-success">Forgot Password</h1>

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm bg-light-green"
      >
        {/* Feedback */}
        {status && (
          <div
            className={`alert ${
              status.type === 'success'
                ? 'alert-success'
                : status.type === 'error'
                ? 'alert-danger'
                : 'alert-info'
            }`}
          >
            {status.text}
          </div>
        )}

        <label htmlFor="studentEmail" className="form-label fw-bold">
          Student Email:
        </label>
        <input
          type="email"
          name="studentEmail"
          id="studentEmail"
          className="form-control mb-3"
          placeholder="Enter your student email"
          value={formData.studentEmail}
          onChange={handleChange}
          required
        />

        <label htmlFor="recoveryEmail" className="form-label fw-bold">
          Recovery Email:
        </label>
        <input
          type="email"
          name="recoveryEmail"
          id="recoveryEmail"
          className="form-control mb-3"
          placeholder="Enter recovery email"
          value={formData.recoveryEmail}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-dark w-100"
          disabled={status?.type === 'loading'}
        >
          {status?.type === 'loading' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
