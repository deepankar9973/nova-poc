'use client';

import React from 'react';

interface JourneyCompleteProps {
  onRestart: () => void;
}

export function JourneyComplete({ onRestart }: JourneyCompleteProps) {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-mv-green-dark mb-4">Application Submitted!</h1>
      <p className="text-gray-600 mb-8">Thank you for choosing MoneyView. Your loan application journey is complete.</p>
      <button onClick={onRestart} className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold">
        Start a New Journey
      </button>
    </div>
  );
}