'use client';

import { useState, useEffect, useCallback } from 'react';
import { useJourney } from './JourneyContext';
import { useLLM } from '@/frontend/hooks/useLLM';
import { LLMJourneyResponse, ScreenDesignResponse, Persona } from './types';

export const useJourneyOrchestrator = () => {
  // Global state from context (persists across the session)
  const { userData, updateUserData } = useJourney();
  
  // LLM API functions
  const { getJourneyPlan, getScreenDesign } = useLLM();

  // State for the overall journey
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [journeyPlan, setJourneyPlan] = useState<LLMJourneyResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isJourneyComplete, setIsJourneyComplete] = useState(false);
  
  // State for the CURRENT screen being displayed
  const [screenDesign, setScreenDesign] = useState<ScreenDesignResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for the final offer
  const [loanOffer, setLoanOffer] = useState<any>(null);

  // General UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentStep = journeyPlan?.journey_plan[currentStepIndex];

  // Effect 1: Fetch the entire journey plan when a persona is selected.
  useEffect(() => {
    // This runs ONLY when the selectedPersona changes.
    if (!selectedPersona) return;

    const initializeJourney = async () => {
      setIsLoading(true);
      setError(null);
      setJourneyPlan(null); // Clear old plan
      setIsJourneyComplete(false);

      try {
        const plan = await getJourneyPlan(selectedPersona);
        setJourneyPlan(plan);
        setCurrentStepIndex(0); // Reset to the first step
      } catch (err: any) {
        setError(`Failed to create your journey: ${err.message}`);
      } finally {
        // We set loading to false in the next effect, after the first screen is fetched
      }
    };

    initializeJourney();
  }, [selectedPersona, getJourneyPlan]); // Dependency: only the persona

  // Effect 2: Fetch the screen design for the current step.
  useEffect(() => {
    // This runs ONLY when the journey plan is set, or the step index changes.
    if (!journeyPlan || !selectedPersona) return;

    const processCurrentStep = async () => {
      const stepToExecute = journeyPlan.journey_plan[currentStepIndex];
      
      if (!stepToExecute) {
        setIsJourneyComplete(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setScreenDesign(null); // Clear previous screen design
      setLoanOffer(null);

      try {
        if (stepToExecute.step_id === 'OFFER_DISPLAY') {
          // It's time to calculate the offer
          const response = await fetch('/api/llm/journey', {
            method: 'POST',
            body: JSON.stringify({ type: 'calculate_offer', userData }),
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await response.json();
          if (!result.success) throw new Error(result.details);
          setLoanOffer(result.data);
        } else {
          // It's a regular step, so get the screen design from the LLM
          const design = await getScreenDesign(selectedPersona, stepToExecute, userData);
          setScreenDesign(design);
          // Initialize form data for the new screen
          const initialData: Record<string, any> = {};
          design.components.forEach(comp => {
            if (comp.props.id) initialData[comp.props.id] = userData[comp.props.id] || '';
          });
          setFormData(initialData);
        }
      } catch (err: any) {
        setError(`Could not load step: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    processCurrentStep();
  }, [journeyPlan, currentStepIndex, selectedPersona, getScreenDesign, userData]);

  const handleGenerateJourney = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleStepComplete = () => {
    updateUserData(formData);
    setCurrentStepIndex(prev => prev + 1);
  };
  
  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };
  
  const handleFormChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRestart = () => {
    setSelectedPersona(null);
    setJourneyPlan(null);
    setIsJourneyComplete(false);
  };

  return {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, loanOffer, selectedPersona, isJourneyComplete,
    handleGenerateJourney, handleStepComplete, handleBack, handleRestart, handleFormChange, formData, errors
  };
};