import { NextResponse } from 'next/server';
import { LLMService } from '@/backend/services/llm/service';
import { calculateLoanOffer } from '@/backend/utils/creditLogic';
import { Persona, UserData } from '@/frontend/features/loan-journey/types';

const llmService = new LLMService();

// This is the main API handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, persona, step, userData } = body;

    // --- LOGIC RESTRUCTURED to be more robust ---

    // ACTION 1: Get the initial journey plan
    if (type === 'journey_plan') {
      if (!isValidPersona(persona)) {
        return handleError(new Error('Invalid persona object provided.'), 'Validation Error', 400);
      }
      try {
        const journeyPlan = await llmService.getJourneyPlan({ persona });
        return NextResponse.json({ success: true, data: journeyPlan });
      } catch (error) {
        return handleError(error, 'Journey plan generation failed');
      }
    } 
    
    // ACTION 2: Get the design for a specific screen
    else if (type === 'screen_design') {
      if (!isValidPersona(persona) || !step) {
        return handleError(new Error('Persona and step are required.'), 'Validation Error', 400);
      }
      try {
        const screenDesign = await llmService.getScreenDesign({ persona, step, userData });
        return NextResponse.json({ success: true, data: screenDesign });
      } catch (error) {
        return handleError(error, 'Screen design generation failed');
      }
    } 
    
    // ACTION 3: Calculate the loan offer
    else if (type === 'calculate_offer') {
      if (!userData) {
        return handleError(new Error('User data is required to calculate an offer.'), 'Validation Error', 400);
      }
      try {
        const offer = calculateLoanOffer(userData as UserData);
        return NextResponse.json({ success: true, data: offer });
      } catch (error) {
        return handleError(error, 'Offer calculation failed');
      }
    } 
    
    // Default case for unknown actions
    else {
      return handleError(new Error(`Invalid or missing request type: ${type}`), 'Bad Request', 400);
    }

  } catch (error) {
    // Catch-all for issues like invalid JSON in the request body
    return handleError(error, 'Request processing failed');
  }
}


// --- HELPER FUNCTIONS (No changes needed here) ---

function isValidPersona(persona: any): persona is Persona {
  return (
    persona &&
    typeof persona === 'object' &&
    typeof persona.id === 'string' &&
    typeof persona.llm_strategy === 'string'
  );
}

function handleError(error: any, context: string, status: number = 500) {
  console.error(`API Error in ${context}:`, error);
  return NextResponse.json({
    success: false,
    error: context,
    details: error.message || 'An unknown error occurred.',
  }, { status });
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}