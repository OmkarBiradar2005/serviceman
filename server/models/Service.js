import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider ID is required']
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Cleaning',
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Painting',
        'Gardening',
        'AC Repair',
        'Appliance Repair',
        'Beauty & Salon',
        'Pest Control',
        'Moving & Packing',
        'Photography',
        'Catering',
        'Tutoring',
        'IT Support',
        'Car Wash',
        'Pet Care',
        'Fitness',
        'Home Security',
        'Locksmith',
        'Roofing',
        'Flooring',
        'Auto Repair',
        'Wellness',
        'Other'
      ]
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    priceType: {
      type: String,
      enum: ['hourly', 'fixed'],
      default: 'fixed'
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [15, 'Minimum duration is 15 minutes']
    },
    images: [{
      type: String
    }],
    availability: {
      type: Boolean,
      default: true
    },
    location: {
      city: {
        type: String,
        required: true
      },
      state: String,
      country: String
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for searching
serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
