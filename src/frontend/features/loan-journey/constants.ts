import { 
    JourneyStep, 
    ScreenType, 
    ValidationRules, 
    MVComponentType,
    LLMStrategy 
  } from './types';
  
  // Step Configuration
  interface StepConfig {
    id: string;
    type: ScreenType;
    components: any[]; // Will be filled by LLM
  }
  
  export const JOURNEY_STEPS = {
    WELCOME: 'Welcome',
    NAME_CONTACT: 'NameAndContact',
    EMPLOYMENT_DETAILS: 'EmploymentDetails',
    INCOME_VERIFICATION: 'IncomeVerification',
    PAN_CONFIRM: 'PANConfirm',
    EDUCATION_LEVEL: 'EducationLevel',
    REASSURANCE_COPY: 'ReassuranceCopy',
    OFFER_DISPLAY: 'OfferDisplay',
    AMOUNT_TENURE_SELECT: 'AmountTenureSelect',
    FINAL_CONFIRMATION: 'FinalConfirmation',
    EXPLAINER_MODULE: 'ExplainerModule'
  } as const;
  
  export type JourneyStepType = typeof JOURNEY_STEPS[keyof typeof JOURNEY_STEPS];
  
  export const DEFAULT_JOURNEY_STEPS: StepConfig[] = [
    {
      id: JOURNEY_STEPS.WELCOME,
      type: 'welcome',
      components: []
    },
    {
      id: JOURNEY_STEPS.NAME_CONTACT,
      type: 'form',
      components: []
    },
    {
      id: JOURNEY_STEPS.EMPLOYMENT_DETAILS,
      type: 'form',
      components: []
    },
    {
      id: JOURNEY_STEPS.INCOME_VERIFICATION,
      type: 'form',
      components: []
    },
    {
      id: JOURNEY_STEPS.PAN_CONFIRM,
      type: 'confirmation',
      components: []
    },
    {
      id: JOURNEY_STEPS.EDUCATION_LEVEL,
      type: 'form',
      components: []
    },
    {
      id: JOURNEY_STEPS.OFFER_DISPLAY,
      type: 'display',
      components: []
    },
    {
      id: JOURNEY_STEPS.AMOUNT_TENURE_SELECT,
      type: 'interactive',
      components: []
    },
    {
      id: JOURNEY_STEPS.FINAL_CONFIRMATION,
      type: 'confirmation',
      components: []
    }
  ];
  
  // Validation Configuration
  interface ValidationSchema {
    [key: string]: ValidationRules;
  }
  
  export const STEP_VALIDATIONS: Record<string, ValidationSchema> = {
    [JOURNEY_STEPS.NAME_CONTACT]: {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      phone: { required: true, pattern: /^[0-9]{10}$/ }
    },
    [JOURNEY_STEPS.INCOME_VERIFICATION]: {
      monthly_salary: { required: true, minValue: 25000 },
      salary_mode: { required: true }
    },
    [JOURNEY_STEPS.PAN_CONFIRM]: {
      pan_number: { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ }
    }
  };
  
  // Strategy Configuration
  interface StrategyComponents {
    input: MVComponentType;
    selection: MVComponentType;
    confirmation: MVComponentType;
  }
  
  export const STRATEGY_COMPONENT_MAPS: Record<LLMStrategy, StrategyComponents> = {
    efficiency: {
      input: 'SliderInput',
      selection: 'ChipGroup',
      confirmation: 'QuickConfirm'
    },
    reassurance: {
      input: 'DetailedInput',
      selection: 'RadioButtonGroup',
      confirmation: 'SecureConfirm'
    },
    velocity: {
      input: 'QuickInput',
      selection: 'ButtonGroup',
      confirmation: 'SingleClickConfirm'
    },
    exploration: {
      input: 'CalculatorInput',
      selection: 'ComparisonSelect',
      confirmation: 'FlexibleConfirm'
    },
    control: {
      input: 'SecureInput',
      selection: 'DetailedSelect',
      confirmation: 'VerifiedConfirm'
    },
    clarity: {
      input: 'SimpleInput',
      selection: 'IconButtonGroup',
      confirmation: 'QuickConfirm'
    }
  } as const;