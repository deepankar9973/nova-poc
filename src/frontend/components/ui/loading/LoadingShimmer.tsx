import React from 'react';

interface LoadingShimmerProps {
  userName: string;
}

export function LoadingShimmer({ userName }: LoadingShimmerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-pulse">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Please wait while we prepare your journey, {userName.split(',')[0]}...
        </h2>
        <p className="text-gray-500">Generating a personalized loan experience just for you.</p>
      </div>
      <div className="space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-1/4 ml-auto mt-8"></div>
      </div>
    </div>
  );
}