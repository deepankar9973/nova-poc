'use client';

import { useState, useCallback } from 'react';
import { llmClientService } from '../services/llm';
import { 
  Persona, 
  LLMJourneyResponse, 
  ScreenDesignResponse,
  DynamicJourneyStep,
  UserData
} from '../features/loan-journey/types';

// This interface defines the "contract" for our custom hook.
// It tells any component using this hook what functions and state it will receive.
interface UseLLMReturn {
  isLoading: boolean;
  error: string | null;
  getJourneyPlan: (persona: Persona) => Promise<LLMJourneyResponse | null>;
  getScreenDesign: (
    persona: Persona,
    step: DynamicJourneyStep,
    userData?: UserData
  ) => Promise<ScreenDesignResponse | null>;
}

export function useLLM(): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- GET JOURNEY PLAN FUNCTION ---
  const getJourneyPlan = useCallback(async (persona: Persona): Promise<LLMJourneyResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Calls our frontend service to make the API request
      const response = await llmClientService.getJourneyPlan(persona);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate a journey plan. The AI may be busy.';
      console.error("useLLM (getJourneyPlan) Error:", errorMessage);
      setError(errorMessage);
      return null; // Return null on error so the calling component can handle it
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // --- GET SCREEN DESIGN FUNCTION ---
  const getScreenDesign = useCallback(async (
    persona: Persona,
    step: DynamicJourneyStep,
    userData?: UserData
  ): Promise<ScreenDesignResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Calls our frontend service with all the necessary context
      const response = await llmClientService.getScreenDesign(persona, step, userData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load the screen design for the next step.';
      console.error("useLLM (getScreenDesign) Error:", errorMessage);
      setError(errorMessage);
      return null; // Return null on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Return all the state and functions that our UI components will need
  return {
    isLoading,
    error,
    getJourneyPlan,
    getScreenDesign,
  };
}