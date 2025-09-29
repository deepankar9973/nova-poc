'use client';

import React from 'react';

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
  if (!offer.isApproved) {
    return (
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Offer Not Approved</h2>
        <p className="text-gray-600">{offer.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <p className="text-lg text-gray-500">Congratulations!</p>
        <h1 className="text-4xl font-bold text-moneyview-green my-2">You're Approved!</h1>
        <p className="text-gray-600">You are eligible for a loan up to:</p>
        <p className="text-5xl font-extrabold text-gray-800 my-4">
          ₹{offer.maxLoanAmount?.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-gray-500">at {offer.interestRate}% p.a.</p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center mb-4">Suggested EMI Plans</h3>
        <div className="space-y-4">
          {offer.emiPlans?.map(plan => (
            <div key={plan.tenure} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-bold text-gray-800">{plan.tenure} Months</p>
                <p className="text-sm text-gray-500">Tenure</p>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-right">₹{plan.emi.toLocaleString('en-IN')} / mo</p>
                <p className="text-sm text-gray-500 text-right">EMI</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={onAccept} className="w-full mt-8 px-6 py-3 text-white font-bold bg-moneyview-blue rounded-lg hover:bg-blue-700">
        Select Amount & Finalize
      </button>
    </div>
  );
}