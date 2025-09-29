import { JourneyOrchestrator } from '@/frontend/features/loan-journey/JourneyOrchestrator';
import { MainLayout } from '@/frontend/components/layouts/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <JourneyOrchestrator />
    </MainLayout>
  );
}