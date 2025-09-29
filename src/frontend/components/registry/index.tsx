'use client';

import React from 'react';
import { ComponentRegistry, UIComponent } from '@/frontend/features/loan-journey/types'; 

// Import all required components from the design system.
// NOTE: You must verify these paths are correct by checking your `external` folder.
import { TextField } from '../../../../external/mv-pbds/base-ui/text-field/text-field';
import { Button } from '../../../../external/mv-pbds/base-ui/button/button';
import { Slider } from '../../../../external/mv-pbds/base-ui/slider/slider';
import { Chip } from '../../../../external/mv-pbds/base-ui/chip/chip';
import { RadioButton } from '../../../../external/mv-pbds/base-ui/radio-button/radio-button';
import { Typography } from '../../../../external/mv-pbds/base-ui/typography/typography';
import { Badge } from '../../../../external/mv-pbds/base-ui/badge/badge'; // For SecurityBadge

// Note: ProgressBar is not a standard component in the mv-pbds list. We will create a simple one for now.
// If it exists in mv-pbds, replace this with the correct import.
const SimpleProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

// This is the mapping from the LLM's component names to our actual React components.
export const componentRegistry: ComponentRegistry = {
  // LLM Name -> React Component
  Header: (props) => <Typography variant="h2" {...props} />, 
  BodyText: (props) => <Typography variant="body1" {...props} />,
  InputField: TextField,
  Slider: Slider,
  ChipGroup: Chip, 
  RadioButtonGroup: RadioButton,
  CTAButton: Button,
  // --- ADDED MISSING COMPONENTS ---
  ProgressBar: SimpleProgressBar, // Map to our simple progress bar
  SecurityBadge: Badge,          // Map SecurityBadge to the Badge component
};

// The core renderer component.
interface DynamicComponentProps {
  component: UIComponent;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
}

export function DynamicComponent({ component, value, error, onChange }: DynamicComponentProps) {
    const componentName = Object.keys(componentRegistry).find(
      (key) => key.toLowerCase() === component.component_type.toLowerCase()
    );
  
    if (!componentName) {
      console.warn(`Component "${component.component_type}" not found in registry.`);
      return <div className="p-2 bg-red-100 text-red-700 rounded">Component Not Found: {component.component_type}</div>;
    }
  
    const Component = componentRegistry[componentName];
  
    // --- THIS IS THE FIX ---
    // The `onChange` from the design system component is complex.
    // We need to check if it's a standard event object and extract the value.
    const handleChange = (eventOrValue: any) => {
      let newValue;
      if (eventOrValue && eventOrValue.target) {
        // This handles standard HTML input events (e.g., for TextField)
        newValue = eventOrValue.target.value;
      } else {
        // This handles components that return the value directly (e.g., Slider)
        newValue = eventOrValue;
      }
      onChange(component.props.id, newValue);
    };
  
    const combinedProps = {
      ...component.props,
      value: value,
      error: error,
      onChange: handleChange, // Use our new, smarter handler
    };
  
    return <Component {...combinedProps} />;
  }