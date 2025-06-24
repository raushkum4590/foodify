'use client';
import { useState, useEffect } from 'react';
import GlobalApi from '../_Utils/GlobalApi';

export default function TestCategoryPage() {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [restaurantsData, categoriesData] = await Promise.all([
        GlobalApi.GetRestaurant(),
        GlobalApi.GetCategory()
      ]);
      setAllRestaurants(restaurantsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleCategoryTest = async (categorySlug) => {
    setLoading(true);
    setSelectedCategory(categorySlug);
    
    try {
      console.log(`Testing category filter for: ${categorySlug}`);
      const result = await GlobalApi.GetRestaurantByCategory(categorySlug);
      setFilteredRestaurants(result || []);
      console.log(`Found ${result?.length || 0} restaurants for category: ${categorySlug}`);
    } catch (error) {
      console.error('Error filtering restaurants:', error);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Category Filtering Test</h1>
        
        {/* Categories Test Buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Categories:</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryTest(category.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* All Restaurants */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Restaurants ({allRestaurants.length})</h2>
            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
              {allRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="border-b border-gray-200 py-2 last:border-b-0">
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="text-sm text-gray-600">
                    Categories: {restaurant.categories?.map(cat => cat.name).join(', ') || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtered Restaurants */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Filtered Results for "{selectedCategory}" 
              {loading ? ' (Loading...)' : ` (${filteredRestaurants.length})`}
            </h2>
            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="border-b border-gray-200 py-2 last:border-b-0">
                    <div className="font-medium text-orange-600">{restaurant.name}</div>
                    <div className="text-sm text-gray-600">
                      Categories: {restaurant.categories?.map(cat => cat.name).join(', ') || 'None'}
                    </div>
                  </div>
                ))
              ) : selectedCategory ? (
                <div className="text-center py-4 text-gray-500">
                  No restaurants found for "{selectedCategory}"
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Select a category to see filtered results
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {selectedCategory && (
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <div className="text-sm space-y-1">
              <div>Selected Category: <span className="font-mono">{selectedCategory}</span></div>
              <div>Total Restaurants: <span className="font-mono">{allRestaurants.length}</span></div>
              <div>Filtered Results: <span className="font-mono">{filteredRestaurants.length}</span></div>
              <div>Categories Available: <span className="font-mono">{categories.length}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
