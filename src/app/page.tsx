'use client';

import { MainLayout } from '@/frontend/components/layouts/MainLayout';
import { UserSelector } from '@/frontend/features/persona/components/UserSelector';
import { useJourneyOrchestrator } from '@/frontend/features/loan-journey/useJourneyOrchestrator';
import { JourneyGenerationLoader } from '@/frontend/components/ui/loading/JourneyGenerationLoader'; 
import { ErrorScreen } from '@/frontend/components/ui';
import { OfferDisplay } from '@/frontend/features/loan-journey/components/steps/OfferDisplay';
import { DynamicStepRenderer } from '@/frontend/features/loan-journey/components/DynamicStepRenderer';
import { JourneyComplete } from '@/frontend/features/loan-journey/components/steps/JourneyComplete';
import { ChatStepRenderer } from '@/frontend/features/loan-journey/components/chat/ChatStepRenderer';
import Image from 'next/image';

// NOTE: The faulty import for 'AmountSelectionStep' has been removed.

export default function Home() {
  const {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, loanOffer, 
    selectedPersona, isJourneyComplete, handleGenerateJourney, handleStepComplete, 
    handleBack, handleRestart, handleFormChange, formData, errors,
    chatHistory,
    handleChatSubmit,
  } = useJourneyOrchestrator();

  const renderContent = () => {
    // Priority 1: Handle primary states (loading, error, completion)
    if (isLoading && selectedPersona) {
      return ( <div className="flex items-center justify-center h-full"><JourneyGenerationLoader personaName={selectedPersona.name} /></div> );
    }
    if (error) { 
      return ( <div className="flex items-center justify-center h-full"><ErrorScreen error={error} retry={() => handleGenerateJourney(selectedPersona!)} /></div> );
    }
    if (isJourneyComplete) { 
      return ( <div className="flex items-center justify-center h-full"><JourneyComplete onRestart={handleRestart} /></div> );
    }
    
    // Priority 2: Handle special journey steps
    if (loanOffer) { 
      // This is correct. The `handleStepComplete` function is now smart enough to handle all personas.
      return <OfferDisplay offer={loanOffer} onAccept={handleStepComplete} />;
    }
    
    // Priority 3: Handle the main journey renderers
    if (selectedPersona?.llm_strategy === 'clarity' && chatHistory.length > 0 && journeyPlan) {
      return (
        <ChatStepRenderer
          history={chatHistory}
          onSend={handleChatSubmit}
          isLoadingNextMessage={isLoading}
          totalSteps={journeyPlan.journey_plan.length}
          currentStepIndex={currentStepIndex}
        />
      );
    }
    if (screenDesign && journeyPlan) { 
      return (
        <DynamicStepRenderer
          screenDesign={screenDesign}
          totalSteps={journeyPlan.journey_plan.length}
          currentStepIndex={currentStepIndex}
          formData={formData}
          errors={errors}
          onFormChange={handleFormChange}
          onComplete={handleStepComplete}
          onBack={currentStepIndex > 0 ? handleBack : undefined}
        />
      );
    }

    // Priority 4: Default Welcome Screen
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm mx-auto">
          <div className="mb-4">
            <Image
              src="/hero.png"
              alt="Personalized Journey"
              width={264}
              height={180}
              className="mx-auto"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-mv-text-heading">
            Welcome to MoneyView GenUI
          </h2>
          <p className="text-mv-text-body text-base leading-relaxed">
            Please select a user profile from the dropdown above to begin a personalized loan journey.
          </p>
        </div>
      </div>
    );
  };

  return (
    <MainLayout
      headerContent={ <UserSelector onGenerate={handleGenerateJourney} isLoading={isLoading} /> }
    >
      <div className="p-4 md:p-6 h-full">
        {renderContent()}
      </div>
    </MainLayout>
  );
  };