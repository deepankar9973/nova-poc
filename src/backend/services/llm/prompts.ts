// src/backend/services/llm/prompts.ts
import { Persona, UserData } from '@/frontend/features/loan-journey/types';
import { AVAILABLE_COMPONENTS, PERSONA_PATTERNS } from './config';

const getPersonaInstructions = (persona: Persona) => {
  switch (persona.llm_strategy) {
    case 'efficiency':
    case 'velocity':
      return `
        JOURNEY STRUCTURE:
        Group as many related fields into a single step as possible. The journey should be very short (2-3 steps maximum).
        
        UI/UX GUIDELINES:
        - Use compact layouts with minimal white space
        - Prefer sliders and chips over long forms
        - Keep copy short and direct
        - Use action-oriented labels
        - Group related fields together
        - Minimize supporting text
        - Use quick-select options where possible
        
        TONE & CONTENT:
        - Direct and brief
        - Focus on speed and efficiency
        - Use business-like language
        - Minimize explanatory text
      `;

    case 'reassurance':
    case 'control':
      return `
        JOURNEY STRUCTURE:
        Keep each task in a separate, dedicated step to avoid overwhelming the user.
        
        UI/UX GUIDELINES:
        - Spacious layouts with clear visual hierarchy
        - Use familiar form elements (standard inputs)
        - Add helper text for each field
        - Show progress clearly
        - Include trust indicators
        - Use RadioButtonGroups for clear options
        
        TONE & CONTENT:
        - Supportive and reassuring
        - Explain each step clearly
        - Add security messages
        - Use trust-building language
        - Include helper text and tooltips
      `;

    case 'clarity':
      return `
        JOURNEY STRUCTURE:
        Design a conversational chat-like experience. Each step should be a single question.
        
        UI/UX GUIDELINES:
        - Conversational layout
        - One question per screen
        - Large, clear text
        - Simple input methods
        - Visual confirmation of inputs
        - Use "BodyText" for questions
        
        TONE & CONTENT:
        - Friendly and conversational
        - Use simple, clear language
        - Ask questions naturally
        - Provide immediate feedback
        - Avoid technical terms
      `;

    case 'exploration':
      return `
        JOURNEY STRUCTURE:
        Start with an interactive calculator for "Income Info" so users can see eligibility early.
        
        UI/UX GUIDELINES:
        - Interactive elements (sliders, calculators)
        - Visual feedback for changes
        - Show impact of choices
        - Include comparison tools
        - Highlight benefits
        
        TONE & CONTENT:
        - Engaging and informative
        - Highlight possibilities
        - Show benefits clearly
        - Use encouraging language
        - Explain impacts of choices
      `;

    default:
      return `Create a standard, logical multi-step form.`;
  }
};

export function generateJourneyPlanPrompt(persona: Persona): string {
  const pattern = PERSONA_PATTERNS[persona.llm_strategy];
  const personaInstructions = getPersonaInstructions(persona);

  return `You are a UX Architect for a loan app. Your task is to generate a valid JSON object defining a multi-step user journey.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object.

PERSONA CONTEXT:
- Strategy: ${persona.llm_strategy}
- Journey Pattern to use: **${pattern.name}**

**PERSONA-SPECIFIC INSTRUCTIONS:**
**${personaInstructions}**

CORE TASKS TO ACCOMPLISH IN THE JOURNEY (break these into steps according to the instructions):
1.  **BASIC_DETAILS:** Collect "fullName", "mobileNumber".
2.  **INCOME_INFO:** Collect "monthlySalary", "employmentType".
3.  **PAN_CONFIRM:** Collect "panNumber".
4.  **OFFER_DISPLAY:** This is a special step where the offer is shown. The journey MUST include this.
5.  **AMOUNT_SELECTION:** The final step for the user to choose their loan amount and tenure.

Return ONLY a JSON object with a "journey_plan" array and a "rationale" object.`;
}

export function generateScreenDesignPrompt(
    persona: Persona,
    step: JourneyStep,
    userData: UserData,
    currentStepIndex: number
  ): string {
    if (!step || !step.step_id) {
      throw new Error('Invalid step data provided');
    }
  
    const screenTitle = step.step_id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const personaInstructions = getPersonaInstructions(persona);
  

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