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

  // Initialize Journey
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

  // Process Current Step
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
        if (stepToExecute.step_id === 'OFFER_DISPLAY') {
          const offer = await llmClientService.calculateOffer(userData);
          setLoanOffer(offer);
          return;
        }
        if (!stepToExecute.required_fields || stepToExecute.required_fields.length === 0) {
          setCurrentStepIndex(prev => prev + 1);
          return;
        }
        if (selectedPersona.llm_strategy === 'clarity') {
          const response = await llmClientService.getScreenDesign({ persona: selectedPersona, step: stepToExecute, userData, currentStepIndex });
          const chatResponse = response.chat_response;
          if (chatResponse && chatResponse.field_id !== 'undefined') {
            setCurrentField(chatResponse.field_id);
            setChatHistory(prev => [...prev, { speaker: 'bot', text: chatResponse.bot_message }]);
          } else { throw new Error("Invalid chat response from server."); }
        } else {
          const design = await llmClientService.getScreenDesign({ persona: selectedPersona, step: stepToExecute, userData, currentStepIndex });
          setScreenDesign(design);
          const initialData: Record<string, any> = {};
          design.components.forEach(comp => {
            if (comp.props.id) { initialData[comp.props.id] = userData[comp.props.id] || ''; }
          });
          setFormData(initialData);
        }
      } catch (err: any) {
        setError(`Failed to load step: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    processCurrentStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyPlan, currentStepIndex, selectedPersona]);
  
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
  
  // This is the version of the function that we know works for input fields.
  const handleFormChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };
  
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