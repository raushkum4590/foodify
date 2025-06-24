'use client';
import { useState } from 'react';
import Header from "./_components/Header";
import CategoryList from "./_components/CategoryList";
import RestaurantList from "./_components/RestaurantList";

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Clerk authentication */}
      <Header 
        cartItems={cart}
        setCart={setCart}
        onSearchResults={handleSearchResults}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Delicious Food, Delivered Fast
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Order from the best restaurants in your area
          </p>
          
          <div className="mb-8">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Start Ordering
            </button>
            <p className="text-sm mt-3 opacity-80">
              Discover amazing food near you
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-full p-2 flex items-center">
              <input
                type="text"
                placeholder="Enter your address..."
                className="flex-grow px-4 py-2 text-gray-800 rounded-l-full outline-none"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                Find Food
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <CategoryList 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Restaurants */}
      <RestaurantList 
        searchResults={searchResults}
        selectedCategory={selectedCategory}
      />

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">Foodify</h3>
          <p className="text-gray-400">
            Your favorite food, delivered fast and fresh to your doorstep.
          </p>
          <div className="mt-8 text-gray-400">
            <p>&copy; 2025 Foodify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
