'use client';

import { useEffect } from 'react';
import { useJourney } from '../JourneyContext';
import { useLLM } from '@/frontend/hooks/useLLM';
import { DynamicComponent } from '@/frontend/components/registry';
import { ScreenDesignResponse } from '../types';

export function ScreenRenderer() {
  const { currentPersona, currentStep, userData, updateUserData, nextStep } = useJourney();
  const { isLoading, error, getScreenDesign } = useLLM();

  const [screenDesign, setScreenDesign] = useState<ScreenDesignResponse | null>(null);

  useEffect(() => {
    if (currentPersona && currentStep) {
      loadScreenDesign();
    }
  }, [currentPersona, currentStep]);

  const loadScreenDesign = async () => {
    try {
      const design = await getScreenDesign(currentPersona!, currentStep, userData);
      setScreenDesign(design);
    } catch (error) {
      console.error('Failed to load screen design:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (screenDesign?.action.endpoint) {
      // Handle form submission
      nextStep();
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} retry={loadScreenDesign} />;
  }

  if (!screenDesign) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{screenDesign.screen_title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {screenDesign.components.map((component, index) => (
          <DynamicComponent
            key={index}
            component_type={component.component_type}
            props={{
              ...component.props,
              onChange: (value: any) => {
                if (component.props.id) {
                  updateUserData({ [component.props.id]: value });
                }
              }
            }}
          />
        ))}
        
        <CTAButton
          text={screenDesign.action.cta_text}
          type="submit"
          variant="primary"
          fullWidth
        />
      </form>
    </div>
  );
}