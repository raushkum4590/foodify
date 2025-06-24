'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../_components/Header";
import GlobalApi from "../_Utils/GlobalApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.GetCategory();
      setCategories(resp);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/category/${categorySlug}`);
  };

  const handleSearchResults = (results) => {
    // Handle search results if needed
    console.log('Search results:', results);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header 
          cartItems={cart}
          setCart={setCart}
          onSearchResults={handleSearchResults}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header 
          cartItems={cart}
          setCart={setCart}
          onSearchResults={handleSearchResults}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Categories</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={getCategories}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Header */}
      <div className="relative z-10">
        <Header 
          cartItems={cart}
          setCart={setCart}
          onSearchResults={handleSearchResults}
        />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white py-16 overflow-hidden z-10">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-bounce"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
            🍽️ Explore All Categories
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Discover your favorite cuisines and explore new flavors from around the world
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎯 Browse by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Find exactly what you're craving from our diverse selection of cuisines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 text-center">
                  {/* Category Icon */}
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon?.url ? (
                      <img
                        src={category.icon.url}
                        alt={category.name}
                        className="w-16 h-16 mx-auto object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {category.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {/* Hover Effect */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Categories Found</h3>
              <p className="text-gray-500">Categories will appear here once they're available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              🚀 Ready to Order?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse through our amazing selection of restaurants and satisfy your cravings today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🏠 Back to Home
              </button>
              <button 
                onClick={() => router.push('/restaurants')}
                className="bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🍽️ View All Restaurants
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative z-10">
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
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-orange-400">Quick Links</h4>
              <ul className="space-y-3 text-gray-200">
                <li><a href="/" className="hover:text-orange-400 transition-colors text-lg">🏠 Home</a></li>
                <li><a href="/categories" className="hover:text-orange-400 transition-colors text-lg">🍽️ Categories</a></li>
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
            <p className="text-gray-200 text-lg font-medium">
              &copy; 2025 Foodify. All rights reserved. Made with ❤️ for food lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
