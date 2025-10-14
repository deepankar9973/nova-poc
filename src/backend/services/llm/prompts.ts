// src/backend/services/llm/prompts.ts
import { Persona, UserData, DynamicJourneyStep } from '@/frontend/features/loan-journey/types';
import { PERSONA_PATTERNS } from './config';

const getPersonaInstructions = (persona: Persona) => {
  switch (persona.llm_strategy) {
    case 'efficiency':
    case 'velocity':
      return `
        JOURNEY STRUCTURE:
        Group as many related fields into a single step as possible. The journey should be very short (2-3 steps maximum).
        
        UI/UX GUIDELINES:
        - Use compact layouts with minimal white space, sliders, and chips.
        - Keep copy short, direct, and action-oriented.
        
        TONE & CONTENT:
        - Direct, brief, and business-like.
      `;

    case 'reassurance':
    case 'control':
      return `
        JOURNEY STRUCTURE:
        Keep each task in a separate, dedicated step to avoid overwhelming the user.
        
        UI/UX GUIDELINES:
        - Spacious layouts, familiar form elements, and clear progress indicators.
        - Include helper text and trust indicators.
        
        TONE & CONTENT:
        - Supportive, reassuring, and security-focused.
      `;

    case 'clarity':
      return `
        JOURNEY STRUCTURE:
        Design a conversational chat-like experience. Each step should be a single question.
        
        UI/UX GUIDELINES:
        - Conversational layout, one question per screen, large text, simple inputs.
        
        TONE & CONTENT:
        - Friendly, conversational, simple language, and immediate feedback.
      `;

    case 'exploration':
      return `
        JOURNEY STRUCTURE:
        Start with an interactive calculator so users can see eligibility early.
        
        UI/UX GUIDELINES:
        - Interactive elements like sliders and calculators with visual feedback.
        
        TONE & CONTENT:
        - Engaging, informative, and focused on benefits.
      `;

    default:
      return `Create a standard, logical multi-step form.`;
  }
};

export function generateJourneyPlanPrompt(persona: Persona): string {
  const personaInstructions = getPersonaInstructions(persona);

  return `You are a UX Architect for a loan app. Your task is to generate a valid JSON object defining a multi-step user journey.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object.

CONTEXT:
- Persona Name: ${persona.name}
- Persona Strategy: ${persona.llm_strategy}

**PERSONA-SPECIFIC INSTRUCTIONS:**
**${personaInstructions}**

CORE TASKS TO ACCOMPLISH IN THE JOURNEY (break these into steps according to the instructions):
1.  **BASIC_DETAILS:** Collect "fullName", "mobileNumber".
2.  **INCOME_INFO:** Collect "monthlySalary", "employmentType".
3.  **PAN_CONFIRM:** Collect "panNumber".
4.  **OFFER_DISPLAY:** This is a special step where the offer is shown. The journey MUST include this.
5.  **AMOUNT_SELECTION:** The final step for the user to choose their loan amount and tenure.

--- MANDATORY RULES ---
- Every object inside the 'journey_plan' array MUST have a 'step_id' (string), 'screen_type' (string), and a 'required_fields' (array of strings).
- If a step is for collecting data (e.g., BASIC_DETAILS), its 'required_fields' array MUST NOT be empty.
- The 'OFFER_DISPLAY' step should have an empty 'required_fields' array.

Return ONLY a JSON object with a "journey_plan" array and a "rationale" object.`;
}


export function generateScreenDesignPrompt(
    persona: Persona,
    step: DynamicJourneyStep,
    userData: UserData,
    currentStepIndex: number
  ): string {
    if (!step || !step.step_id) {
      throw new Error('Invalid step data provided');
    }
  
    const screenTitle = String(step.step_id).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const personaInstructions = getPersonaInstructions(persona);
  
    if (persona.llm_strategy === 'clarity') {
      const fieldToCollect = step.required_fields[0];
      return `You are a friendly and helpful chat assistant for MoneyView. Your task is to ask a single, clear question to collect one piece of information.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object.

CONTEXT:
- Persona Strategy: ${persona.llm_strategy}
- Field to Collect: "${fieldToCollect}"
- Previously collected data: ${JSON.stringify(userData)}

INSTRUCTIONS:
- Ask a simple, conversational question to get the user's "${fieldToCollect}".
- For "fullName", ask for their full name. For "mobileNumber", ask for their 10-digit mobile number.
- Keep the tone friendly, supportive, and simple.

Return ONLY a JSON object with this exact structure:
{
  "chat_response": {
    "bot_message": "Your friendly question goes here.",
    "user_input_type": "text",
    "field_id": "${fieldToCollect}"
  }
}`;
    }

    return `You are a UI Designer for MoneyView's loan app. Generate a valid JSON object for a single screen.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object.

CONTEXT:
- Screen Title: "${screenTitle}"
- Persona Strategy: ${persona.llm_strategy}
- Fields to Collect: **${JSON.stringify(step.required_fields)}**
- Current Step: ${currentStepIndex + 1}

**PERSONA-SPECIFIC INSTRUCTIONS:**
**${personaInstructions}**

INSTRUCTIONS:
- You MUST create components in the "components" array to collect ALL of the fields listed above.
- For options (like employmentType), you MUST use a "RadioButtonGroup" with an "options" array of objects, where each object has a "label" and a "value".

Return ONLY a JSON object with this structure:
{
  "screen_title": "${screenTitle}",
  "screen_subtitle": "Supporting text matching persona tone",
  "layout": { "type": "single" },
  "components": [
    {
      "component_type": "InputField",
      "position": "main",
      "props": {
        "id": "fieldId",
        "label": "Clear Label",
        "type": "text",
        "required": true
      }
    }
  ],
  "actions": { "primary": { "text": "Continue" } },
  "analytics": { "screen_id": "${step.step_id}" }
}`;
}