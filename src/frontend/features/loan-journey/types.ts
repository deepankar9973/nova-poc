// src/frontend/features/loan-journey/types.ts

// Base Types
export type LLMStrategy = 'efficiency' | 'reassurance' | 'velocity' | 'exploration' | 'control' | 'clarity';
export type LayoutType = 'form' | 'wizard' | 'cards';
export type ValidationStrategy = 'immediate' | 'onSubmit';
export type HelperTextLevel = 'minimal' | 'detailed';
export type ComponentPosition = 'header' | 'main' | 'footer';
export type ScreenType = 'welcome' | 'form' | 'confirmation' | 'display' | 'interactive';

// Component Types
export type MVComponentType = 
  | 'SliderInput'
  | 'ChipGroup'
  | 'QuickConfirm'
  | 'DetailedInput'
  | 'RadioButtonGroup'
  | 'ButtonGroup'
  | 'CalculatorInput'
  | 'ComparisonSelect'
  | 'IconButtonGroup'
  | 'SecureInput'
  | 'DetailedSelect'
  | 'VerifiedConfirm'
  | 'SimpleInput'
  | 'FlexibleConfirm';

// Journey Steps
export enum JourneyStep {
  Welcome = "Welcome",
  NameAndContact = "NameAndContact",
  EmploymentDetails = "EmploymentDetails",
  IncomeVerification = "IncomeVerification",
  PANConfirm = "PANConfirm",
  EducationLevel = "EducationLevel",
  OfferDisplay = "OfferDisplay",
  AmountTenureSelect = "AmountTenureSelect",
  FinalConfirmation = "FinalConfirmation"
}

// Core Interfaces
export interface Persona {
  id: string;
  name: string;
  description: string;
  age: number;
  occupation: string;
  ux_goal: string;
  llm_strategy: LLMStrategy;
  key_ui_traits: string[];
}

export interface DynamicJourneyStep {
  step_id: string;
  screen_type: ScreenType;
  required_fields: string[];
  optional_fields: string[];
  ui_preferences: UIPreferences;
  next_step_condition: string;
}

export interface UIPreferences {
  layout: LayoutType;
  component_preferences: string[];
  validation_strategy: ValidationStrategy;
  helper_text_level: HelperTextLevel;
}

export interface UIComponent {
  component_type: MVComponentType;
  position: ComponentPosition;
  props: Record<string, any>;
  validations?: ValidationRules;
  accessibility?: AccessibilityConfig;
  conditional_display?: ConditionalDisplay;
}

// Response Types
export interface LLMJourneyResponse {
  journey_plan: DynamicJourneyStep[];
  rationale: {
    strategy_alignment: string;
    ux_considerations: string;
    accessibility_notes: string;
  };
}

export interface ScreenDesignResponse {
  screen_title: string;
  layout: {
    type: LayoutType;
    spacing: 'compact' | 'comfortable';
    alignment: 'left' | 'center';
  };
  components: UIComponent[];
  actions: {
    primary: ActionConfig;
    secondary?: ActionConfig;
  };
  analytics: AnalyticsConfig;
}

// Configuration Types
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  custom?: string;
}

export interface AccessibilityConfig {
  ariaLabel: string;
  keyboardShortcut?: string;
}

export interface ConditionalDisplay {
  dependsOn: string;
  condition: string;
}

export interface ActionConfig {
  text: string;
  action: string;
  validation: string[];
}

export interface AnalyticsConfig {
  screen_id: string;
  track_fields: string[];
  important_events: string[];
}

// State Types
export interface UserData {
  firstName?: string;
  lastName?: string;
  monthlySalary?: number;
  salaryMode?: 'online' | 'cash' | 'cheque';
  panNumber?: string;
  education?: string;
  [key: string]: any;
}

export interface JourneyState {
  currentPersona: Persona | null;
  currentStep: DynamicJourneyStep | null;
  journeyPlan: DynamicJourneyStep[];
  userData: UserData;
  isLoading: boolean;
  error: string | null;
}

export interface LLMRequest {
  persona: Persona;
  currentStep?: DynamicJourneyStep;
  userData?: UserData;
}

export interface ComponentRegistry {
  [key: string]: React.ComponentType<any>;
}

export type JourneyAction =
  | { type: 'SET_PERSONA'; payload: Persona }
  | { type: 'SET_JOURNEY_STEPS'; payload: DynamicJourneyStep[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'UPDATE_USER_DATA'; payload: Partial<UserData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_JOURNEY' };