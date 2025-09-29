// Import constants from config to derive types from them
import { AVAILABLE_COMPONENTS, LLM_ERRORS, INTERACTION_PATTERNS } from './config';

// Import frontend types
import {
  Persona,
  JourneyStep,
  LLMResponse,
  UIComponent,
  ValidationRules,
  UserData,
  ScreenDesignResponse,
  LLMRequest
} from '@/frontend/features/loan-journey/types';

// LLM Configuration
export interface LLMConfig {
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  retry: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
  };
  timeout: number;
}

// LLM Service Response
export interface OllamaResponse {
  response: string;
  context: number[];
  created_at: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_duration: number;
}

// --- UPDATED & NEW TYPES START HERE ---

// Available Components Type (This will automatically update if you change AVAILABLE_COMPONENTS in config.ts)
export type ComponentType = typeof AVAILABLE_COMPONENTS[number];

// --- NEW ---
// Type for our new interaction patterns
export type InteractionPatternType = keyof typeof INTERACTION_PATTERNS;

// --- UPDATED ---
// Updated Validation Configuration to match the new structure in config.ts
export interface ValidationConfig {
  requiredJourneyPlanFields: string[];
  requiredStepFields: string[];
  requiredRationaleFields: string[];
  requiredScreenDesignFields: string[];
  maxComponentsPerScreen: number;
  maxValidationRules: number;
  requiredUIPreferences: string[];
}

// --- NEW & UPDATED TYPES END HERE ---

// Error Types
export type LLMErrorType = keyof typeof LLM_ERRORS;

// Service Error
export interface LLMServiceError extends Error {
  type: LLMErrorType;
  details?: Record<string, any>;
}

// Re-export frontend types
export type {
  Persona,
  JourneyStep,
  LLMResponse,
  UIComponent,
  ValidationRules,
  UserData,
  ScreenDesignResponse,
  LLMRequest
};