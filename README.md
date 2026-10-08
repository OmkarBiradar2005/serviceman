# HomeServeX - Service Booking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for booking professional services, similar to UrbanClap.
np
## Features

### 🎯 Multi-Role System
- **Customer**: Browse, search, book services, submit reviews
- **Service Provider**: Create/manage services, handle bookings
- **Admin**: Manage users, services, bookings, and reviews

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Protected routes
- Secure password hashing with bcrypt

### 📋 Customer Features
- Browse and search services by category, location, price
- View service details and provider information
- Book services with date/time selection
- Track booking status (pending, accepted, in-progress, completed)
- Cancel bookings
- Submit ratings and reviews for completed services
- View booking history

### 🔧 Provider Features
- Create, update, and delete services
- Set pricing (fixed or hourly)
- Manage service availability
- View assigned bookings
- Accept/reject booking requests
- Update booking status
- Track service ratings and reviews

### 👨‍💼 Admin Features
- View platform statistics and analytics
- Manage all users (activate/deactivate accounts)
- Monitor all bookings
- Moderate reviews (approve/delete)
- View recent activities

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - UI framework
- **Context API** - State management

## Project Structure

```
serviceman/
├── server/                 # Backend
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── authMiddleware.js
│   ├── config/          # Configuration
│   │   ├── db.js
│   │   └── jwt.js
│   ├── app.js          # Express app
│   ├── server.js       # Server entry point
│   └── package.json
│
└── client/              # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/  # Shared components
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── service/ # Service components
    │   │   │   ├── ServiceCard.jsx
    │   │   │   └── ServiceList.jsx
    │   │   ├── booking/ # Booking components
    │   │   │   ├── BookingForm.jsx
    │   │   │   └── BookingStatus.jsx
    │   │   └── review/  # Review components
    │   │       └── ReviewForm.jsx
    │   ├── pages/       # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ServiceDetails.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── ProviderDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── NotFound.jsx
    │   ├── services/    # API services
    │   │   ├── authService.js
    │   │   ├── serviceService.js
    │   │   ├── bookingService.js
    │   │   ├── reviewService.js
    │   │   └── adminService.js
    │   ├── context/     # Context providers
    │   │   └── AuthContext.jsx
    │   ├── utils/       # Utilities
    │   │   └── axiosInstance.js
    │   ├── App.jsx      # Main app component
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/servicesphere
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Services
- `GET /api/services` - Get all services (Public)
- `GET /api/services/:id` - Get service by ID (Public)
- `POST /api/services` - Create service (Provider)
- `PUT /api/services/:id` - Update service (Provider)
- `DELETE /api/services/:id` - Delete service (Provider)
- `GET /api/services/provider/my-services` - Get provider's services (Provider)

### Bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings/customer/my-bookings` - Get customer bookings (Customer)
- `GET /api/bookings/provider/assigned` - Get provider bookings (Provider)
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Provider)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Customer)

### Reviews
- `POST /api/reviews` - Create review (Customer)
- `GET /api/reviews/service/:serviceId` - Get service reviews (Public)
- `GET /api/reviews/admin/all` - Get all reviews (Admin)
- `DELETE /api/reviews/:id` - Delete review (Admin)
- `PUT /api/reviews/:id/approve` - Toggle review approval (Admin)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/users/:id` - Get user by ID (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/stats` - Get dashboard statistics (Admin)

## Default User Credentials (After Seeding)

You can create test users through the registration page with these roles:
- Customer: Select "Customer" during registration
- Provider: Select "Service Provider" during registration
- Admin: Manually create in database with role "admin"

## Service Categories

- Cleaning
- Plumbing
- Electrical
- Carpentry
- Painting
- Gardening
- AC Repair
- Appliance Repair
- Beauty & Salon
- Pest Control
- Moving & Packing
- Photography
- Catering
- Other

## Booking Statuses

- **Pending**: Booking created, awaiting provider response
- **Accepted**: Provider accepted the booking
- **Rejected**: Provider rejected the booking
- **In Progress**: Service is being performed
- **Completed**: Service completed successfully
- **Cancelled**: Booking cancelled by customer

## Key Features Implementation

### Authentication Flow
1. User registers with role (customer/provider)
2. JWT token generated and stored in localStorage
3. Token sent with each API request via Axios interceptor
4. Protected routes verify token and role

### Booking Flow
1. Customer searches and selects a service
2. Fills booking form with date, time, and address
3. Booking created with "pending" status
4. Provider receives notification
5. Provider accepts/rejects booking
6. Provider updates status through workflow
7. Customer can cancel before completion
8. Customer submits review after completion

### Review System
1. Available only for completed bookings
2. One review per booking
3. Admin can moderate reviews
4. Service rating auto-calculated from approved reviews

## Development Notes

- ES6 modules used throughout
- Async/await for asynchronous operations
- Comprehensive error handling
- Input validation on both frontend and backend
- Responsive design with Bootstrap
- Clean code with comments

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Real-time notifications (Socket.io)
- Image upload for services
- Advanced search and filtering
- Service provider verification
- Chat between customer and provider
- Email notifications
- Analytics dashboard
- Mobile app (React Native)

## License

MIT License

## Author

Built with ❤️ using MERN Stack
