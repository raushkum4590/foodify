'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Clock, Package, CheckCircle, XCircle, Star, ArrowRight } from 'lucide-react';
import GlobalApi from '../_Utils/GlobalApi';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();  useEffect(() => {
    console.log('OrderHistory useEffect - user state:', user);
    console.log('User loading state:', user === undefined);
    console.log('User email:', user?.emailAddresses?.[0]?.emailAddress);
    
    if (user?.emailAddresses?.[0]?.emailAddress) {
      console.log('User authenticated, loading real orders');
      loadOrders();
    } else if (user === null) {
      // User is definitely not signed in
      console.log('User not signed in, showing empty state');
      setLoading(false);
    } else {
      // Still loading user authentication state
      console.log('User authentication still loading...');
    }
  }, [user]);  const loadOrders = async () => {
    try {
      const userEmail = user.emailAddresses[0].emailAddress;
      console.log('🔍 ORDER HISTORY - Loading orders for user email:', userEmail);
      setLoading(true);
      setError(null);
      
      const userOrders = await GlobalApi.GetUserOrders(userEmail);
      console.log('🔍 ORDER HISTORY - API response:', userOrders);
      console.log('🔍 ORDER HISTORY - Number of orders found:', userOrders?.length || 0);
      
      if (userOrders && userOrders.length > 0) {
        console.log('✅ Orders found, displaying them');
        userOrders.forEach((order, index) => {
          console.log(`📦 Order ${index + 1}:`, {
            email: order.email,
            total: order.total,
            restaurantName: order.restaurantName,
            createdAt: order.createdAt
          });
        });
      } else {
        console.log('❌ No orders found for this user');
      }
      
      setOrders(userOrders || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      
      if (error.message?.includes('not yet configured')) {
        setError('Order history feature is being set up. Please try again later.');
      } else {
        setError('Failed to load order history. Please check your connection and try again.');
      }
      
      setLoading(false);
    }
  };
  const getStatusIcon = (order) => {
    // Since we don't have status field, we'll show based on creation time
    const hoursAgo = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo > 24) {
      return <CheckCircle className="w-5 h-5 text-green-500" />; // Delivered
    } else if (hoursAgo > 1) {
      return <Package className="w-5 h-5 text-blue-500" />; // Out for delivery
    } else {
      return <Clock className="w-5 h-5 text-orange-500" />; // Preparing
    }
  };

  const getStatusColor = (order) => {
    // Since we don't have status field, we'll show based on creation time
    const hoursAgo = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo > 24) {
      return 'bg-green-100 text-green-800'; // Delivered
    } else if (hoursAgo > 1) {
      return 'bg-blue-100 text-blue-800'; // Out for delivery
    } else {
      return 'bg-orange-100 text-orange-800'; // Preparing
    }
  };

  const getStatusText = (order) => {
    // Since we don't have status field, we'll show based on creation time
    const hoursAgo = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo > 24) {
      return 'Delivered';
    } else if (hoursAgo > 1) {
      return 'Out for Delivery';
    } else {
      return 'Preparing';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const reorderItems = (order) => {
    // Parse the items string and add to cart
    try {
      const items = JSON.parse(order.items);
      // You would implement the logic to add these items back to cart
      console.log('Reordering items:', items);
      router.push('/');
    } catch (error) {
      console.error('Error parsing order items:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to see your orders</h2>
          <p className="text-gray-600 mb-6">Track your order history and reorder your favorites</p>
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
            <Package className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <div className="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-16 bg-gray-300 rounded"></div>
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
              onClick={loadOrders} 
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
            <Package className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-600">
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                When you place your first order, it will appear here
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Start Ordering
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">                        {getStatusIcon(order)}
                        <h3 className="text-xl font-bold text-gray-800">
                          {order.restaurantName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order)}`}>
                          {getStatusText(order)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Order #{order.id.slice(-8)} • {formatDate(order.createdAt)}
                      </p>
                    </div>                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{(order.total * 80).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {/* Parse and display items */}
                      {(() => {
                        try {
                          const items = JSON.parse(order.items);
                          return (
                            <div className="space-y-2">
                              {items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                                  </div>                                  <span className="font-medium">
                                    ₹{(item.price * item.quantity * 80).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        } catch (e) {
                          return (
                            <p className="text-gray-600 text-sm">
                              {order.items}
                            </p>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => reorderItems(order)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Reorder</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    {getStatusText(order).toLowerCase() === 'delivered' && (
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Rate Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
