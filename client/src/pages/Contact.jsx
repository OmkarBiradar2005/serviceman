import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import contactService from '../services/contactService';

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await contactService.submitContact(formData);
      setSuccess(true);
      setError('');
      
      // Reset form (but keep user info if authenticated)
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        message: '',
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">Contact Us</h1>
            <p className="lead text-muted">
              Have a question or need assistance? We're here to help!
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <h5 className="alert-heading">✅ Message Sent Successfully!</h5>
              <p className="mb-0">
                Thank you for contacting us. We have received your message and will get back to you as soon as possible.
              </p>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess(false)}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Contact Form */}
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
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
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    <>📧 Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="row mt-5">
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <span className="display-6">📍</span>
              </div>
              <h5>Address</h5>
              <p className="text-muted">
                Mumbai, Maharashtra<br />
                India
              </p>
            </div>

            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <span className="display-6">📧</span>
              </div>
              <h5>Email</h5>
              <p className="text-muted">
                biradaromkar2005@gmail.com
              </p>
            </div>

            <div className="col-md-4 text-center mb-4">
              <div className="mb-3">
                <span className="display-6">📞</span>
              </div>
              <h5>Phone</h5>
              <p className="text-muted">
                +91 98765 43210<br />
                +91 87654 32109
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
