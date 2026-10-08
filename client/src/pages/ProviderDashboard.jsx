import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import serviceService from '../services/serviceService';
import bookingService from '../services/bookingService';
import BookingStatus from '../components/booking/BookingStatus';
import Timer from '../components/booking/Timer';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: 'Cleaning',
    price: '',
    priceType: 'fixed',
    duration: '',
    location: {
      city: '',
      state: '',
      country: ''
    }
  });

  const categories = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Gardening',
    'AC Repair',
    'Appliance Repair',
    'Beauty & Salon',
    'Pest Control',
    'Moving & Packing',
    'Photography',
    'Catering',
    'Other'
  ];

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getMyServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getProviderBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setServiceForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else {
      setServiceForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingService) {
        await serviceService.updateService(editingService._id, serviceForm);
        alert('Service updated successfully');
      } else {
        await serviceService.createService(serviceForm);
        alert('Service created successfully');
      }

      resetServiceForm();
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      category: 'Cleaning',
      price: '',
      priceType: 'fixed',
      duration: '',
      location: { city: '', state: '', country: '' }
    });
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      priceType: service.priceType,
      duration: service.duration,
      location: service.location || { city: '', state: '', country: '' }
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await serviceService.deleteService(id);
      alert('Service deleted successfully');
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      alert('Booking status updated');
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Provider Dashboard</h2>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h3 className="mb-0">{services.length}</h3>
              <small>My Services</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h3 className="mb-0">
                {bookings.filter((b) => b.status === 'pending').length}
              </h3>
              <small>Pending Bookings</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h3 className="mb-0">
                {bookings.filter((b) => b.status === 'completed').length}
              </h3>
              <small>Completed</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            My Services
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
            {bookings.filter((b) => b.status === 'pending').length > 0 && (
              <span 
                className="ms-2" 
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#dc3545',
                  borderRadius: '50%',
                  verticalAlign: 'middle'
                }}
                title={`${bookings.filter((b) => b.status === 'pending').length} pending booking(s)`}
              ></span>
            )}
          </button>
        </li>
      </ul>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="mb-3">
            <button
              className="btn btn-primary"
              onClick={() => setShowServiceForm(!showServiceForm)}
            >
              {showServiceForm ? 'Cancel' : '+ Add New Service'}
            </button>
          </div>

          {showServiceForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5>{editingService ? 'Edit Service' : 'Create New Service'}</h5>
                <form onSubmit={handleServiceSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={serviceForm.title}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={serviceForm.category}
                        onChange={handleServiceFormChange}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={serviceForm.description}
                      onChange={handleServiceFormChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={serviceForm.price}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Price Type *</label>
                      <select
                        className="form-select"
                        name="priceType"
                        value={serviceForm.priceType}
                        onChange={handleServiceFormChange}
                      >
                        <option value="fixed">Fixed</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Duration (minutes) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={serviceForm.duration}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.city"
                        value={serviceForm.location.city}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.state"
                        value={serviceForm.location.state}
                        onChange={handleServiceFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.country"
                        value={serviceForm.location.country}
                        onChange={handleServiceFormChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={resetServiceForm}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="row">
            {services.map((service) => (
              <div key={service._id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5>{service.title}</h5>
                    <p className="text-muted mb-2">{service.category}</p>
                    <p className="mb-2">{service.description}</p>
                    <p className="mb-2">
                      <strong>₹{service.price}</strong>{' '}
                      {service.priceType === 'hourly' ? '/ hour' : ''}
                    </p>
                    <p className="mb-3 text-muted">
                      ⭐ {service.rating.toFixed(1)} ({service.totalReviews}{' '}
                      reviews)
                    </p>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditService(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="card">
          <div className="card-body">
            {bookings.length === 0 ? (
              <p className="text-muted text-center">No bookings found</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Customer</th>
                      <th>Date & Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.serviceId?.title}</td>
                        <td>
                          {booking.customerId?.name}
                          <br />
                          <small className="text-muted">
                            {booking.customerPhone}
                          </small>
                        </td>
                        <td>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                          <br />
                          <small className="text-muted">
                            {booking.bookingTime}
                          </small>
                        </td>
                        <td>₹{booking.totalAmount}</td>
                        <td>
                          <BookingStatus status={booking.status} />
                        </td>
                        <td>
                          {booking.status === 'in-progress' && booking.startedAt && (
                            <Timer startTime={booking.startedAt} />
                          )}
                          {booking.status === 'completed' && booking.duration > 0 && (
                            <span className="badge bg-success">
                              {booking.duration >= 60 
                                ? `${Math.floor(booking.duration / 60)}h ${booking.duration % 60}m` 
                                : `${booking.duration}m`}
                            </span>
                          )}
                          {!booking.startedAt && booking.status !== 'completed' && (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking._id,
                                    'accepted'
                                  )
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking._id,
                                    'rejected'
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'accepted' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking._id,
                                  'in-progress'
                                )
                              }
                            >
                              Start
                            </button>
                          )}
                          {booking.status === 'in-progress' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking._id,
                                  'completed'
                                )
                              }
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
