'use client';
import React from 'react';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎉 Success!
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this page, the HTTP 431 error has been resolved.
        </p>
        <div className="space-y-3 text-sm text-gray-500">
          <p>✅ Next.js is working</p>
          <p>✅ No authentication conflicts</p>
          <p>✅ Clean environment variables</p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Next Steps:</strong> Once this loads, we can gradually re-enable features like Clerk authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
