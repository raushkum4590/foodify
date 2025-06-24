"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart,
  Heart,
  Info,
  Phone,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalApi from '@/app/_Utils/GlobalApi';
import Header from '@/app/_components/Header';
import ReviewsSection from '@/app/_components/ReviewsSection';
import { useNotification } from '@/app/_context/NotificationContext';

const RestaurantPage = ({ params }) => {
  const { slug } = params;
  const { user } = useUser();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRestaurant();
    loadCartFromStorage();
  }, [slug]);

  useEffect(() => {
    if (restaurant?.menu?.length > 0) {
      setActiveCategory(restaurant.menu[0].category);
    }
  }, [restaurant]);

  const fetchRestaurant = async () => {
    try {
      const data = await GlobalApi.GetRestaurantDetails(slug);
      setRestaurant(data);
      initializeQuantities(data.menu);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const initializeQuantities = (menu) => {
    const initialQuantities = {};
    menu?.forEach(({ menuItem }) => {
      menuItem.forEach(({ id }) => {
        initialQuantities[id] = 1;
      });
    });
    setQuantities(initialQuantities);
  };

  const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const addToCart = (menuItem) => {
    const quantity = quantities[menuItem.id] || 1;
    const cartItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      image: menuItem.productImage?.url,
      description: menuItem.description || '',
      restaurantName: restaurant.name
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, cartItem];
      }
      
      saveCartToStorage(newCart);
      return newCart;
    });

    showSuccess(`Added ${menuItem.name} to cart!`);
    setQuantities(prev => ({ ...prev, [menuItem.id]: 1 }));
  };

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      if (!isFavorite) {
        await GlobalApi.AddToFavorites({
          email: user.emailAddresses[0].emailAddress,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name
        });
        setIsFavorite(true);
        showSuccess('Added to favorites!');
      } else {
        // Remove from favorites (implement API)
        setIsFavorite(false);
        showSuccess('Removed from favorites');
      }
    } catch (error) {
      showError('Failed to update favorites');
    }
  };

  const shareRestaurant = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} on Foodify!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItems={cart} setCart={setCart} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-2xl mb-6"></div>
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded mb-8 w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="h-32 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant not found</h2>
          <p className="text-gray-600 mb-6">The restaurant you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu?.map(item => item.category) || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart} setCart={setCart} />
      
      {/* Restaurant Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-96 relative overflow-hidden">
          <img
            src={restaurant.banner?.url || '/placeholder-restaurant.jpg'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
            </button>
            <button
              onClick={shareRestaurant}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.5 (200+ reviews)</span>
              </div>
              {restaurant.workingHour && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.workingHour}</span>
                </div>
              )}
              {restaurant.address && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Restaurant Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Restaurant Info</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {restaurant.restroType && (
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4" />
                      <span>{restaurant.restroType}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {restaurant.menu
                  ?.filter(menuSection => menuSection.category === activeCategory)
                  .map((menuSection) => (
                    <div key={menuSection.id} className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {menuSection.category}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuSection.menuItem.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                          >
                            {item.productImage && (
                              <img
                                src={item.productImage.url}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            
                            <div className="p-6">
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-orange-600">
                                  ${item.price}
                                </span>
                                
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center bg-gray-100 rounded-lg">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium">
                                      {quantities[item.id] || 1}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>

            {/* Restaurant Description */}
            {restaurant.about && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">About {restaurant.name}</h3>
                <p className="text-gray-600 leading-relaxed">{restaurant.about}</p>
              </div>
            )}

            {/* Reviews Section */}
            <ReviewsSection 
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
