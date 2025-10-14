'use client';

import React from 'react';
import { DynamicComponent } from '@/frontend/components/registry';
import { ProgressBar } from '@/frontend/components/ui/progress/ProgressBar';
import { ScreenDesignResponse, UserData, UIComponent } from '../types';

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
      <div className="w-full max-w-[560px] mx-auto">
        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
          stepName={screen_title}
        />
  
        {/* Header Section - Reduced size */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            {screen_title}
          </h1>
          {screenDesign.screen_subtitle && (
            <p className="text-sm text-gray-600">
              {screenDesign.screen_subtitle}
            </p>
          )}
        </div>
  
        {/* Dynamic Components with better spacing */}
        <div className="space-y-5">
          {components.map((component: UIComponent) => (
            <div key={component.props.id} className="mb-4">
              <DynamicComponent
                component={component}
                value={formData[component.props.id]}
                error={errors[component.props.id]}
                onChange={onFormChange}
              />
            </div>
          ))}
        </div>
  
        {/* Action Button */}
        <div className="mt-8 pb-6">
          {actions.primary && (
            <DynamicComponent
              component={{
                component_type: "CTAButton",
                position: "footer",
                props: { 
                  ...actions.primary,
                  className: "w-full h-12 bg-[#1B5E3F] hover:bg-[#2D7A5A] text-white text-base font-semibold rounded-xl transition-colors duration-200"
                }
              }}
              value={null}
              onChange={() => {}}
              onComplete={onComplete}
            />
          )}
        </div>
      </div>
    );
  }