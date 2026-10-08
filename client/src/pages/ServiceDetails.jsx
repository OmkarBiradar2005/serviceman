import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import serviceService from '../services/serviceService';
import reviewService from '../services/reviewService';
import wishlistService from '../services/wishlistService';
import BookingForm from '../components/booking/BookingForm';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
    fetchReviews();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [id, isAuthenticated]);

  const fetchServiceDetails = async () => {
    try {
      const response = await serviceService.getServiceById(id);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getServiceReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.checkWishlist(id);
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(id);
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      alert(t('service.onlyCustomersCanBook'));
      return;
    }

    setShowBookingForm(true);
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
          <span className="visually-hidden">{t('service.loading')}</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5">
        <h3>{t('service.serviceNotFound')}</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="mb-3">{service.title}</h1>
              <div className="mb-3">
                <span className="badge bg-primary me-2">{service.category}</span>
                {service.availability ? (
                  <span className="badge bg-success">{t('service.available')}</span>
                ) : (
                  <span className="badge bg-danger">{t('service.notAvailable')}</span>
                )}
              </div>

              <div className="mb-3">
                <span className="rating-stars">
                  {renderStars(Math.round(service.rating))}
                </span>
                <span className="text-muted ms-2">
                  ({service.totalReviews} {service.totalReviews === 1 ? t('service.review') : t('service.reviews')})
                </span>
              </div>

              <h4 className="text-primary mb-3">
                ₹{service.price}{' '}
                {service.priceType === 'hourly' ? t('service.hourly') : `(${t('service.fixed')})`}
              </h4>

              <div className="mb-4">
                <h5>{t('service.description')}</h5>
                <p>{service.description}</p>
              </div>

              <div className="mb-4">
                <h5>{t('service.serviceDetails')}</h5>
                <ul>
                  <li>{t('service.duration')}: {service.duration} {t('service.minutes')}</li>
                  <li>
                    {t('service.location')}: {service.location?.city}, {service.location?.state}
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h5>{t('service.providerInfo')}</h5>
                <p>
                  <strong>{t('service.name')}:</strong> {service.providerId?.name}
                  <br />
                  <strong>{t('service.email')}:</strong> {service.providerId?.email}
                  <br />
                  <strong>{t('service.phone')}:</strong> {service.providerId?.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">{t('service.customerReviews')}</h4>
              {reviews.length === 0 ? (
                <p className="text-muted">{t('service.noReviews')}</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{review.customerId?.name}</strong>
                        <div className="rating-stars">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mt-2 mb-0">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {showBookingForm ? (
            <div className="card">
              <div className="card-body">
                <BookingForm
                  service={service}
                  onSuccess={() => {
                    setShowBookingForm(false);
                    navigate('/customer/dashboard');
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="card sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h4 className="mb-3">{t('booking.bookThisService')}</h4>
                <div className="mb-3">
                  <strong className="text-primary display-6">
                    ₹{service.price}
                  </strong>
                  {service.priceType === 'hourly' && (
                    <span className="text-muted"> {t('service.hourly')}</span>
                  )}
                </div>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={handleBookNow}
                  disabled={!service.availability}
                >
                  {service.availability ? t('service.bookNow') : t('service.notAvailable')}
                </button>
                <button
                  className={`btn w-100 mb-2 ${
                    isInWishlist ? 'btn-danger' : 'btn-outline-danger'
                  }`}
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      {isInWishlist ? `❤ ${t('service.removeFromWishlist')}` : `🤍 ${t('service.addToWishlist')}`}
                    </>
                  )}
                </button>
                {!isAuthenticated && (
                  <p className="text-muted text-center small mb-0">
                    {t('service.pleaseLogin')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
