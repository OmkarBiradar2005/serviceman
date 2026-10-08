import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required']
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required']
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure one review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Index for queries
reviewSchema.index({ serviceId: 1, createdAt: -1 });
reviewSchema.index({ providerId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
