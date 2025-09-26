// src/backend/services/llm/config.ts

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
  'CTAButton'
] as const;

// Error Messages
export const LLM_ERRORS = {
  CONNECTION: 'Failed to connect to LLM service',
  VALIDATION: 'Invalid response format from LLM',
  TIMEOUT: 'Request timed out',
  RETRY_FAILED: 'Failed after maximum retries',
  PARSE_ERROR: 'Failed to parse LLM response',
  INVALID_PROMPT: 'Invalid prompt structure'
} as const;

// Prompt Configuration
export const PROMPT_CONFIG = {
  maxLength: 4096,
  systemMessagePrefix: 'You are a world-class UX Architect at Moneyview',
  responseFormat: 'json'
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  // Journey Plan Validation
  requiredJourneyPlanFields: ['journey_plan', 'rationale'],
  requiredStepFields: [
    'step_id',
    'screen_type',
    'required_fields',
    'optional_fields',
    'ui_preferences',
    'next_step_condition'
  ],
  requiredRationaleFields: [
    'strategy_alignment',
    'ux_considerations',
    'accessibility_notes'
  ],
  
  // Screen Design Validation
  requiredScreenDesignFields: ['screen_title', 'components', 'actions'],
  maxComponentsPerScreen: 10,
  maxValidationRules: 5,
  
  // UI Preferences Validation
  requiredUIPreferences: [
    'layout',
    'component_preferences',
    'validation_strategy',
    'helper_text_level'
  ]
} as const;