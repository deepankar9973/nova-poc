'use client';

// 1. Import `useState` to manage the selected plan
import React, { useState } from 'react';

interface OfferDisplayProps {
  offer: {
    isApproved: boolean;
    message?: string;
    maxLoanAmount?: number;
    interestRate?: number;
    emiPlans?: { tenure: number; emi: number }[];
  };
  onAccept: () => void;
}

export function OfferDisplay({ offer, onAccept }: OfferDisplayProps) {
  // 2. Add state to track the selected tenure. `null` means nothing is selected.
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);

  if (!offer.isApproved) {
    return (
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Offer Not Approved</h2>
        <p className="text-gray-600">{offer.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="text-center">
        <p className="text-lg text-gray-500">Congratulations!</p>
        <h1 className="text-3xl md:text-4xl font-bold text-mv-text-heading my-2">You're Approved!</h1>
        <p className="text-gray-600">You are eligible for a loan up to:</p>
        <p className="text-4xl md:text-5xl font-extrabold text-mv-text-heading my-4">
          ₹{offer.maxLoanAmount?.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-gray-500">at {offer.interestRate}% p.a.</p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center mb-4">Suggested EMI Plans</h3>
        <div className="space-y-4">
          {offer.emiPlans?.map(plan => {
            // 3. Check if the current plan in the loop is the selected one
            const isSelected = selectedTenure === plan.tenure;

            return (
              // 4. Make the plan cards clickable buttons
              <button 
                key={plan.tenure} 
                onClick={() => setSelectedTenure(plan.tenure)}
                className={`w-full flex justify-between items-center p-4 border rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-mv-green-light border-mv-green shadow-md' // Style for selected card
                    : 'border-gray-200 hover:border-gray-400'     // Style for unselected cards
                }`}
              >
                <div>
                  <p className="font-bold text-gray-800">{plan.tenure} Months</p>
                  <p className="text-sm text-gray-500">Tenure</p>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-right">₹{plan.emi.toLocaleString('en-IN')} / mo</p>
                  <p className="text-sm text-gray-500 text-right">EMI</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 5. Conditionally render the "Confirm" button ONLY if a plan is selected */}
      <div className="mt-8 h-14"> {/* h-14 is a placeholder to prevent the layout from shifting when the button appears */}
        {selectedTenure && (
          <button 
            onClick={onAccept} 
            className="w-full px-6 py-3 text-white font-bold bg-mv-green-dark rounded-lg hover:bg-opacity-90 animate-fadeIn"
          >
            Confirm and Proceed
          </button>
        )}
      </div>
    </div>
  );
}