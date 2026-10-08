import React from 'react';

const BookingStatus = ({ status }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'accepted':
        return <span className="badge bg-info">Accepted</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'in-progress':
        return <span className="badge bg-primary">In Progress</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'cancelled':
        return <span className="badge bg-secondary">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return <>{getStatusBadge()}</>;
};

export default BookingStatus;
