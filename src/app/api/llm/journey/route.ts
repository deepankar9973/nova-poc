import { NextResponse } from 'next/server';
import { LLMService } from '@/backend/services/llm/service';
import { 
  LLMRequest, 
  JourneyStep,
  Persona 
} from '@/frontend/features/loan-journey/types';

const llmService = new LLMService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!isValidRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { persona, currentStep, userData } = body;

    // Get journey plan if no currentStep is provided
    if (!currentStep) {
      const journeyPlan = await llmService.getJourneyPlan({ persona });
      return NextResponse.json(journeyPlan);
    }

    // Get screen design if currentStep is provided
    const screenDesign = await llmService.getScreenDesign({
      persona,
      step: currentStep as JourneyStep,
      userData
    });

    return NextResponse.json(screenDesign);

  } catch (error) {
    console.error('Journey API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Type guard for request validation
function isValidRequest(body: any): body is LLMRequest {
  return (
    body &&
    body.persona &&
    typeof body.persona === 'object' &&
    'id' in body.persona &&
    'llm_strategy' in body.persona
  );
}

// Add GET method if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}