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

export default function Home() {
  const {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, loanOffer, 
    selectedPersona, isJourneyComplete, handleGenerateJourney, handleStepComplete, 
    handleBack, handleRestart, handleFormChange, formData, errors,
    chatHistory,
    handleChatSubmit,
  } = useJourneyOrchestrator();

  // This function decides WHICH component to render. The wrapper is now removed.
  const renderContent = () => {
    // --- THIS LOGIC REMAINS THE SAME ---
    if (isLoading && selectedPersona) {
      return (
        <div className="flex items-center justify-center h-full">
          <JourneyGenerationLoader personaName={selectedPersona.name} />
        </div>
      );
    }
    // ... (other primary states like error, complete, offer) ...

    // --- RENDER THE CHAT/FORM COMPONENTS DIRECTLY ---
    if (selectedPersona?.llm_strategy === 'clarity' && chatHistory.length > 0 && journeyPlan) {
      // The ChatStepRenderer is already a full-height component, so it needs no wrapper.
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
      // The DynamicStepRenderer handles its own internal centering.
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

    // --- WRAP ONLY THE WELCOME SCREEN ---
    // The default Welcome Screen is the only one that needs special centering.
    return (
      <div className="flex items-center justify-center h-full">
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
      </div>
    );
  };

  return (
    <MainLayout
      headerContent={
        <UserSelector onGenerate={handleGenerateJourney} isLoading={isLoading} />
      }
    >
      {/* --- THIS IS THE FIX --- */}
      {/* The `MainLayout` provides the padding. We render the content directly inside it */}
      {/* without any extra centering divs, allowing child components to fill the space. */}
      {renderContent()}
    </MainLayout>
  );
}