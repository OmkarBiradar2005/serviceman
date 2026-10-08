import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useLanguage } from '../../context/LanguageContext';
import wishlistService from '../../services/wishlistService';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { language, changeLanguage, t, getCurrentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const fetchWishlistCount = async () => {
    try {
      const response = await wishlistService.getWishlist();
      setWishlistCount(response.data.length);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          HomeServeX
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                {t('nav.home')}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                {t('nav.contact')}
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/wishlist">
                    ❤ {t('nav.wishlist')}
                    {wishlistCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={getDashboardLink()}>
                    {t('nav.dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none"
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{ cursor: 'pointer' }}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    🌐 {getCurrentLanguage()}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                        onClick={() => changeLanguage('en')}
                      >
                        English
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${language === 'hi' ? 'active' : ''}`}
                        onClick={() => changeLanguage('hi')}
                      >
                        हिंदी (Hindi)
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${language === 'mr' ? 'active' : ''}`}
                        onClick={() => changeLanguage('mr')}
                      >
                        मराठी (Marathi)
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.name}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">
                          {t('nav.role')}: {user.role?.toUpperCase()}
                        </small>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        {t('nav.profile')}
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none"
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{ cursor: 'pointer' }}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    🌐 {getCurrentLanguage()}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                        onClick={() => changeLanguage('en')}
                      >
                        English
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${language === 'hi' ? 'active' : ''}`}
                        onClick={() => changeLanguage('hi')}
                      >
                        हिंदी (Hindi)
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${language === 'mr' ? 'active' : ''}`}
                        onClick={() => changeLanguage('mr')}
                      >
                        मराठी (Marathi)
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    {t('nav.login')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    {t('nav.register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
