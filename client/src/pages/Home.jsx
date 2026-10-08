import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceList from '../components/service/ServiceList';
import AdvancedFilters from '../components/service/AdvancedFilters';
import { useLanguage } from '../context/LanguageContext';
import serviceService from '../services/serviceService';

const Home = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    categories: [],
    minPrice: 0,
    maxPrice: 10000,
    sort: '-createdAt',
    availableOnly: false
  });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.city) {
        params.city = filters.city;
      }
      if (filters.categories && filters.categories.length > 0) {
        params.categories = filters.categories.join(',');
      }
      if (filters.minPrice > 0) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice < 10000) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters.sort) {
        params.sort = filters.sort;
      }
      if (filters.availableOnly) {
        params.availableOnly = 'true';
      }

      const response = await serviceService.getServices(params);
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      city: '',
      categories: [],
      minPrice: 0,
      maxPrice: 10000,
      sort: '-createdAt',
      availableOnly: false
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                {t('home.title')}
              </h1>
              <p className="lead mb-4">
                {t('home.subtitle')}
              </p>
              <Link to="/register" className="btn btn-light btn-lg">
                {t('home.getStarted')}
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <div className="display-1">🔧🏠💼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search and Filter Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <AdvancedFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">{t('home.availableServices')}</h2>
              <p className="text-muted mb-0">
                {loading ? t('service.loading') : `${services.length} ${services.length !== 1 ? t('home.servicesFound') : t('home.service')}`}
              </p>
            </div>
            {(filters.categories.length > 0 || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.availableOnly) && (
              <div className="text-end">
                <small className="text-muted d-block mb-1">{t('filters.activeFilters')}</small>
                <div className="d-flex flex-wrap gap-2 justify-content-end">
                  {filters.categories.length > 0 && (
                    <span className="badge bg-primary">
                      {filters.categories.length} {filters.categories.length === 1 ? t('filters.category') : t('filters.categories')}
                    </span>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                    <span className="badge bg-success">
                      ₹{filters.minPrice} - ₹{filters.maxPrice}
                    </span>
                  )}
                  {filters.availableOnly && (
                    <span className="badge bg-info">{t('filters.availableOnly')}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <ServiceList services={services} loading={loading} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">{t('home.whyChoose')}</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="display-4 mb-3">✓</div>
              <h4>{t('home.verifiedProviders')}</h4>
              <p className="text-muted">
                {t('home.verifiedDesc')}
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="display-4 mb-3">💰</div>
              <h4>{t('home.bestPrices')}</h4>
              <p className="text-muted">
                {t('home.bestPricesDesc')}
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="display-4 mb-3">⭐</div>
              <h4>{t('home.qualityService')}</h4>
              <p className="text-muted">
                {t('home.qualityServiceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
