'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs'; // Temporarily disabled
import { Heart, Star, MapPin, Clock, Trash2 } from 'lucide-react';
import GlobalApi from '../_Utils/GlobalApi';

const FavoritesList = () => {  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { user } = useUser(); // Temporarily disabled
  const user = null; // Temporary placeholder
  const router = useRouter();

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const userFavorites = await GlobalApi.GetUserFavorites(user.emailAddresses[0].emailAddress);
      setFavorites(userFavorites);
      setLoading(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites');
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      // You'll need to implement this API endpoint
      // await GlobalApi.RemoveFromFavorites(favoriteId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const navigateToRestaurant = (restaurantSlug) => {
    router.push(`/restaurant/${restaurantSlug}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to see your favorites</h2>
          <p className="text-gray-600 mb-6">Save your favorite restaurants for quick access</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Heart className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={loadFavorites} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
              <p className="text-gray-600">
                {favorites.length} favorite restaurant{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">
                Start exploring restaurants and add them to your favorites!
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Explore Restaurants
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Restaurant Card Content */}
                <div 
                  onClick={() => navigateToRestaurant(favorite.restaurantSlug)}
                  className="cursor-pointer"
                >
                  {/* Placeholder for restaurant image */}
                  <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-xl font-bold mb-2">{favorite.restaurantName}</h3>
                      <p className="text-orange-100">Click to view menu</p>
                    </div>
                  </div>

                  {/* Restaurant Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {favorite.restaurantName}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.0 (50+ reviews)</span>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Restaurant location</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Open now • 30-40 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove from Favorites */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Favorites</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
