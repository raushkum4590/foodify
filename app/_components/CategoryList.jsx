"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlobalApi from '../_Utils/GlobalApi';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryList = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await GlobalApi.GetCategory();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.slug);
    } else {
      router.push(`/category/${category.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="min-w-[120px] bg-white rounded-2xl p-4 shadow-md animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mx-auto w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchCategories}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Explore Categories
          </h2>
          <p className="text-gray-600">
            Discover your favorite cuisines and dishes
          </p>
        </div>

        {/* Categories Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Categories List */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Categories Option */}
            <div
              onClick={() => handleCategoryClick({ slug: null, name: 'All' })}
              className={`min-w-[120px] flex-shrink-0 cursor-pointer transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-orange-600 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-orange-50 text-gray-800 hover:scale-105'
              } rounded-2xl p-4 shadow-md hover:shadow-xl`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  selectedCategory === null 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>
                  <span className={`text-2xl font-bold ${
                    selectedCategory === null ? 'text-white' : 'text-white'
                  }`}>
                    All
                  </span>
                </div>
                <h3 className="font-semibold text-sm">All Categories</h3>
              </div>
            </div>

            {/* Individual Categories */}
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`min-w-[120px] flex-shrink-0 cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white hover:bg-orange-50 text-gray-800 hover:scale-105'
                } rounded-2xl p-4 shadow-md hover:shadow-xl`}
              >
                <div className="text-center">
                  {/* Category Icon */}
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center overflow-hidden ${
                    selectedCategory === category.slug 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-orange-100 to-orange-200'
                  }`}>
                    {category.icon ? (
                      <img
                        src={category.icon.url}
                        alt={category.name}
                        className={`w-10 h-10 object-contain ${
                          selectedCategory === category.slug ? 'filter brightness-0 invert' : ''
                        }`}
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedCategory === category.slug 
                          ? 'bg-white/20 text-white' 
                          : 'bg-orange-200 text-orange-600'
                      }`}>
                        <span className="text-xl font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {categories.length} categories • Thousands of restaurants
          </p>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;
