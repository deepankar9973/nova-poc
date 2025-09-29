'use client';

import React, { useEffect, useState } from 'react';
import { useJourney } from './JourneyContext';
import { useLLM } from '@/frontend/hooks/useLLM';
import { ErrorScreen } from '@/frontend/components/ui';
import { DynamicStepRenderer } from './components/DynamicStepRenderer';
import { LLMJourneyResponse, ScreenDesignResponse, Persona, UserData } from './types';
import { UserSelector } from '../persona/components/UserSelector';
import { LoadingShimmer } from '@/frontend/components/ui/loading/LoadingShimmer';

export function JourneyOrchestrator() {
  const { userData, updateUserData } = useJourney();
  const { getJourneyPlan, getScreenDesign } = useLLM();

  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [journeyPlan, setJourneyPlan] = useState<LLMJourneyResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [screenDesign, setScreenDesign] = useState<ScreenDesignResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({}); // State for the current form
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch the main journey plan when a persona is selected
  useEffect(() => {
    if (selectedPersona && !journeyPlan) {
      const initializeJourney = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const plan = await getJourneyPlan(selectedPersona);
          setJourneyPlan(plan);
          setCurrentStepIndex(0);
        } catch (err) {
          setError('Failed to create your journey. Please try again.');
          setIsLoading(false); // Stop loading on error
        }
      };
      initializeJourney();
    }
  }, [selectedPersona, journeyPlan, getJourneyPlan]);

  // Effect to fetch the screen design for the current step
  useEffect(() => {
    if (journeyPlan && selectedPersona) {
      const currentStep = journeyPlan.journey_plan[currentStepIndex];
      const fetchScreenDesign = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const design = await getScreenDesign(selectedPersona, currentStep, userData);
          setScreenDesign(design);
          
          // Initialize form data for the new screen
          const initialFormData: Record<string, any> = {};
          design.components.forEach(comp => {
            if (comp.props.id) {
              initialFormData[comp.props.id] = userData[comp.props.id] || '';
            }
          });
          setFormData(initialFormData);
          setErrors({});

        } catch (err) {
          setError('Could not load the next step. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchScreenDesign();
    }
  }, [journeyPlan, currentStepIndex, selectedPersona, getScreenDesign, userData]);
  
  // --- THIS FUNCTION FIXES THE TYPING ISSUE ---
  const handleFormChange = (id: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleStepComplete = () => {
    // Here you would add validation logic
    updateUserData(formData); // Save the current screen's data to the global context
    const nextStepIndex = currentStepIndex + 1;
    if (journeyPlan && nextStepIndex < journeyPlan.journey_plan.length) {
        setCurrentStepIndex(nextStepIndex);
    } else {
        console.log("JOURNEY COMPLETE!", { ...userData, ...formData });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const handleGenerateJourney = (persona: Persona) => {
    setSelectedPersona(persona);
    setJourneyPlan(null); // This will trigger the useEffect to fetch a new plan
  };

  // --- RENDER LOGIC ---
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        <UserSelector onGenerate={handleGenerateJourney} isLoading={isLoading && !journeyPlan} />
      </div>
      
      <div className="w-full flex-grow flex items-center justify-center">
        {isLoading && (
          <LoadingShimmer userName={selectedPersona?.name || 'your'} />
        )}

        {!isLoading && error && (
          <ErrorScreen error={error} retry={() => handleGenerateJourney(selectedPersona!)} />
        )}
        
        {!isLoading && !error && screenDesign && journeyPlan && (
          <DynamicStepRenderer
            screenDesign={screenDesign}
            totalSteps={journeyPlan.journey_plan.length}
            currentStepIndex={currentStepIndex}
            formData={formData} // Pass the managed state
            errors={errors}       // Pass the managed errors
            onFormChange={handleFormChange} // Pass the handler
            onComplete={handleStepComplete}
            onBack={currentStepIndex > 0 ? handleBack : undefined}
          />
        )}

        {!isLoading && !error && !screenDesign && (
          <div className="text-center text-gray-500">
            <p className="text-lg">Please select a user profile and click "Generate Journey"</p>
            <p>to start your personalized loan application.</p>
          </div>
        )}
      </div>
    </div>
  );
}