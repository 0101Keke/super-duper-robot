import { useEffect, useState } from 'react';
import { usersAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersAPI.getProfile();
        const data = response.data;
        setProfile(data);
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
      } catch (error) {
        console.error('Profile fetch failed:', error);
        setMessage({ type: 'danger', text: 'Failed to load profile. Please log in again.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile picture preview and selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage({ type: '', text: '' });

  try {
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('phone', formData.phone);
    data.append('bio', formData.bio);

    // ✅ add password fields if filled
    if (formData.currentPassword) data.append('currentPassword', formData.currentPassword);
    if (formData.newPassword) data.append('newPassword', formData.newPassword);

    // ✅ add profile picture
    if (selectedFile) data.append('profilePicture', selectedFile);

    const response = await usersAPI.updateProfile(data);
    setProfile(response.data);
    setMessage({ type: 'success', text: '✅ Profile updated successfully!' });

    // Clear password fields for safety
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    setSelectedFile(null);
  } catch (error) {
    console.error('Profile update failed:', error);
    const msg = error.response?.data?.message || '❌ Failed to update profile. Please try again.';
    setMessage({ type: 'danger', text: msg });
  }
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <div className="container flex-grow-1 py-5">
        <h2 className="text-center text-success mb-4">My Profile</h2>

        {message.text && (
          <div className={`alert alert-${message.type} text-center`}>{message.text}</div>
        )}

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-4">
              <div className="text-center mb-4">
                <img
                  src={
                    previewImage
                      ? previewImage
                      : profile?.profilePicture
                      ? `http://localhost:5000${profile.profilePicture}`
                      : 'https://placehold.co/150x150?text=Profile+Pic'
                  }
                  alt="Profile"
                  className="rounded-circle mb-3 border border-success"
                  style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                />
                <h5 className="fw-bold">{profile?.fullName}</h5>
                <p className="text-muted mb-1">{profile?.email}</p>
                <p className="badge bg-success text-white">{profile?.role?.toUpperCase()}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Bio</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write something about yourself..."
                  ></textarea>
                </div>

                <div className="mb-3">
  <label className="form-label fw-bold">Current Password</label>
  <input
    type="password"
    name="currentPassword"
    className="form-control"
    value={formData.currentPassword || ''}
    onChange={handleChange}
  />
</div>

<div className="mb-3">
  <label className="form-label fw-bold">New Password</label>
  <input
    type="password"
    name="newPassword"
    className="form-control"
    value={formData.newPassword || ''}
    onChange={handleChange}
  />
</div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <small className="text-muted d-block mt-1">
                      Selected: {selectedFile.name}
                    </small>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success px-4">
                    Save Changes
                  </button>
                  <button
                    type="button"
                      className="btn btn-outline-danger px-4"
                        onClick={() => {
                              logout();
                                 window.location.href = '/login';  }}>
                                    Logout
                                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
