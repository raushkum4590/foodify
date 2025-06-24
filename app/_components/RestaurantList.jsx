"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import GlobalApi from "../_Utils/GlobalApi";
import { Star, Clock, MapPin, Filter, Grid, List } from "lucide-react";

const RestaurantsList = ({ searchResults = null, selectedCategory = null }) => {  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'category'const [filterOpen, setFilterOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (searchResults) {
      setRestaurants(searchResults);
      setLoading(false);
    } else if (selectedCategory && selectedCategory !== null) {
      getRestaurantsByCategory(selectedCategory);
    } else {
      getRestaurantsList();
    }
  }, [searchResults, selectedCategory]);
  const getRestaurantsList = async () => {
    setLoading(true);
    try {
      const resp = await GlobalApi.GetRestaurants();
      console.log('All restaurants with their categories:');
      resp.forEach(restaurant => {
        console.log(`- ${restaurant.name}: category = ${restaurant.category?.name || 'No category'} (slug: ${restaurant.category?.slug || 'No slug'})`);
      });
      setRestaurants(resp);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to load restaurants. Please try again later.");
      setLoading(false);
    }
  };
  const getRestaurantsByCategory = async (categorySlug) => {
    setLoading(true);
    setError(null);
    console.log(`Fetching restaurants for category: "${categorySlug}"`);
    
    try {
      const resp = await GlobalApi.GetRestaurantsByCategory(categorySlug);
      console.log(`Received ${resp.length} restaurants for category "${categorySlug}":`, resp.map(r => r.name));
      setRestaurants(resp);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants by category:", error);
      setError(`Failed to load restaurants for category "${categorySlug}". Please try again later.`);
      setLoading(false);
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
      case 'category':
        return (a.category?.name || '').localeCompare(b.category?.name || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedCategory ? `${selectedCategory} Restaurants` : 
             searchResults ? 'Search Results' : 'Popular Restaurants'}
          </h2>
          <p className="text-gray-600">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
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
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or browse our categories.</p>
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
                  alt={restaurant.name}                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === 'list' ? 'w-full h-full rounded-l-2xl' : 'w-full h-full rounded-t-2xl'
                  }`}
                />

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
  );
};

export default RestaurantsList;
