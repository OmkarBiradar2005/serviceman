import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import BookingStatus from '../components/booking/BookingStatus';
import Timer from '../components/booking/Timer';
import ReviewForm from '../components/review/ReviewForm';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const reason = prompt('Please provide a reason for cancellation:');
      if (!reason) return;

      await bookingService.cancelBooking(bookingId, reason);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filterBookings = () => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  };

  const canCancelBooking = (booking) => {
    return booking.status === 'pending' || booking.status === 'accepted';
  };

  const canReviewBooking = (booking) => {
    return booking.status === 'completed';
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
      <h2 className="mb-4">Customer Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5>Welcome, {user.name}!</h5>
              <p className="text-muted mb-0">Manage your bookings and reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h3 className="mb-0">{bookings.length}</h3>
              <small>Total Bookings</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h3 className="mb-0">
                {bookings.filter((b) => b.status === 'pending').length}
              </h3>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h3 className="mb-0">
                {bookings.filter((b) => b.status === 'in-progress').length}
              </h3>
              <small>In Progress</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
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

      {/* Bookings List */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {filterBookings().length === 0 ? (
            <p className="text-muted text-center">No bookings found</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBookings().map((booking) => (
                    <React.Fragment key={booking._id}>
                      <tr>
                        <td>{booking.serviceId?.title}</td>
                        <td>{booking.providerId?.name}</td>
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
                          {canCancelBooking(booking) && (
                            <button
                              className="btn btn-sm btn-danger me-2"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                          {canReviewBooking(booking) && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setShowReviewForm(booking)}
                            >
                              Review
                            </button>
                          )}
                        </td>
                      </tr>
                      {showReviewForm?._id === booking._id && (
                        <tr>
                          <td colSpan="6">
                            <ReviewForm
                              bookingId={booking._id}
                              serviceId={booking.serviceId._id}
                              providerId={booking.providerId._id}
                              onSuccess={() => {
                                setShowReviewForm(null);
                                alert('Review submitted successfully!');
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
