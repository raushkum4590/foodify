"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { 
  CreditCard, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Truck,
  Lock
} from 'lucide-react';
import Header from '@/app/_components/Header';
import GlobalApi from '@/app/_Utils/GlobalApi';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY);

console.log('Stripe publishable key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY ? 'Loaded' : 'Missing');

const CheckoutPage = ({ params }) => {
  // Force cache refresh - updated at 2025-06-23
  const { slug } = params;
  const { user } = useUser();
  const router = useRouter();
  
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    specialInstructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error('Error parsing cart from storage:', error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    if (user) {
      setDeliveryInfo(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.emailAddresses?.[0]?.emailAddress || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };  const placeOrder = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate cart items
    const invalidItems = cart.filter(item => !item.id || !item.name || !item.price || !item.quantity);
    if (invalidItems.length > 0) {
      console.error('Invalid cart items:', invalidItems);
      alert('There are invalid items in your cart. Please refresh the page and try again.');
      return;
    }

    // Validate delivery info
    const requiredFields = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Delivery Address',
      city: 'City',
      zipCode: 'ZIP Code'
    };
    
    const missingFields = Object.keys(requiredFields).filter(field => !deliveryInfo[field]?.trim());
    
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(field => requiredFields[field]);
      alert(`Please fill in all required fields: ${missingLabels.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(deliveryInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(deliveryInfo.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate ZIP code format (basic validation)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(deliveryInfo.zipCode)) {
      alert('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
      return;
    }    setLoading(true);
      try {
      const orderTotal = (totalPrice + 5) * 80 * 1.18; // Convert to INR with delivery fee and GST
      console.log('Order total (INR):', orderTotal);
      console.log('Payment method:', paymentMethod);
      console.log('Cart items:', cart);
      console.log('Delivery info:', deliveryInfo);
      
      if (paymentMethod === 'stripe') {
        // Process Stripe payment
        await processStripePayment(orderTotal);
      } else {
        // Process cash on delivery
        await processCashOrder(orderTotal);
      }} catch (error) {
      console.error('Error placing order:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('payment')) {
        errorMessage = 'Payment processing failed. Please try again or use a different payment method.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Please check all required fields and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };  const processStripePayment = async (orderTotal) => {
    try {
      console.log('Loading Stripe...');
      const stripe = await stripePromise;
      console.log('Stripe loaded:', !!stripe);
      
      if (!stripe) {
        throw new Error('Stripe failed to load. Please refresh the page and try again.');
      }

      const orderData = {
        email: user.emailAddresses[0].emailAddress,
        items: cart,
        restaurantName: slug || 'Restaurant',
        deliveryInfo,
        orderId: `ORDER_${Date.now()}`
      };

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          amount: orderTotal,
          currency: 'inr',
          orderData,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const session = await response.json();      if (response.ok) {
        console.log('Stripe session created successfully, now saving order to database...');
          // Save order to database before redirecting to Stripe
        try {
          const userEmail = user.emailAddresses[0].emailAddress;
          console.log('🔍 STRIPE ORDER - User email for order creation:', userEmail);
          
          const orderData = {
            email: userEmail,
            items: JSON.stringify(cart),
            total: orderTotal / 80, // Convert back from INR to base currency for storage
            restaurantName: slug || 'Restaurant',
            deliveryInfo: JSON.stringify(deliveryInfo),
            paymentMethod: 'stripe'
          };
          
          console.log('🔍 STRIPE ORDER - Full order data:', orderData);
          const savedOrder = await GlobalApi.CreateOrder(orderData);
          console.log('✅ Order saved successfully before Stripe redirect:', savedOrder);
        } catch (orderError) {
          console.error('Error saving order, but continuing to Stripe:', orderError);
          // Continue to Stripe even if order save fails
        }
        
        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe with session ID:', session.sessionId);
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        // This code should not execute if redirect is successful
        if (result.error) {
          console.error('Stripe redirect error:', result.error);
          throw new Error(result.error.message);
        }
      } else {
        console.error('Failed to create checkout session:', session);
        throw new Error(session.error || 'Failed to create payment session');
      }
    } catch (error) {
      throw error;
    }
  };  const processCashOrder = async (orderTotal) => {
    try {
      console.log('Processing cash order and saving to database...');
      
      const userEmail = user.emailAddresses[0].emailAddress;
      console.log('🔍 CASH ORDER - User email for order creation:', userEmail);
      
      // Create order data
      const orderData = {
        email: userEmail,
        items: JSON.stringify(cart),
        total: orderTotal / 80, // Convert back from INR to base currency for storage
        restaurantName: slug || 'Restaurant',
        deliveryInfo: JSON.stringify(deliveryInfo),
        paymentMethod: 'cash'
      };
      
      console.log('🔍 CASH ORDER - Full order data:', orderData);
      
      // Save order to database
      const savedOrder = await GlobalApi.CreateOrder(orderData);
      console.log('✅ Cash order saved successfully:', savedOrder);
      
      setOrderPlaced(true);
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error saving cash order:', error);
      // Still proceed with order confirmation even if save fails
      setOrderPlaced(true);
      setCart([]);
      localStorage.removeItem('cart');
    }
  };
  const removeFromCart = (id) => {
    setCart((prevItems) => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const updatedCart = currentItems.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCart((prevItems) => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const updatedCart = currentItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItems={[]} setCart={setCart} />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll start preparing your food right away.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated delivery: 30-45 minutes</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/orders')}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Track Your Order
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart} setCart={setCart} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Restaurant</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details & Delivery Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Truck className="w-6 h-6 mr-2 text-orange-600" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={deliveryInfo.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryInfo.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="12345 or 12345-6789"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full delivery address..."
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={deliveryInfo.specialInstructions}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-orange-600" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'stripe'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <span className="font-medium">Pay with Card</span>
                      <div className="flex items-center mt-1">
                        <Lock className="w-3 h-3 mr-1 text-green-600" />
                        <span className="text-xs text-gray-500">Secured by Stripe</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <div className="ml-auto">
                      <div className="flex space-x-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                        <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                      </div>
                    </div>
                  )}
                </label>

                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 mt-1">Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You'll be redirected to Stripe's secure payment page to complete your transaction.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-orange-600" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>                    <span className="font-medium text-gray-800">
                      ₹{(item.price * item.quantity * 80).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4">                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{(totalPrice * 80).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₹{(5 * 80).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium">₹{(totalPrice * 80 * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-orange-600">₹{((totalPrice + 5) * 80 * 1.18).toFixed(2)}</span>
                </div>
              </div>              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {paymentMethod === 'stripe' ? 'Processing Payment...' : 'Placing Order...'}
                  </div>
                ) : (                  <div className="flex items-center justify-center">
                    {paymentMethod === 'stripe' ? (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Pay ₹{((totalPrice + 5) * 80 * 1.18).toFixed(2)} with Stripe
                      </>
                    ) : (
                      `Place Order • ₹${((totalPrice + 5) * 80 * 1.18).toFixed(2)}`
                    )}
                  </div>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {paymentMethod === 'stripe' ? (
                  <>
                    <Lock className="w-3 h-3 inline mr-1" />
                    Secure payment powered by Stripe. Your payment information is encrypted and secure.
                  </>
                ) : (
                  'By placing your order, you agree to our Terms of Service and Privacy Policy.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
