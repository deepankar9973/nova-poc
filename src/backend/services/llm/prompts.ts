import { Persona, JourneyStep, UserData } from '@/frontend/features/loan-journey/types';
import { AVAILABLE_COMPONENTS, PERSONA_PATTERNS } from './config';

export function generateJourneyPlanPrompt(persona: Persona): string {
    const pattern = PERSONA_PATTERNS[persona.llm_strategy];
  
    return `You are a UX Architect for a loan app. Your task is to generate a valid JSON object defining a multi-step user journey.
  CRITICAL INSTRUCTION: You MUST return ONLY the JSON object. Do not include any text before or after the JSON. The JSON structure MUST be followed exactly.
  
  PERSONA DETAILS:
  - Strategy: ${persona.llm_strategy}
  - Journey Pattern to use: **${pattern.name}**
  - Pattern Description: ${pattern.description}
  
  CORE TASKS TO ACCOMPLISH IN THE JOURNEY (break these into steps):
  - Collect Basic Details (name, contact)
  - Collect Income & Employment Info
  - Verify PAN
  - Display Loan Offer
  - Select Loan Amount & Tenure
  - Final Confirmation
  
  Based on the **${pattern.name}** pattern, create a sequence of steps.
  - For a **Streamlined Form**, combine the first two tasks into a single step.
  - For a **Guided Form** or **Conversational Chat**, create a separate step for each task.
  
  Return ONLY a JSON object with this exact structure:
  {
    "journey_plan": [
      {
        "step_id": "step-1-name-and-contact",
        "screen_type": "${pattern.name.toLowerCase().replace(/ /g, '-')}",
        "required_fields": ["fullName", "mobileNumber"]
      },
      {
        "step_id": "step-2-income-and-employment",
        "screen_type": "${pattern.name.toLowerCase().replace(/ /g, '-')}",
        "required_fields": ["monthlySalary", "employmentType"]
      }
    ],
    "rationale": {
      "strategy_alignment": "Explain WHY you chose this step structure for this persona.",
      "ux_considerations": "Describe the key UX choices.",
      "accessibility_notes": "Mention relevant accessibility notes."
    }
  }`;
  }


// --- THIS IS THE UPDATED FUNCTION ---
export function generateScreenDesignPrompt(
    persona: Persona,
    step: any, // Using 'any' as it's now a dynamic step object
    userData: UserData
  ): string {
    const screenType = step.screen_type || 'form';
  
    return `You are a meticulous UI Designer at Moneyview.
  IMPORTANT: You MUST return ONLY a single, valid JSON object. Do not include any extra text.
  CRITICAL: The final JSON object MUST include ALL top-level keys: "screen_title", "layout", "components", "actions", and "analytics".
  
  CONTEXT:
  - Current Step ID: ${step.step_id}
  - Designated Screen Type: ${screenType}
  - Persona Strategy: ${persona.llm_strategy}
  - User Goal: ${persona.ux_goal}
  - Required Fields for this Step: ${JSON.stringify(step.required_fields)}
  
  AVAILABLE COMPONENTS: ${AVAILABLE_COMPONENTS.join(', ')}
  
  Return this exact JSON structure. Do NOT omit any keys.
  {
    "screen_title": "A clear, action-oriented title for the screen",
    "layout": {
      "type": "single",
      "spacing": "comfortable",
      "alignment": "left"
    },
    "components": [
      {
        "component_type": "Header",
        "position": "header",
        "props": {
          "id": "header-welcome",
          "text": "Welcome!"
        }
      },
      {
        "component_type": "InputField",
        "position": "main",
        "props": {
          "id": "user-name",
          "label": "Full Name",
          "type": "text",
          "required": true
        }
      }
    ],
    "actions": {
      "primary": {
        "text": "Continue",
        "action": "submit"
      },
      "secondary": {
        "text": "Go Back",
        "action": "back"
      }
    },
    "analytics": {
      "screen_id": "${step.step_id}",
      "track_fields": ["user-name"]
    }
  }`;
  }