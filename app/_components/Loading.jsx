'use client';
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-orange-200 border-t-orange-600 ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingCard = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-md animate-pulse ${className}`}>
    <div className="w-full h-48 bg-gray-300 rounded-t-2xl"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
);

const LoadingGrid = ({ count = 8, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
    {[...Array(count)].map((_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
);

const LoadingPage = ({ title = 'Loading...', subtitle = 'Please wait while we fetch your data' }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  </div>
);

export { LoadingSpinner, LoadingCard, LoadingGrid, LoadingPage };
export default LoadingSpinner;
