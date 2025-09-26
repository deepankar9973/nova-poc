import { Persona, JourneyStep, UserData } from '@/frontend/features/loan-journey/types';
import { AVAILABLE_COMPONENTS } from './config';

export function generateJourneyPlanPrompt(persona: Persona): string {
  return `
You are a world-class UX Architect at Moneyview, a leading Indian FinTech.
Design a personalized loan application journey for this user.

PERSONA CONTEXT:
Strategy: ${persona.llm_strategy}
UX Goal: ${persona.ux_goal}
Key UI Traits: ${persona.key_ui_traits.join(', ')}
User Profile: ${persona.description}

REQUIRED INFORMATION TO COLLECT:
- Basic Details (name, contact)
- Monthly Income
- Income Source (salary/business/other)
- PAN Number
- Education Details
- Employment Information

AVAILABLE COMPONENTS:
${AVAILABLE_COMPONENTS.join(', ')}

JOURNEY CONSTRAINTS:
1. Must collect all required information
2. Adapt flow complexity to user's digital fluency
3. Match UI components to persona traits
4. Consider user's time sensitivity
5. Maintain security and trust elements

Return ONLY a JSON object with this structure:
{
  "journey_plan": [
    {
      "step_id": string,
      "screen_type": string,
      "required_fields": string[],
      "optional_fields": string[],
      "ui_preferences": {
        "layout": "form|wizard|cards",
        "component_preferences": string[],
        "validation_strategy": "immediate|onSubmit",
        "helper_text_level": "minimal|detailed"
      },
      "next_step_condition": string
    }
  ],
  "rationale": {
    "strategy_alignment": string,
    "ux_considerations": string,
    "accessibility_notes": string
  }
}`;
}

export function generateScreenDesignPrompt(
  persona: Persona,
  step: JourneyStep,
  userData: UserData
): string {
  return `
You are a meticulous UI Designer at Moneyview.
Create a screen design that matches this user's preferences and needs.

CONTEXT:
Current Step: ${step}
Strategy: ${persona.llm_strategy}
UI Traits: ${persona.key_ui_traits.join(', ')}
User Goal: ${persona.ux_goal}

CURRENT USER STATE:
${JSON.stringify(userData, null, 2)}

AVAILABLE COMPONENTS:
${AVAILABLE_COMPONENTS.join(', ')}

DESIGN REQUIREMENTS:
1. Match persona's UI preferences
2. Consider user's digital fluency
3. Maintain consistent experience
4. Include appropriate validation
5. Add helpful guidance based on strategy

Return ONLY a JSON object with this structure:
{
  "screen_title": string,
  "layout": {
    "type": "single|split|wizard",
    "spacing": "compact|comfortable",
    "alignment": "left|center"
  },
  "components": [
    {
      "component_type": string,
      "position": "header|main|footer",
      "props": {
        "id": string,
        "label": string,
        "type": string,
        "placeholder"?: string,
        "helperText"?: string,
        "variant"?: string,
        "size"?: string
      },
      "validations": {
        "required"?: boolean,
        "minLength"?: number,
        "pattern"?: string,
        "custom"?: string
      },
      "accessibility": {
        "ariaLabel": string,
        "keyboardShortcut"?: string
      },
      "conditional_display"?: {
        "dependsOn": string,
        "condition": string
      }
    }
  ],
  "actions": {
    "primary": {
      "text": string,
      "action": string,
      "validation": string[]
    },
    "secondary"?: {
      "text": string,
      "action": string
    }
  },
  "analytics": {
    "screen_id": string,
    "track_fields": string[],
    "important_events": string[]
  }
}

Consider these persona-specific adaptations:
- Efficiency: ${persona.llm_strategy === 'efficiency' ? 'Use compact layouts, keyboard shortcuts, minimal text' : ''}
- Reassurance: ${persona.llm_strategy === 'reassurance' ? 'Add security indicators, detailed help text, progress tracking' : ''}
- Velocity: ${persona.llm_strategy === 'velocity' ? 'Minimize steps, use auto-fill, show time estimates' : ''}
- Exploration: ${persona.llm_strategy === 'exploration' ? 'Add comparison tools, save options, clear exit points' : ''}
- Control: ${persona.llm_strategy === 'control' ? 'Show data usage, add consent checkboxes, explicit confirmations' : ''}
- Clarity: ${persona.llm_strategy === 'clarity' ? 'Use simple language, larger text, clear icons with labels' : ''}`;
}