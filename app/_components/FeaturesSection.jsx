'use client';
import React from 'react';
import { Star, Clock, Users, Award } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, highlight }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
      highlight ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-orange-100'
    }`}>
      <Icon className={`w-6 h-6 ${highlight ? 'text-white' : 'text-orange-600'}`} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatsCard = ({ number, label, icon: Icon }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
      <Icon className="w-8 h-8 text-orange-600" />
    </div>
    <div className="text-3xl font-bold text-white mb-1">{number}</div>
    <div className="text-orange-100 text-sm">{label}</div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Get your favorite food delivered in 30 minutes or less with our express delivery network.",
      highlight: true
    },
    {
      icon: Star,
      title: "Quality Food",
      description: "Partner with top-rated restaurants to ensure you get the best quality meals every time."
    },
    {
      icon: Users,
      title: "Easy Ordering",
      description: "Simple and intuitive interface makes ordering your favorite food a breeze."
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with exclusive deals and discounts for our valued customers."
    }
  ];

  const stats = [
    { number: "1000+", label: "Restaurants", icon: Award },
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "30min", label: "Average Delivery", icon: Clock },
    { number: "4.8★", label: "App Rating", icon: Star }
  ];

  return (
    <div className="py-16 bg-gray-50">
      {/* Features Grid */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Foodify?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to providing the best food delivery experience with quality, speed, and convenience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
