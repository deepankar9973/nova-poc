// src/app/api/llm/journey/route.ts
import { NextResponse } from 'next/server';
import { LLMService } from '@/backend/services/llm/service';
import { calculateLoanOffer } from '@/backend/utils/creditLogic';
import { Persona, UserData } from '@/frontend/features/loan-journey/types';

const llmService = new LLMService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { type, persona, step, userData, currentStepIndex } = body;

    // Get the initial journey plan
    if (type === 'journey_plan') {
      console.log('Processing journey_plan request');
      
      if (!isValidPersona(persona)) {
        return NextResponse.json({
          success: false,
          error: 'Validation Error',
          details: 'Invalid persona object provided.'
        }, { status: 400 });
      }

      try {
        const journeyPlan = await llmService.getJourneyPlan({ persona });
        return NextResponse.json({ 
          success: true, 
          data: journeyPlan 
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Journey Plan Error',
          details: error.message
        }, { status: 500 });
      }
    } 
    
    // Get the design for a specific screen
    else if (type === 'screen_design') {
      console.log('Processing screen_design request');
      
      if (!isValidPersona(persona) || !step) {
        return NextResponse.json({
          success: false,
          error: 'Validation Error',
          details: 'Persona and step are required.'
        }, { status: 400 });
      }

      try {
        const screenDesign = await llmService.getScreenDesign({ 
          persona, 
          step, 
          userData: userData || {},
          currentStepIndex: currentStepIndex || 0
        });
        return NextResponse.json({ 
          success: true, 
          data: screenDesign 
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Screen Design Error',
          details: error.message
        }, { status: 500 });
      }
    } 
    
    // Calculate the loan offer
    else if (type === 'calculate_offer') {
      console.log('Processing calculate_offer request');
      
      if (!userData) {
        return NextResponse.json({
          success: false,
          error: 'Validation Error',
          details: 'User data is required to calculate an offer.'
        }, { status: 400 });
      }

      try {
        const offer = calculateLoanOffer(userData as UserData);
        return NextResponse.json({ 
          success: true, 
          data: offer 
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Offer Calculation Error',
          details: error.message
        }, { status: 500 });
      }
    } 
    
    // Invalid request type
    else {
      return NextResponse.json({
        success: false,
        error: 'Invalid Request',
        details: `Invalid or missing request type: ${type}`
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server Error',
      details: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
}

function isValidPersona(persona: any): persona is Persona {
  return !!(
    persona &&
    typeof persona === 'object' &&
    typeof persona.id === 'string' &&
    typeof persona.name === 'string' &&
    typeof persona.llm_strategy === 'string'
  );
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Method Not Allowed' 
  }, { status: 405 });
}