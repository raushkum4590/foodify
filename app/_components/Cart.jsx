'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, Trash2 } from 'lucide-react';

const Cart = ({ cartItems, removeFromCart, updateQuantity, slug }) => {
  const [isAnimating, setIsAnimating] = useState('');

  // Calculate the total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else if (updateQuantity) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    setIsAnimating(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setIsAnimating('');
    }, 300);
  };

  // If the cart is empty, show an enhanced empty state
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-sm mb-4">Add some delicious items to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Cart Header */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
            Your Order
          </h3>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            {totalItems} item{totalItems > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-80 overflow-y-auto space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className={`bg-gray-50 rounded-lg p-3 transition-all duration-300 ${
              isAnimating === item.id ? 'opacity-0 transform translate-x-full' : 'opacity-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Item Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}

              {/* Item Details */}
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between mt-2">                  <span className="font-bold text-orange-600">
                    ₹{(item.price * item.quantity * 80).toFixed(2)}
                  </span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      
                      <span className="px-3 py-1 text-sm font-medium text-gray-800 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-gray-100 pt-4 mt-4">        {/* Subtotal */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{(totalPrice * 80).toFixed(2)}</span>
        </div>
        
        {/* Delivery Fee */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mb-4">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-lg font-bold text-orange-600">₹{(totalPrice * 80).toFixed(2)}</span>
        </div>        {/* Checkout Button */}
        <Link href={`/checkout/${slug || 'default'}`}>
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Proceed to Checkout • ₹{(totalPrice * 80).toFixed(2)}
          </button>
        </Link>

        {/* Continue Shopping */}
        <button 
          onClick={() => window.location.reload()}
          className="w-full mt-2 text-gray-600 hover:text-gray-800 font-medium py-2 text-sm transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;
