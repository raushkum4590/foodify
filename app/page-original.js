'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Header from "./_components/Header";
import CategoryList from "./_components/CategoryList";
import RestaurantList from "./_components/RestaurantList";
import FeaturesSection from "./_components/FeaturesSection";
import CustomSignIn from "./_components/CustomSignIn";

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setSelectedCategory(null); // Clear category filter when searching
  };

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSearchResults(null); // Clear search results when selecting category
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItems={cart} 
        setCart={setCart}
        onSearchResults={handleSearchResults}
        onSignInClick={() => setShowSignIn(true)}
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
          
          {/* Sign In Button - Show only when user is not authenticated */}
          {!user && (
            <div className="mb-8">
              <button
                onClick={() => router.push('/sign-in')}
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Sign In to Order
              </button>
              <p className="text-sm mt-3 opacity-80">
                Sign in to start ordering from your favorite restaurants
              </p>
            </div>
          )}
          
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Foodify</h3>
              <p className="text-gray-400">
                Your favorite food, delivered fast and fresh to your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/favorites" className="hover:text-white transition-colors">Favorites</a></li>
                <li><a href="/orders" className="hover:text-white transition-colors">My Orders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Foodify. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Sign In Modal - Temporarily Disabled */}
      {/* <CustomSignIn 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)} 
      /> */}
    </div>
  );
}
