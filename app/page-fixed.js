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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Crave-inducing Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated food particles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-25 animate-ping"></div>
        
        {/* Floating food icons */}
        <div className="absolute top-16 left-1/4 text-4xl opacity-10 animate-pulse">🍕</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-15 animate-bounce">🍔</div>
        <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-10 animate-pulse">🍜</div>
        <div className="absolute bottom-16 right-1/3 text-2xl opacity-15 animate-bounce">🌮</div>
        <div className="absolute top-1/2 left-1/4 text-2xl opacity-10 animate-pulse">🍝</div>
        <div className="absolute top-3/4 right-1/3 text-3xl opacity-15 animate-bounce">🍟</div>
      </div>

      {/* Header with Clerk authentication */}
      <div className="relative z-10">
        <Header 
          cartItems={cart}
          setCart={setCart}
          onSearchResults={handleSearchResults}
        />
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white py-20 overflow-hidden z-10">
        {/* Sizzling background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-300 rounded-full blur-3xl opacity-25 animate-pulse"></div>
          
          {/* Steam effects */}
          <div className="absolute top-10 right-20 w-4 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-15 right-24 w-3 h-16 bg-white opacity-15 rounded-full animate-pulse"></div>
          <div className="absolute top-12 right-28 w-2 h-12 bg-white opacity-10 rounded-full animate-pulse"></div>
        </div>
        
        {/* Appetizing food icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/4 text-5xl opacity-20 animate-bounce">🍕</div>
          <div className="absolute top-1/3 right-1/4 text-4xl opacity-15 animate-pulse">🍔</div>
          <div className="absolute bottom-1/4 left-1/3 text-4xl opacity-20 animate-bounce">🍜</div>
          <div className="absolute bottom-16 right-1/3 text-3xl opacity-15 animate-pulse">🌮</div>
          <div className="absolute top-1/4 right-1/2 text-3xl opacity-10 animate-bounce">🍝</div>
          <div className="absolute bottom-1/3 left-1/2 text-2xl opacity-15 animate-pulse">🍟</div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent leading-tight">
              Craving Something<br />Delicious? 🤤
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Satisfy your hunger with mouth-watering meals from the best restaurants, delivered hot and fresh to your door
            </p>
          </div>
          
          <div className="mb-12">
            <button className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
              🍽️ Order Now & Satisfy Your Cravings
            </button>
            <p className="text-sm mt-4 opacity-80">
              ⚡ Fast delivery • 🔥 Hot & Fresh • 💯 Satisfaction guaranteed
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <div className="flex items-center">
                <div className="flex-shrink-0 pl-4">
                  <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Where should we deliver your feast?"
                  className="flex-grow px-4 py-4 bg-transparent text-white placeholder-white/70 outline-none text-lg"
                />
                <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  🚀 Let's Eat!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-8 bg-gradient-to-b from-white to-gray-50 relative z-10">
        <CategoryList 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Restaurants */}
      <div className="py-12 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🍽️ Irresistible Restaurants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover restaurants that will make your mouth water and satisfy every craving
            </p>
          </div>
        </div>
        <RestaurantList 
          searchResults={searchResults}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Enhanced Footer with Better Visibility */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-20 relative z-10">
        {/* Background for better text contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-bold mb-4 text-orange-400">
                🍔 Foodify
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-lg">
                Your favorite food, delivered fast and fresh to your doorstep. 
                Experience the best flavors from top restaurants.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">f</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">ig</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">tw</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-orange-400">Quick Links</h4>
              <ul className="space-y-3 text-gray-200">
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">🏠 Home</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">🍽️ Restaurants</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">📱 Download App</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">📞 Contact Us</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-orange-400">Support</h4>
              <ul className="space-y-3 text-gray-200">
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">❓ Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">📋 Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">🔒 Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors text-lg">💬 Live Chat</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-200 mb-4 md:mb-0 text-lg font-medium">
                &copy; 2025 Foodify. All rights reserved. Made with ❤️ for food lovers
              </p>
              <div className="flex items-center space-x-6 text-lg text-gray-200">
                <span className="flex items-center">⚡ Fast Delivery</span>
                <span>•</span>
                <span className="flex items-center">🔒 Secure Payment</span>
                <span>•</span>
                <span className="flex items-center">📱 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
