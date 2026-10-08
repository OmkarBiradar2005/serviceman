import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-muted">No services found</h4>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="row">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default ServiceList;
