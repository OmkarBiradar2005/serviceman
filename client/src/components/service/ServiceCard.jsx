import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import wishlistService from '../../services/wishlistService';

const ServiceCard = ({ service }) => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, service._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.checkWishlist(service._id);
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(service._id);
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(service._id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
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

  return (
    <div className="col-md-4 mb-4">
      <div className="card service-card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{service.title}</h5>
            <button
              className={`btn btn-link p-0 ${isInWishlist ? 'text-danger' : 'text-muted'}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              title={isInWishlist ? t('service.removeFromWishlist') : t('service.addToWishlist')}
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              {isInWishlist ? '❤' : '🤍'}
            </button>
          </div>
          <p className="card-text text-muted">
            <small>{service.category}</small>
          </p>
          <p className="card-text">
            {service.description?.substring(0, 100)}
            {service.description?.length > 100 ? '...' : ''}
          </p>
          <div className="mb-2">
            <span className="rating-stars">{renderStars(Math.round(service.rating))}</span>
            <span className="text-muted ms-2">
              ({service.totalReviews} {service.totalReviews === 1 ? t('service.review') : t('service.reviews')})
            </span>
          </div>
          <div className="mb-2">
            <strong className="text-primary">
              ₹{service.price} {service.priceType === 'hourly' ? t('service.hourly') : ''}
            </strong>
          </div>
          <div className="mb-2 text-muted">
            <small>
              📍 {service.location?.city}, {service.location?.state}
            </small>
          </div>
          <div className="mb-3 text-muted">
            <small>⏱ {service.duration} {t('service.minutes')}</small>
          </div>
          <Link to={`/services/${service._id}`} className="btn btn-primary w-100">
            {t('service.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
