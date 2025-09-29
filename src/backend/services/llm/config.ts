import { LLMConfig } from './types';

// LLM Configuration
export const LLM_CONFIG: LLMConfig = {
    model: 'llama2:latest',
    baseUrl: 'http://localhost:11434/api',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 120000,
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000
    }
};

// Available UI Components
export const AVAILABLE_COMPONENTS = [
  'Header',
  'BodyText',
  'InputField',
  'Slider',
  'ChipGroup',
  'RadioButtonGroup',
  'CTAButton',
  'ProgressBar',
  'SecurityBadge'
] as const;

// --- NEW LOGIC STARTS HERE ---

// Core interaction patterns for the loan journey
export const INTERACTION_PATTERNS = {
  FORM_STREAMLINED: {
    name: 'Streamlined Form',
    description: "A fast, single-page form with minimal steps and combined fields. Best for efficient, digitally savvy users. Does not use a progress bar.",
    features: ["combined-fields", "instant-validation", "keyboard-shortcuts"]
  },
  FORM_GUIDED: {
    name: 'Guided Form',
    description: "A multi-step form with a progress bar, detailed helper text, and security indicators. Best for users who need reassurance and clear guidance.",
    features: ["progress-bar", "helper-text", "security-badges", "review-steps"]
  },
  FORM_EXPLORATORY: {
    name: 'Exploratory Form',
    description: "An interactive form featuring an EMI calculator and eligibility previews. Best for users who want to explore options before committing.",
    features: ["emi-calculator", "eligibility-preview", "save-progress"]
  },
  CHAT_CONVERSATIONAL: {
    name: 'Conversational Chat',
    description: "A friendly, chat-based interface that asks questions one by one. Best for users who prefer a guided, less formal experience or need accessibility support.",
    features: ["natural-language", "explanations", "confirmation-steps"]
  }
};

// Mapping personas to their ideal interaction pattern
export const PERSONA_PATTERNS = {
  efficiency: INTERACTION_PATTERNS.FORM_STREAMLINED,
  velocity: INTERACTION_PATTERNS.FORM_STREAMLINED,
  reassurance: INTERACTION_PATTERNS.FORM_GUIDED,
  control: INTERACTION_PATTERNS.FORM_GUIDED,
  exploration: INTERACTION_PATTERNS.FORM_EXPLORATORY,
  clarity: INTERACTION_PATTERNS.CHAT_CONVERSATIONAL
};

// --- NEW LOGIC ENDS HERE ---


// Error Messages
export const LLM_ERRORS = {
  CONNECTION: 'Failed to connect to LLM service',
  VALIDATION: 'Invalid response format from LLM',
  TIMEOUT: 'Request timed out',
  RETRY_FAILED: 'Failed after maximum retries',
  PARSE_ERROR: 'Failed to parse LLM response',
  INVALID_PROMPT: 'Invalid prompt structure'
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  requiredJourneyPlanFields: ['journey_plan', 'rationale'],
  requiredStepFields: [
    'step_id',
    'screen_type',
    'required_fields',
    'ui_preferences',
    'next_step_condition'
  ],
  requiredRationaleFields: [
    'strategy_alignment',
    'ux_considerations',
    'accessibility_notes'
  ],
  requiredScreenDesignFields: ['screen_title', 'components', 'actions'],
  maxComponentsPerScreen: 10,
  maxValidationRules: 5,
  requiredUIPreferences: [
    'layout',
    'component_preferences',
    'validation_strategy',
    'helper_text_level'
  ]
} as const;