import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);

      if (response.success) {
        updateUserProfile(response.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      }
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">My Profile</h3>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Display Mode */}
              {!isEditing ? (
                <div>
                  <div className="mb-4">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Name:</strong>
                      </div>
                      <div className="col-md-8">{user?.name}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Email:</strong>
                      </div>
                      <div className="col-md-8">{user?.email}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Role:</strong>
                      </div>
                      <div className="col-md-8">
                        <span className="badge bg-primary">
                          {user?.role?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Phone:</strong>
                      </div>
                      <div className="col-md-8">
                        {user?.phone || 'Not provided'}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Address:</strong>
                      </div>
                      <div className="col-md-8">
                        {user?.address?.street && (
                          <>
                            {user.address.street}
                            <br />
                          </>
                        )}
                        {user?.address?.city && `${user.address.city}, `}
                        {user?.address?.state && `${user.address.state} `}
                        {user?.address?.zipCode && `${user.address.zipCode}`}
                        {user?.address?.country && (
                          <>
                            <br />
                            {user.address.country}
                          </>
                        )}
                        {!user?.address?.street &&
                          !user?.address?.city &&
                          'Not provided'}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Member Since:</strong>
                      </div>
                      <div className="col-md-8">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={user?.email}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <h5 className="mb-3">Address Information</h5>

                  <div className="mb-3">
                    <label htmlFor="address.street" className="form-label">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="address.city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="address.state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="address.zipCode" className="form-label">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="address.country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address.country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
