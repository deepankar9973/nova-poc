import { useState, useCallback } from 'react';
import { llmClientService } from '../services/llm';
import { 
  Persona, 
  JourneyStep, 
  LLMResponse, 
  ScreenDesignResponse 
} from '../features/loan-journey/types';

interface UseLLMReturn {
  isLoading: boolean;
  error: string | null;
  getJourneyPlan: (persona: Persona) => Promise<LLMResponse>;
  getScreenDesign: (
    persona: Persona,
    step: JourneyStep,
    userData?: Record<string, any>
  ) => Promise<ScreenDesignResponse>;
  clearError: () => void;
}

export function useLLM(): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getJourneyPlan = useCallback(async (persona: Persona) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await llmClientService.getJourneyPlan(persona);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get journey plan';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getScreenDesign = useCallback(async (
    persona: Persona,
    step: JourneyStep,
    userData?: Record<string, any>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await llmClientService.getScreenDesign(persona, step, userData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get screen design';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getJourneyPlan,
    getScreenDesign,
    clearError
  };
}