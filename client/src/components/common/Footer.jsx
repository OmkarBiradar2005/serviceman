import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-4 mb-3 px-4">
            <h5>HomeServeX</h5>
            <p className="text-white">
              Your one-stop platform for booking professional services across Maharashtra.
            </p>
          </div>
          <div className="col-md-4 mb-3 px-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-white text-decoration-none">
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white text-decoration-none">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3 px-4">
            <h5>Contact</h5>
            <p className="text-white">
              📧 biradaromkar2005@gmail.com
              <br />
              📞 +91 8237949766
              <br />
              📍 Pune, Maharashtra, India
            </p>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {currentYear} HomeServeX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
