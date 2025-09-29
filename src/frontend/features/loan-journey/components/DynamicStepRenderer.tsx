'use client';

import React from 'react';
import { DynamicComponent } from '@/frontend/components/registry';
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

// --- THIS IS THE FIX: The props were missing from the function signature ---
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
    <div className="w-full h-full flex flex-col">
      {/* 1. Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mv-text-heading">
          {screen_title}
        </h1>
        <p className="text-sm text-mv-text-label mt-1">
          Provide a few basic details to get started.
        </p>
      </div>

      {/* 2. Main content area for dynamic components */}
      <div className="flex-grow space-y-6">
        {components.map((component: UIComponent) => (
          <div key={component.props.id}>
            {component.props.sectionTitle && (
              <h2 className="text-base font-medium text-mv-text-body mb-3">{component.props.sectionTitle}</h2>
            )}
            <DynamicComponent
              component={component}
              value={formData[component.props.id]}
              error={errors[component.props.id]}
              onChange={onFormChange}
            />
          </div>
        ))}
      </div>

      {/* 3. Action button at the bottom */}
      <div className="mt-auto pt-8">
        {actions.primary && (
          <DynamicComponent
            component={{
              component_type: "CTAButton",
              position: "footer",
              props: { 
                text: actions.primary.text || 'Continue', 
                variant: 'primary', 
                fullWidth: true,
                className: "h-14 text-lg rounded-xl font-semibold bg-mv-green-dark hover:bg-opacity-90"
              }
            }}
            value={null}
            onChange={() => {}}
            onComplete={onComplete}
          />
        )}
        {/* You can add the back button here if needed */}
      </div>
    </div>
  );
}