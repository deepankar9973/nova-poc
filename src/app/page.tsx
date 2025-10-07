'use client';

import { MainLayout } from '@/frontend/components/layouts/MainLayout';
import { UserSelector } from '@/frontend/features/persona/components/UserSelector';
import { useJourneyOrchestrator } from '@/frontend/features/loan-journey/useJourneyOrchestrator';
import { JourneyGenerationLoader } from '@/frontend/components/ui/loading/JourneyGenerationLoader'; 
import { ErrorScreen } from '@/frontend/components/ui';
import { OfferDisplay } from '@/frontend/features/loan-journey/components/steps/OfferDisplay';
// --- THIS IS THE CORRECTED IMPORT PATH ---
import { DynamicStepRenderer } from '@/frontend/features/loan-journey/components/DynamicStepRenderer';
import { JourneyComplete } from '@/frontend/features/loan-journey/components/steps/JourneyComplete';
import { ChatStepRenderer } from '@/frontend/features/loan-journey/components/chat/ChatStepRenderer';
import Image from 'next/image';

export default function Home() {
  const {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, loanOffer, 
    selectedPersona, isJourneyComplete, handleGenerateJourney, handleStepComplete, 
    handleBack, handleRestart, handleFormChange, formData, errors,
    chatHistory,
    handleChatSubmit,
  } = useJourneyOrchestrator();

  // This function decides WHICH component to render
  const renderContent = () => {
    // Priority 1: Handle primary states (loading, error, completion)
    if (isLoading && selectedPersona) {
      return <JourneyGenerationLoader personaName={selectedPersona.name} />;
    }
    if (error) { 
      return <ErrorScreen error={error} retry={() => handleGenerateJourney(selectedPersona!)} />;
    }
    if (isJourneyComplete) { 
      return <JourneyComplete onRestart={handleRestart} />;
    }
    
    // Priority 2: Handle special journey steps
    if (loanOffer) { 
      return <OfferDisplay offer={loanOffer} onAccept={handleStepComplete} />;
    }
    
    // Priority 3: Handle the main journey renderers (chat vs. form)
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

    // Priority 4: If nothing else has been rendered, show the default Welcome Screen
    return (
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-10">
          <Image
            src="/hero.png"
            alt="Personalized Journey"
            width={160}
            height={160}
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
    );
  };

  return (
    <MainLayout
      headerContent={
        <UserSelector onGenerate={handleGenerateJourney} isLoading={isLoading} />
      }
    >
      <div className="p-4 md:p-8 h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  );
}