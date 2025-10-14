'use client';

import React from 'react';
import { ComponentRegistry, UIComponent } from '@/frontend/features/loan-journey/types'; 

// Import all required components from the design system
import { TextField } from '../../../../external/mv-pbds/base-ui/text-field/text-field';
import { Button } from '../../../../external/mv-pbds/base-ui/button/button';
import { Slider } from '../../../../external/mv-pbds/base-ui/slider/slider';
import { RadioButton } from '../../../../external/mv-pbds/base-ui/radio-button/radio-button';
import { Typography } from '../../../../external/mv-pbds/base-ui/typography/typography';

export const componentRegistry: ComponentRegistry = {
  // Map LLM names to the actual components
  Header: (props) => <Typography variant="h1" {...props}>{props.text}</Typography>, 
  BodyText: (props) => <Typography variant="body1" {...props}>{props.text}</Typography>,
  InputField: TextField,
  Slider: Slider,
  RadioButtonGroup: RadioButton, // Map to the RadioButton component
  CTAButton: Button,
};

interface DynamicComponentProps {
  component: UIComponent;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
  onComplete?: () => void;
}

export function DynamicComponent({ component, value, error, onChange, onComplete }: DynamicComponentProps) {
  const componentName = Object.keys(componentRegistry).find(
    (key) => key.toLowerCase() === component.component_type.toLowerCase()
  );

  if (!componentName) {
    return <div className="text-red-500">Component Not Found: {component.component_type}</div>;
  }

  const Component = componentRegistry[componentName];

  // --- THIS IS THE CORRECTED HANDLER ---
  const handleChange = (eventOrValue: any) => {
    // Correctly extract the value, using 'eventOrValue' consistently.
    const newValue = (eventOrValue && eventOrValue.target) ? eventOrValue.target.value : eventOrValue;
    if (component.props.id) {
        onChange(component.props.id, newValue);
    }
  };

  const combinedProps: any = { ...component.props };
  
  const isButton = component.component_type.toLowerCase().includes('button');

  if (isButton) {
    // For buttons, pass the text as a child and map onComplete to onClick
    combinedProps.onClick = onComplete;
    return <Component {...combinedProps}>{component.props.text}</Component>;
  } else {
    // For form elements, wire up the state
    combinedProps.value = value;
    combinedProps.error = error;
    combinedProps.onChange = handleChange;
  }
  
  return <Component {...combinedProps} />;
}