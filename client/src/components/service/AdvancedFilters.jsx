import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const AdvancedFilters = ({ filters, onFilterChange, onReset }) => {
  const { t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 10000
  });

  const categories = [
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
  ];

  const sortOptions = [
    { value: '-createdAt', label: t('filters.latest') },
    { value: 'createdAt', label: t('filters.oldest') },
    { value: 'price', label: t('filters.priceLowHigh') },
    { value: '-price', label: t('filters.priceHighLow') },
    { value: '-rating', label: t('filters.ratingHighLow') },
    { value: '-totalReviews', label: t('filters.mostPopular') }
  ];

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...priceRange, [name]: Number(value) };
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onFilterChange({
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const handleCategoryToggle = (category) => {
    const currentCategories = filters.categories || [];
    let newCategories;
    
    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    
    onFilterChange({ categories: newCategories });
  };

  const handleReset = () => {
    setPriceRange({ min: 0, max: 10000 });
    onReset();
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        {/* Basic Search */}
        <div className="row g-3 mb-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder={`🔍 ${t('filters.search')}`}
              name="search"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder={`📍 ${t('filters.city')}`}
              name="city"
              value={filters.city || ''}
              onChange={(e) => onFilterChange({ city: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.sort || '-createdAt'}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
            >
              <option value="">{t('filters.sortBy')}</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={() => setShowAdvanced(!showAdvanced)}
              title={t('filters.advancedFilters')}
            >
              🔽
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-top pt-3">
            <h6 className="mb-3">{t('filters.advancedFilters')}</h6>
            
            {/* Price Range Slider */}
            <div className="mb-4">
              <label className="form-label fw-bold">{t('filters.priceRange')}</label>
              <div className="row g-2 align-items-center">
                <div className="col-5">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder={t('filters.min')}
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    min="0"
                  />
                </div>
                <div className="col-2 text-center">{t('filters.to')}</div>
                <div className="col-5">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder={t('filters.max')}
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="10000"
                  step="100"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                />
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="10000"
                  step="100"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                />
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-muted">₹{priceRange.min}</small>
                <small className="text-muted">₹{priceRange.max}</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary mt-2"
                onClick={applyPriceFilter}
              >
                {t('filters.applyPriceFilter')}
              </button>
            </div>

            {/* Multiple Category Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold">{t('filters.categories')}</label>
              <div className="row g-2">
                {categories.map(category => (
                  <div key={category} className="col-6 col-md-4 col-lg-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category}`}
                        checked={(filters.categories || []).includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${category}`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        {category}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-3">
              <label className="form-label fw-bold">{t('filters.availability')}</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availableOnly"
                  checked={filters.availableOnly || false}
                  onChange={(e) => onFilterChange({ availableOnly: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="availableOnly">
                  {t('filters.showAvailableOnly')}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
              >
                {t('filters.resetAllFilters')}
              </button>
              <span className="text-muted small align-self-center">
                {filters.categories?.length > 0 && `${filters.categories.length} ${t('filters.categoriesSelected')}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;
