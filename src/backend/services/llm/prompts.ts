import { Persona, UserData } from '@/frontend/features/loan-journey/types';
import { AVAILABLE_COMPONENTS, PERSONA_PATTERNS } from './config';

// --- NEW HELPER to get persona-specific instructions ---
const getPersonaInstructions = (persona: Persona) => {
  switch (persona.llm_strategy) {
    case 'efficiency':
    case 'velocity':
      return `Group as many related fields into a single step as possible. The journey should be very short (2-3 steps maximum). Use efficient components like Sliders and Chips.`;
    case 'reassurance':
    case 'control':
      return `Keep each task in a separate, dedicated step to avoid overwhelming the user. Use components that provide clear options, like RadioButtonGroups. Add helper text and security messages.`;
    case 'clarity':
      return `Design a conversational chat. Each step should be a single question. Use "BodyText" to pose the question and an appropriate input component (InputField, RadioButtonGroup) for the answer.`;
    case 'exploration':
      return `Start with an interactive calculator step for "Income Info" so the user can see their eligibility early. Keep the initial steps focused on calculating an offer.`;
    default:
      return `Create a standard, logical multi-step form.`;
  }
};

export function generateJourneyPlanPrompt(persona: Persona): string {
  const pattern = PERSONA_PATTERNS[persona.llm_strategy];
  const personaInstructions = getPersonaInstructions(persona);

  return `You are a UX Architect for a loan app. Your task is to generate a valid JSON object defining a multi-step user journey.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object. Do not include any text before or after the JSON.

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

Return ONLY a JSON object with a "journey_plan" array and a "rationale" object.
Example for a 'reassurance' persona:
{
  "journey_plan": [
    { "step_id": "BASIC_DETAILS", "screen_type": "guided-form", "required_fields": ["fullName", "mobileNumber"] },
    { "step_id": "INCOME_INFO", "screen_type": "guided-form", "required_fields": ["monthlySalary", "employmentType"] },
    { "step_id": "PAN_CONFIRM", "screen_type": "guided-form", "required_fields": ["panNumber"] },
    { "step_id": "OFFER_DISPLAY", "screen_type": "offer-display", "required_fields": [] }
  ],
  "rationale": { "strategy_alignment": "A multi-step guided form provides reassurance..." }
}`;
}

export function generateScreenDesignPrompt(
  persona: Persona,
  step: any,
  userData: UserData
): string {
  const screenTitle = step.step_id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const personaInstructions = getPersonaInstructions(persona);

  return `You are a UI Designer for a loan app. Generate a valid JSON object for a single screen.
CRITICAL INSTRUCTION: You MUST return ONLY the JSON object.

CONTEXT:
- Screen Title: "${screenTitle}"
- Persona Strategy: ${persona.llm_strategy}
- Fields to Collect: **${JSON.stringify(step.required_fields)}**

**PERSONA-SPECIFIC INSTRUCTIONS:**
**${personaInstructions}**

INSTRUCTIONS:
- You MUST create components in the "components" array to collect ALL of the fields listed above.
- For options (like employmentType), you MUST use a "RadioButtonGroup" with an "options" array of objects, where each object has a "label" and a "value".

Return ONLY a JSON object with this structure:
{
  "screen_title": "${screenTitle}",
  "layout": { "type": "single" },
  "components": [
    { "component_type": "Header", "position": "header", "props": { "id": "header", "text": "${screenTitle}" } },
    { "component_type": "InputField", "position": "main", "props": { "id": "fullName", "label": "Full Name", "type": "text", "required": true } }
  ],
  "actions": { "primary": { "text": "Continue" } },
  "analytics": { "screen_id": "${step.step_id}" }
}`;
}