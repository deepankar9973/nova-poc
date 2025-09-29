'use client';

import { MainLayout } from '@/frontend/components/layouts/MainLayout';
import { UserSelector } from '@/frontend/features/persona/components/UserSelector';
import { useJourneyOrchestrator } from '@/frontend/features/loan-journey/useJourneyOrchestrator';
import { LoadingShimmer } from '@/frontend/components/ui/loading/LoadingShimmer';
import { ErrorScreen } from '@/frontend/components/ui';
import { OfferDisplay } from '@/frontend/features/loan-journey/components/steps/OfferDisplay';
import { DynamicStepRenderer } from '@/frontend/features/loan-journey/components/DynamicStepRenderer';
import { JourneyComplete } from '@/frontend/features/loan-journey/components/steps/JourneyComplete';

export default function Home() {
  const {
    isLoading, error, screenDesign, journeyPlan, currentStepIndex, loanOffer, selectedPersona, isJourneyComplete,
    handleGenerateJourney, handleStepComplete, handleBack, handleRestart, handleFormChange, formData, errors,
  } = useJourneyOrchestrator();

  const renderMainContent = () => {
    if (isLoading && selectedPersona) {
      return <LoadingShimmer userName={selectedPersona.name.split(',')[0]} />;
    }
    if (error) {
      return <ErrorScreen error={error} retry={() => handleGenerateJourney(selectedPersona!)} />;
    }
    if (isJourneyComplete) {
      return <JourneyComplete onRestart={handleRestart} />;
    }
    if (loanOffer) {
      return <OfferDisplay offer={loanOffer} onAccept={handleStepComplete} />;
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
    return (
      <div className="text-center text-gray-500 pt-16">
        <h2 className="text-xl font-semibold mb-2">Welcome to MoneyView GenUI</h2>
        <p>Please select a user profile from the dropdown above to begin a personalized loan journey.</p>
      </div>
    );
  };

  return (
    <MainLayout
      headerContent={
        <UserSelector onGenerate={handleGenerateJourney} isLoading={isLoading} />
      }
    >
      {renderMainContent()}
    </MainLayout>
  );
}