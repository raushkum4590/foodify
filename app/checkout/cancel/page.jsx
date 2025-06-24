"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Header from '@/app/_components/Header';

const PaymentCancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={[]} setCart={() => {}} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. Your cart items are still saved and you can try again anytime.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Don't worry! Your cart items are still saved. You can complete your purchase whenever you're ready.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Try Payment Again</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
