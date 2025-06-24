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
      {/* Modern Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Geometric Pattern Overlay */}
      <div className="fixed inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="animate-pulse">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header with Clerk authentication */}
      <div className="relative z-10">
        <Header 
          cartItems={cart}
          setCart={setCart}
          onSearchResults={handleSearchResults}
        />
      </div>

      {/* Hero Section with Crave-Inducing Background */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white py-20 overflow-hidden z-10">
        {/* Floating Food Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/4 text-4xl opacity-20 animate-bounce" style={{animationDelay: '0s'}}>🍕</div>
          <div className="absolute top-1/3 right-1/4 text-3xl opacity-15 animate-bounce" style={{animationDelay: '1s'}}>🍔</div>
          <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-20 animate-bounce" style={{animationDelay: '2s'}}>🍜</div>
          <div className="absolute bottom-16 right-1/3 text-2xl opacity-15 animate-bounce" style={{animationDelay: '3s'}}>🌮</div>
          <div className="absolute top-1/2 left-1/6 text-2xl opacity-15 animate-bounce" style={{animationDelay: '0.5s'}}>🍰</div>
          <div className="absolute top-2/3 right-1/6 text-2xl opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}>🍟</div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent leading-tight">
              Craving Something<br />Delicious? 🤤
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Satisfy your hunger with mouth-watering meals from the best restaurants, delivered hot and fresh to your door
            </p>
          
          <div className="mb-12">            <button className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
              �️ Order Now & Satisfy Your Cravings
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
                </div>                <input
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
      </div>      {/* Categories */}
      <div className="py-8 bg-gradient-to-b from-white to-gray-50 relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <pattern id="categoryPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#f97316" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#categoryPattern)"/>
          </svg>
        </div>
        <div className="relative z-10">
          <CategoryList 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {/* Popular Restaurants Section */}
      <div className="py-12 bg-gray-50 relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-red-100 rounded-full blur-2xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 mb-8 relative z-10">
          <div className="text-center mb-8">            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🍽️ Irresistible Restaurants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover restaurants that will make your mouth water and satisfy every craving
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <RestaurantList 
            searchResults={searchResults}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>{/* Enhanced Footer with Better Visibility */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-20 relative z-10 overflow-hidden">
        {/* Modern Footer Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
          <div className="absolute top-20 left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                🍔 Foodify
              </h3>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-base">
                Your favorite food, delivered fast and fresh to your doorstep. Experience the best flavors from top restaurants in your city.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">🏠 Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">🍽️ Restaurants</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">📱 Download App</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">📞 Contact Us</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">❓ Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">📋 Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">🔒 Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">💬 Live Chat</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 mb-4 md:mb-0 text-sm font-medium">
                &copy; 2025 Foodify. All rights reserved. Made with ❤️ for food lovers
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>⚡ Fast Delivery</span>
                <span>•</span>
                <span>🔒 Secure Payment</span>
                <span>•</span>
                <span>📱 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
