// src/frontend/features/loan-journey/useJourneyOrchestrator.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useJourney } from './JourneyContext';
import { llmClientService } from '@/frontend/services/llm';
import { 
  LLMJourneyResponse, 
  ScreenDesignResponse, 
  Persona, 
  DynamicJourneyStep,
  UserData 
} from './types';

export const useJourneyOrchestrator = () => {
  // Context and State
  const { userData, updateUserData } = useJourney();

  // Journey State
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [journeyPlan, setJourneyPlan] = useState<LLMJourneyResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isJourneyComplete, setIsJourneyComplete] = useState(false);
  
  // Screen State
  const [screenDesign, setScreenDesign] = useState<ScreenDesignResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loanOffer, setLoanOffer] = useState<any>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentStep = journeyPlan?.journey_plan[currentStepIndex];

  // Initialize Journey
  useEffect(() => {
    if (!selectedPersona) return;

    const initializeJourney = async () => {
      setIsLoading(true);
      setError(null);
      setJourneyPlan(null);
      setIsJourneyComplete(false);

      try {
        const plan = await llmClientService.getJourneyPlan(selectedPersona);
        setJourneyPlan(plan);
        setCurrentStepIndex(0);
      } catch (err: any) {
        setError(`Failed to create journey: ${err.message}`);
        setSelectedPersona(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeJourney();
  }, [selectedPersona]);

  // Process Current Step
  useEffect(() => {
    if (!journeyPlan || !selectedPersona) return;
  
    const processCurrentStep = async () => {
      const stepToExecute = journeyPlan.journey_plan[currentStepIndex];
      
      console.log('Current step data:', stepToExecute); // Debug log
  
      if (!stepToExecute) {
        setIsJourneyComplete(true);
        setIsLoading(false);
        return;
      }
  
      // Convert the step format if needed
      const normalizedStep: DynamicJourneyStep = {
        step_id: stepToExecute.step || stepToExecute.step_id || `STEP_${currentStepIndex + 1}`,
        screen_type: 'form',
        required_fields: stepToExecute.tasks || stepToExecute.required_fields || [],
        optional_fields: [],
        ui_preferences: {
          layout: 'form',
          component_preferences: [],
          validation_strategy: 'immediate',
          helper_text_level: 'minimal'
        }
      };
  
      console.log('Normalized step:', normalizedStep); // Debug log
  
      setIsLoading(true);
      setScreenDesign(null);
      setLoanOffer(null);
  
      try {
        if (normalizedStep.step_id === 'OFFER_DISPLAY') {
          const offer = await llmClientService.calculateOffer(userData);
          setLoanOffer(offer);
        } else {
          const design = await llmClientService.getScreenDesign({
            persona: selectedPersona,
            step: normalizedStep,
            userData,
            currentStepIndex
          });
          
          setScreenDesign(design);
          
          const initialData: Record<string, any> = {};
          design.components.forEach(comp => {
            if (comp.props.id) {
              initialData[comp.props.id] = userData[comp.props.id] || '';
            }
          });
          setFormData(initialData);
        }
      } catch (err: any) {
        console.error('Step processing error:', err);
        setError(`Failed to load step: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    processCurrentStep();
  }, [journeyPlan, currentStepIndex, selectedPersona, userData]);
  
  // Handlers
  const handleGenerateJourney = useCallback((persona: Persona) => {
    console.log('Generating journey for persona:', persona); // Debug log
    if (!persona || !persona.id || !persona.llm_strategy) {
      setError('Invalid persona data');
      return;
    }
    setSelectedPersona(persona);
  }, []);
  

  const handleStepComplete = useCallback(() => {
    updateUserData(formData);
    setCurrentStepIndex(prev => prev + 1);
  }, [formData, updateUserData]);
  
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);
  
  const handleFormChange = useCallback((id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setSelectedPersona(null);
    setJourneyPlan(null);
    setIsJourneyComplete(false);
    setFormData({});
    setErrors({});
    setCurrentStepIndex(0);
    setLoanOffer(null);
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    screenDesign,
    journeyPlan,
    currentStepIndex,
    currentStep,
    loanOffer,
    selectedPersona,
    isJourneyComplete,
    formData,
    errors,
    
    // Handlers
    handleGenerateJourney,
    handleStepComplete,
    handleBack,
    handleRestart,
    handleFormChange,
  };
};