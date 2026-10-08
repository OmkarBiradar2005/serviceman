import React, { useState } from 'react';
import reviewService from '../../services/reviewService';

const ReviewForm = ({ bookingId, serviceId, providerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reviewData = {
        bookingId,
        serviceId,
        providerId,
        rating: formData.rating,
        comment: formData.comment
      };

      const response = await reviewService.createReview(reviewData);

      if (response.success) {
        alert('Review submitted successfully!');
        setFormData({ rating: 5, comment: '' });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
      <h5 className="mb-3">Leave a Review</h5>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="rating" className="form-label">
          Rating *
        </label>
        <select
          className="form-select"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
          <option value="4">⭐⭐⭐⭐ Good</option>
          <option value="3">⭐⭐⭐ Average</option>
          <option value="2">⭐⭐ Poor</option>
          <option value="1">⭐ Very Poor</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="comment" className="form-label">
          Review Comment *
        </label>
        <textarea
          className="form-control"
          id="comment"
          name="comment"
          rows="4"
          value={formData.comment}
          onChange={handleChange}
          maxLength="500"
          placeholder="Share your experience with this service..."
          required
        ></textarea>
        <small className="text-muted">
          {formData.comment.length}/500 characters
        </small>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
