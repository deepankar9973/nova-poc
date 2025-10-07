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

// Interface for a single chat message
interface ChatMessage {
  speaker: 'bot' | 'user';
  text: string;
}

export const useJourneyOrchestrator = () => {
  // All state declarations remain the same...
  const { userData, updateUserData } = useJourney();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [journeyPlan, setJourneyPlan] = useState<LLMJourneyResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isJourneyComplete, setIsJourneyComplete] = useState(false);
  const [screenDesign, setScreenDesign] = useState<ScreenDesignResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loanOffer, setLoanOffer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);

  const currentStep = journeyPlan?.journey_plan[currentStepIndex];

  // Initialize Journey (no changes needed)
  useEffect(() => {
    if (!selectedPersona) return;
    const initializeJourney = async () => {
      setIsLoading(true);
      setError(null);
      setJourneyPlan(null);
      setChatHistory([]);
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

  // --- THIS IS THE CORRECTED EFFECT HOOK ---
  useEffect(() => {
    if (!journeyPlan || !selectedPersona) return;
  
    const processCurrentStep = async () => {
      const stepToExecute = journeyPlan.journey_plan[currentStepIndex];
      
      if (!stepToExecute) {
        setIsJourneyComplete(true);
        return;
      }
  
      setIsLoading(true);
      setError(null);
      setScreenDesign(null);
      setLoanOffer(null);
  
      try {
        // --- FIX: HANDLE SPECIAL STEPS FIRST, REGARDLESS OF PERSONA ---
        // Priority 1: Handle the Offer Display step.
        if (stepToExecute.step_id === 'OFFER_DISPLAY') {
          console.log("Processing universal step: OFFER_DISPLAY");
          const offer = await llmClientService.calculateOffer(userData);
          setLoanOffer(offer);
          return; // Stop execution here, no screen design needed.
        }

        // Priority 2: Handle any other steps with no fields to collect by skipping them.
        if (!stepToExecute.required_fields || stepToExecute.required_fields.length === 0) {
          console.log(`Skipping step ${currentStepIndex + 1} ('${stepToExecute.step_id}') as it has no required fields.`);
          setCurrentStepIndex(prev => prev + 1);
          return; // Stop execution here.
        }
  
        // Priority 3: Now, handle data collection steps based on persona.
        if (selectedPersona.llm_strategy === 'clarity') {
          // Chat-based UI
          const response = await llmClientService.getScreenDesign({ persona: selectedPersona, step: stepToExecute, userData, currentStepIndex });
          const chatResponse = response.chat_response;
          if (chatResponse && chatResponse.field_id !== 'undefined') {
            setCurrentField(chatResponse.field_id);
            setChatHistory(prev => [...prev, { speaker: 'bot', text: chatResponse.bot_message }]);
          } else {
            throw new Error("Invalid or undefined chat response from server.");
          }
        } else {
          // Form-based UI
          const design = await llmClientService.getScreenDesign({ persona: selectedPersona, step: stepToExecute, userData, currentStepIndex });
          setScreenDesign(design);
          const initialData: Record<string, any> = {};
          design.components.forEach(comp => {
            if (comp.props.id) { initialData[comp.props.id] = userData[comp.props.id] || ''; }
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
  
  // All other handlers (handleChatSubmit, handleGenerateJourney, etc.) remain exactly the same.
  const handleChatSubmit = useCallback((message: string) => {
    if (!currentField) return;
    setChatHistory(prev => [...prev, { speaker: 'user', text: message }]);
    updateUserData({ [currentField]: message });
    setCurrentStepIndex(prev => prev + 1);
  }, [currentField, updateUserData]);

  const handleGenerateJourney = useCallback((persona: Persona) => {
    if (!persona || !persona.id || !persona.llm_strategy) { setError('Invalid persona data'); return; }
    setSelectedPersona(persona);
  }, []);
  
  const handleStepComplete = useCallback(() => {
    updateUserData(formData);
    setCurrentStepIndex(prev => prev + 1);
  }, [formData, updateUserData]);
  
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
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
    setChatHistory([]);
    setCurrentField(null);
  }, []);

  return {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, currentStep,
    loanOffer, selectedPersona, isJourneyComplete, formData, errors,
    chatHistory, handleChatSubmit,
    handleGenerateJourney, handleStepComplete, handleBack, handleRestart, handleFormChange,
  };
};