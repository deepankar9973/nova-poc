import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export function ProgressBar({ currentStep, totalSteps, stepName }: ProgressBarProps) {
  // This calculation remains correct. e.g., (1 / 5) * 100 = 20%.
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-mv-text-label uppercase">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs font-semibold text-mv-text-label uppercase">{stepName}</span>
      </div>
      
      {/* This is the container for the bar itself */}
      {/* VISUAL TWEAK: Using a lighter gray for the background track */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        
        {/* This is the green "fill" part of the bar that grows */}
        <div
          // THE FIX: Use a brighter, more vibrant green to match the design.
          // VISUAL TWEAK: Make the bar height match the container (h-2).
          className="bg-mv-green-dark h-2 rounded-full transition-all duration-500"
          
          // This inline style is what makes the bar "move". It sets the width based on the calculated progress.
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}