import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import bookingService from '../../services/bookingService';

const BookingForm = ({ service, onSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    customerAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    customerPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        customerAddress: {
          ...prev.customerAddress,
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
    setLoading(true);

    try {
      const bookingData = {
        serviceId: service._id,
        ...formData
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        alert('Booking created successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-4">{t('booking.bookThisService')}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="bookingDate" className="form-label">
            {t('booking.bookingDate')} *
          </label>
          <input
            type="date"
            className="form-control"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            min={getMinDate()}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="bookingTime" className="form-label">
            {t('booking.bookingTime')} *
          </label>
          <input
            type="time"
            className="form-control"
            id="bookingTime"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="customerPhone" className="form-label">
          {t('booking.phone')} *
        </label>
        <input
          type="tel"
          className="form-control"
          id="customerPhone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          required
        />
      </div>

      <h5 className="mb-3">{t('booking.serviceAddress')}</h5>

      <div className="mb-3">
        <label htmlFor="address.street" className="form-label">
          {t('booking.streetAddress')}
        </label>
        <input
          type="text"
          className="form-control"
          id="address.street"
          name="address.street"
          value={formData.customerAddress.street}
          onChange={handleChange}
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="address.city" className="form-label">
            {t('booking.city')}
          </label>
          <input
            type="text"
            className="form-control"
            id="address.city"
            name="address.city"
            value={formData.customerAddress.city}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="address.state" className="form-label">
            {t('booking.state')}
          </label>
          <input
            type="text"
            className="form-control"
            id="address.state"
            name="address.state"
            value={formData.customerAddress.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="address.zipCode" className="form-label">
            {t('booking.zipCode')}
          </label>
          <input
            type="text"
            className="form-control"
            id="address.zipCode"
            name="address.zipCode"
            value={formData.customerAddress.zipCode}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="address.country" className="form-label">
            {t('booking.country')}
          </label>
          <input
            type="text"
            className="form-control"
            id="address.country"
            name="address.country"
            value={formData.customerAddress.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="notes" className="form-label">
          {t('booking.notes')}
        </label>
        <textarea
          className="form-control"
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          maxLength="500"
        ></textarea>
      </div>

      <div className="alert alert-info">
        <strong>{t('booking.totalAmount')}: ₹{service.price}</strong>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? t('booking.processing') : t('booking.confirmBooking')}
      </button>
    </form>
  );
};

export default BookingForm;
