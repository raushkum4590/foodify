"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, MapPin, Heart, Filter, Grid, List } from 'lucide-react';
import GlobalApi from '../../_Utils/GlobalApi';
import Header from '../../_components/Header';

const CategoryPage = ({ params }) => {
  const { lug: categorySlug } = params;
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchRestaurantsByCategory();
    loadCartFromStorage();
  }, [categorySlug]);

  const fetchRestaurantsByCategory = async () => {
    try {
      setLoading(true);
      const fetchedRestaurants = await GlobalApi.GetRestaurantsByCategory(categorySlug);
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants for this category');
    } finally {
      setLoading(false);
    }
  };
  const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error('Error parsing cart from storage:', error);
        setCart([]);
      }
    }
  };

  const navigateToRestaurant = (slug) => {
    router.push(`/restaurant/${slug}`);
  };

  const generateStarRating = (rating = 4.2) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return 4.5 - 4.2; // Mock sorting by rating
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItems={cart} setCart={setCart} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse mr-4"></div>
            <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItems={cart} setCart={setCart} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button 
                onClick={fetchRestaurantsByCategory}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart} setCart={setCart} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {categorySlug.replace('-', ' ')} Restaurants
              </h1>
              <p className="text-gray-600">
                {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Restaurants Grid/List */}
        {sortedRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any restaurants in this category.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Explore All Restaurants
              </button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {sortedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => navigateToRestaurant(restaurant.slug)}
              >
                {/* Restaurant Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
                  <img
                    src={restaurant.banner?.url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === 'list' ? 'w-full h-full rounded-l-2xl' : 'w-full h-full rounded-t-2xl'
                    }`}
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle favorite functionality
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>

                  {/* Restaurant Type Badge */}
                  {restaurant.restroType && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {restaurant.restroType}
                    </div>
                  )}
                </div>

                {/* Restaurant Details */}
                <div className={`p-6 flex-grow ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>
                    </div>

                    {/* Category */}
                    {restaurant.category && (
                      <p className="text-orange-600 font-medium text-sm mb-2">
                        {restaurant.category.name}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {generateStarRating(4.2)}
                      <span className="text-sm text-gray-600 ml-2">4.2 (120+ reviews)</span>
                    </div>

                    {/* Address and Working Hours */}
                    <div className="space-y-2">
                      {restaurant.address && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="line-clamp-1">{restaurant.address}</span>
                        </div>
                      )}
                      
                      {restaurant.workingHour && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{restaurant.workingHour}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {restaurant.about && viewMode === 'list' && (
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {restaurant.about}
                      </p>
                    )}
                  </div>

                  {/* Action Button for List View */}
                  {viewMode === 'list' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                        View Menu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
