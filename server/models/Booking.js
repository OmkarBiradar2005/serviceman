import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required']
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider ID is required']
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    bookingTime: {
      type: String,
      required: [true, 'Booking time is required']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    customerAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    cancellationReason: {
      type: String,
      maxlength: [500, 'Cancellation reason cannot be more than 500 characters']
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for filtering by status and dates
bookingSchema.index({ status: 1, bookingDate: 1 });
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
