'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, MapPin, Clock, ChevronDown } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cart from './Cart';
import GlobalApi from '../_Utils/GlobalApi';

const Header = ({ cartItems = [], setCart, onSearchResults, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { user } = useUser();
  const router = useRouter();
  const removeFromCart = (id) => {
    setCart((prevItems) => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.filter((item) => item.id !== id);
    });
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await GlobalApi.GetCategory();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Enhanced search functionality
  const handleSearch = async (term) => {
    if (term.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await GlobalApi.SearchRestaurants(term);
      setSearchResults(results);
      setShowSearchResults(true);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigateToRestaurant = (slug) => {
    router.push(`/restaurant/${slug}`);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setShowCategoryDropdown(false);
    if (onCategorySelect) {
      onCategorySelect(category.slug);
    }
  };

  const handleAllCategoriesSelect = () => {
    setSelectedCategory('All Categories');
    setShowCategoryDropdown(false);
    if (onCategorySelect) {
      onCategorySelect(null);
    }
  };

  // Function to handle Stripe checkout redirection
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      window.location.href = 'https://buy.stripe.com/test_3cs5krezGb0wgeYaEE';
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg border-b">
      <div className="flex flex-col lg:flex-row justify-between items-center p-4 md:px-8 lg:px-20">
        {/* Logo and Brand */}        <div className="flex items-center justify-between w-full lg:w-auto mb-4 lg:mb-0">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <h1 className="text-2xl font-bold text-orange-600">Foodify</h1>
              <p className="text-xs text-gray-500">Delicious food delivered</p>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>        {/* Search Bar with Category Dropdown */}
        <div className="relative w-full lg:w-96 mb-4 lg:mb-0">
          <div className="flex items-center border-2 border-orange-200 rounded-full bg-gray-50 focus-within:border-orange-400 transition-colors overflow-hidden">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors border-r border-orange-200"
              >
                <span className="truncate max-w-24">{selectedCategory}</span>
                <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />
              </button>
              
              {/* Category Dropdown Menu */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={handleAllCategoriesSelect}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors border-b border-gray-100"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors flex items-center"
                    >
                      {category.icon?.url && (
                        <img
                          src={category.icon.url}
                          alt={category.name}
                          className="w-4 h-4 mr-2 rounded"
                        />
                      )}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Input */}
            <div className="flex items-center flex-grow px-3">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                placeholder="Search restaurants, cuisines..." 
              />
              {isSearching && (
                <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin ml-2"></div>
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
              {searchResults.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigateToRestaurant(restaurant.slug)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <img
                    src={restaurant.banner?.url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">{restaurant.name}</h4>
                    <p className="text-sm text-gray-500">{restaurant.category?.name}</p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{restaurant.address || 'Location not specified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation and Actions */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 w-full lg:w-auto`}>          {/* Navigation Links */}
          <nav className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Categories
            </Link>            {user && (
              <>
                <Link href="/orders" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  My Orders
                </Link>
              </>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Popover>
              <PopoverTrigger>
                <div className="relative flex items-center space-x-2 cursor-pointer bg-orange-100 hover:bg-orange-200 px-3 py-2 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  <span className="bg-orange-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {cartItems.length || 0}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
              </PopoverContent>
            </Popover>            {/* User Authentication */}
            <div className="flex items-center">
              {user ? (
                <UserButton 
                  showName
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg border",
                    }
                  }}
                />              ) : (                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push('/sign-in')}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/sign-up')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-64 overflow-y-auto">
          {searchResults.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigateToRestaurant(restaurant.slug)}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <img
                src={restaurant.banner?.url || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-10 h-10 rounded-lg object-cover mr-3"
              />
              <div className="flex-grow">
                <h4 className="font-medium text-gray-800 text-sm">{restaurant.name}</h4>
                <p className="text-xs text-gray-500">{restaurant.category?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Dropdown (Desktop) */}
      <div className="hidden lg:block bg-white shadow-md rounded-lg mt-2">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Browse by Category</h3>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showCategoryDropdown ? <ChevronDown className="w-5 h-5 transform rotate-180" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showCategoryDropdown && (
          <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
            <button
              onClick={handleAllCategoriesSelect}
              className={`flex items-center w-full p-2 rounded-lg transition-colors
              ${selectedCategory === 'All Categories' ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`flex items-center w-full p-2 rounded-lg transition-colors
                ${selectedCategory === category.name ? 'bg-orange-100 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
