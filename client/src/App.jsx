import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetails from './pages/ServiceDetails';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <LanguageProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/contact" element={<Contact />} />

                {/* Customer Routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

              {/* Provider Routes */}
              <Route
                path="/provider/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route (All authenticated users) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'provider', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Wishlist Route (All authenticated users) */}
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'provider', 'admin']}>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </LanguageProvider>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
