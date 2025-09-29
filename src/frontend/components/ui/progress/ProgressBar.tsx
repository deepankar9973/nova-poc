import React from 'react'; // This import is essential for JSX

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export function ProgressBar({ currentStep, totalSteps, stepName }: ProgressBarProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{stepName}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-moneyview-blue h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}