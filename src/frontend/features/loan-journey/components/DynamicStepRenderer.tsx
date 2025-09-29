'use client';

import React from 'react';
import { DynamicComponent } from '@/frontend/components/registry';
import { ScreenDesignResponse, UserData, UIComponent } from '../types';
// Using the definitive, direct import path
import { ProgressBar } from '@/frontend/components/ui/progress/ProgressBar';

interface DynamicStepRendererProps {
  screenDesign: ScreenDesignResponse;
  totalSteps: number;
  currentStepIndex: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFormChange: (id: string, value: any) => void;
  onComplete: () => void;
  onBack?: () => void;
}

export function DynamicStepRenderer({
  screenDesign,
  totalSteps,
  currentStepIndex,
  formData,
  errors,
  onFormChange,
  onComplete,
  onBack,
}: DynamicStepRendererProps) {

  const { screen_title, components, actions } = screenDesign;

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        stepName={screen_title}
      />

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{screen_title}</h1>

      <div className="space-y-6">
        {components.map((component: UIComponent) => (
          <DynamicComponent
            key={component.props.id || Math.random()} // Added fallback key
            component={component}
            value={formData[component.props.id]}
            error={errors[component.props.id]}
            onChange={onFormChange}
          />
        ))}
      </div>

      <div className={`flex mt-8 ${onBack ? 'justify-between' : 'justify-end'}`}>
        {onBack && actions.secondary && (
          <button onClick={onBack} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 font-semibold">
            {actions.secondary.text || 'Back'}
          </button>
        )}
        {actions.primary && (
          <button onClick={onComplete} className="px-6 py-2 text-white bg-moneyview-blue rounded-md hover:bg-blue-700 font-semibold">
            {actions.primary.text || 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}