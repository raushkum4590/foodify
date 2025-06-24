"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, CreditCard, Loader } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY);

const InlinePaymentForm = ({ amount, onSuccess, onError, orderData, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          metadata: orderData,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: orderData.customerName,
            email: orderData.email,
          },
        },
      });

      if (result.error) {
        onError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Payment Details</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Pay ${amount.toFixed(2)}
              </div>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <Lock className="w-3 h-3 inline mr-1" />
        Your payment information is secure and encrypted
      </div>
    </div>
  );
};

const InlineStripePayment = ({ amount, onSuccess, onError, orderData, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <InlinePaymentForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        orderData={orderData}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default InlineStripePayment;
