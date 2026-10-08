import Service from '../models/Service.js';
import User from '../models/User.js';

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private (Provider only)
 */
export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      priceType,
      duration,
      images,
      location
    } = req.body;

    // Create service with provider ID from authenticated user
    const service = await Service.create({
      providerId: req.user.id,
      title,
      description,
      category,
      price,
      priceType,
      duration,
      images,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get all services with filters
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res) => {
  try {
    const {
      category,
      categories,
      city,
      minPrice,
      maxPrice,
      search,
      availableOnly,
      sort = '-createdAt',
      page = 1,
      limit = 100
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Handle single category or multiple categories
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
      if (categoryArray.length > 0) {
        query.category = { $in: categoryArray };
      }
    } else if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Availability filter
    if (availableOnly === 'true') {
      query.availability = true;
    }

    if (search) {
      // Search in title, description, and category
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    const services = await Service.find(query)
      .populate('providerId', 'name email phone profileImage')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'providerId',
      'name email phone profileImage address'
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private (Provider/Admin)
 */
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership (provider can only update their own services)
    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private (Provider/Admin)
 */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get provider's services
 * @route   GET /api/services/provider/my-services
 * @access  Private (Provider)
 */
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id }).sort(
      '-createdAt'
    );

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
