import { ComponentRegistry } from '@/frontend/features/loan-journey/types';

// Import MoneyView components
import { 
  Header,
  BodyText,
  InputField,
  Slider,
  ChipGroup,
  RadioButtonGroup,
  CTAButton
} from '@/external/mv-pbds/base-ui';

// Define component types
export type ComponentType = 
  | 'Header'
  | 'BodyText'
  | 'InputField'
  | 'Slider'
  | 'ChipGroup'
  | 'RadioButtonGroup'
  | 'CTAButton';

// Define props for each component
interface ComponentProps {
  Header: {
    text: string;
    size?: 'h1' | 'h2' | 'h3' | 'h4';
  };
  BodyText: {
    text: string;
    align?: 'left' | 'center' | 'right';
  };
  InputField: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'tel';
    placeholder?: string;
    helperText?: string;
    error?: string;
    onChange: (value: string) => void;
  };
  Slider: {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue?: number;
    onChange: (value: number) => void;
  };
  ChipGroup: {
    id: string;
    label: string;
    options: string[];
    onChange: (value: string) => void;
  };
  RadioButtonGroup: {
    id: string;
    label: string;
    options: string[];
    onChange: (value: string) => void;
  };
  CTAButton: {
    text: string;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    onClick?: () => void;
  };
}

// Enhanced component registry with type safety
export const componentRegistry: ComponentRegistry = {
  Header,
  BodyText,
  InputField,
  Slider,
  ChipGroup,
  RadioButtonGroup,
  CTAButton
};

// Type-safe dynamic component renderer
export function DynamicComponent<T extends ComponentType>({ 
  component_type, 
  props 
}: { 
  component_type: T; 
  props: ComponentProps[T]; 
}) {
  const Component = componentRegistry[component_type];
  
  if (!Component) {
    console.warn(`Component ${component_type} not found in registry`);
    return null;
  }

  return <Component {...props} />;
}

// Helper function to validate component props
export function validateComponentProps(
  component_type: ComponentType,
  props: any
): boolean {
  const requiredProps: Record<ComponentType, string[]> = {
    Header: ['text'],
    BodyText: ['text'],
    InputField: ['id', 'label', 'type'],
    Slider: ['id', 'label', 'min', 'max', 'step'],
    ChipGroup: ['id', 'label', 'options'],
    RadioButtonGroup: ['id', 'label', 'options'],
    CTAButton: ['text']
  };

  const required = requiredProps[component_type];
  return required.every(prop => prop in props);
}

// Helper function to get default props
export function getDefaultProps(component_type: ComponentType): Partial<ComponentProps[ComponentType]> {
  const defaults: Record<ComponentType, Partial<ComponentProps[ComponentType]>> = {
    Header: { size: 'h2' },
    BodyText: { align: 'left' },
    InputField: { type: 'text' },
    Slider: { step: 1 },
    ChipGroup: {},
    RadioButtonGroup: {},
    CTAButton: { variant: 'primary', fullWidth: false }
  };

  return defaults[component_type];
}

// Example usage:
/*
<DynamicComponent
  component_type="InputField"
  props={{
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
    onChange: (value) => console.log(value)
  }}
/>
*/