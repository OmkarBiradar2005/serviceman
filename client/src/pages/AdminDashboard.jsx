import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import reviewService from '../services/reviewService';
import bookingService from '../services/bookingService';
import BookingStatus from '../components/booking/BookingStatus';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, reviewsRes, bookingsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(),
        reviewService.getAllReviews(),
        bookingService.getAllBookings()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setReviews(reviewsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, !currentStatus);
      alert('User status updated');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      alert('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      alert('Review deleted successfully');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleToggleReviewApproval = async (reviewId) => {
    try {
      await reviewService.toggleReviewApproval(reviewId);
      alert('Review approval status updated');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update review');
    }
  };

  if (loading || !stats) {
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
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Overview Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h3 className="mb-0">{stats.counts.totalUsers}</h3>
              <small>Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h3 className="mb-0">{stats.counts.totalServices}</h3>
              <small>Total Services</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h3 className="mb-0">{stats.counts.totalBookings}</h3>
              <small>Total Bookings</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h3 className="mb-0">{stats.counts.totalReviews}</h3>
              <small>Total Reviews</small>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-0">{stats.counts.totalCustomers}</h4>
              <small className="text-muted">Customers</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-0">{stats.counts.totalProviders}</h4>
              <small className="text-muted">Providers</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-0">{stats.counts.pendingBookings}</h4>
              <small className="text-muted">Pending Bookings</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h4 className="mb-3">Recent Bookings</h4>
          {stats.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Provider</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.serviceId?.title}</td>
                      <td>{booking.customerId?.name}</td>
                      <td>{booking.providerId?.name}</td>
                      <td>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td>
                        <BookingStatus status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No recent bookings</p>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">Manage Users</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-secondary">{user.role}</span>
                      </td>
                      <td>
                        {user.isActive ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleToggleUserStatus(user._id, user.isActive)
                          }
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">All Bookings</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Provider</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.serviceId?.title}</td>
                      <td>{booking.customerId?.name}</td>
                      <td>{booking.providerId?.name}</td>
                      <td>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td>₹{booking.totalAmount}</td>
                      <td>
                        <BookingStatus status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">Manage Reviews</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td>{review.serviceId?.title}</td>
                      <td>{review.customerId?.name}</td>
                      <td>⭐ {review.rating}/5</td>
                      <td>{review.comment?.substring(0, 50)}...</td>
                      <td>
                        {review.isApproved ? (
                          <span className="badge bg-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleToggleReviewApproval(review._id)}
                        >
                          {review.isApproved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
