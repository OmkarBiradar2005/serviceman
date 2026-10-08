import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import wishlistService from '../services/wishlistService';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (serviceId) => {
    try {
      await wishlistService.removeFromWishlist(serviceId);
      setWishlist(wishlist.filter(service => service._id !== serviceId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
          ★
        </span>
      );
    }
    return stars;
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <span className="text-danger">❤</span> My Wishlist
        </h2>
        <span className="badge bg-primary">{wishlist.length} items</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: '4rem' }}>💔</div>
          <h4 className="text-muted mb-3">Your wishlist is empty</h4>
          <p className="text-muted mb-4">
            Start adding services you love to your wishlist!
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="row">
          {wishlist.map((service) => (
            <div key={service._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{service.title}</h5>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => handleRemoveFromWishlist(service._id)}
                      title="Remove from wishlist"
                    >
                      <i className="fs-4">❤</i>
                    </button>
                  </div>

                  <p className="card-text text-muted mb-2">
                    <small>
                      <span className="badge bg-secondary">{service.category}</span>
                    </small>
                  </p>

                  <p className="card-text">
                    {service.description?.substring(0, 100)}
                    {service.description?.length > 100 ? '...' : ''}
                  </p>

                  <div className="mb-2">
                    <span className="rating-stars">
                      {renderStars(Math.round(service.rating))}
                    </span>
                    <span className="text-muted ms-2">
                      ({service.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="mb-2">
                    <strong className="text-primary fs-5">
                      ₹{service.price}
                    </strong>
                    {service.priceType === 'hourly' && (
                      <small className="text-muted"> /hour</small>
                    )}
                  </div>

                  <div className="mb-3 text-muted">
                    <small>
                      📍 {service.location?.city}, {service.location?.state}
                    </small>
                    <br />
                    <small>⏱ {service.duration} minutes</small>
                  </div>

                  <div className="d-grid gap-2">
                    <Link
                      to={`/services/${service._id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
