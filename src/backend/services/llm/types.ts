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
  
  // Available Components Type
  export type ComponentType = typeof AVAILABLE_COMPONENTS[number];
  
  // Validation Configuration
  export interface ValidationConfig {
    requiredJourneyPlanFields: string[];
    requiredScreenDesignFields: string[];
    maxComponentsPerScreen: number;
    maxValidationRules: number;
  }
  
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