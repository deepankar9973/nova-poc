import { Persona, JourneyStep, UserData } from '@/frontend/features/loan-journey/types';
import { AVAILABLE_COMPONENTS, PROMPT_CONFIG } from './config'; 


export function generateJourneyPlanPrompt(persona: Persona): string {
    return `You are a world-class UX Architect at Moneyview, a leading Indian FinTech.
  IMPORTANT: Return ONLY a valid JSON object without any additional text or explanations.
  
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
  
  Return this exact JSON structure:
  {
    "journey_plan": [
      {
        "step_id": "unique-identifier",
        "screen_type": "form",
        "required_fields": ["field1", "field2"],
        "optional_fields": ["field3"],
        "ui_preferences": {
          "layout": "form",
          "component_preferences": ["Component1", "Component2"],
          "validation_strategy": "immediate",
          "helper_text_level": "minimal"
        },
        "next_step_condition": "condition-string"
      }
    ],
    "rationale": {
      "strategy_alignment": "strategy explanation",
      "ux_considerations": "ux details",
      "accessibility_notes": "accessibility details"
    }
  }`;
  }
  
  export function generateScreenDesignPrompt(
    persona: Persona,
    step: JourneyStep,
    userData: UserData
  ): string {
    return `You are a meticulous UI Designer at Moneyview.
  IMPORTANT: Return ONLY a valid JSON object without any additional text or explanations.
  
  CONTEXT:
  Current Step: ${step}
  Strategy: ${persona.llm_strategy}
  UI Traits: ${persona.key_ui_traits.join(', ')}
  User Goal: ${persona.ux_goal}
  
  CURRENT USER STATE:
  ${JSON.stringify(userData, null, 2)}
  
  AVAILABLE COMPONENTS:
  ${AVAILABLE_COMPONENTS.join(', ')}
  
  Return this exact JSON structure:
  {
    "screen_title": "Screen Title",
    "layout": {
      "type": "single",
      "spacing": "comfortable",
      "alignment": "left"
    },
    "components": [
      {
        "component_type": "ComponentName",
        "position": "main",
        "props": {
          "id": "field-id",
          "label": "Field Label",
          "type": "text",
          "placeholder": "Enter value",
          "helperText": "Help text",
          "variant": "default",
          "size": "medium"
        },
        "validations": {
          "required": true,
          "minLength": 2,
          "pattern": "regex-pattern",
          "custom": "custom-rule"
        },
        "accessibility": {
          "ariaLabel": "aria label",
          "keyboardShortcut": "shortcut"
        },
        "conditional_display": {
          "dependsOn": "field-id",
          "condition": "condition-string"
        }
      }
    ],
    "actions": {
      "primary": {
        "text": "Continue",
        "action": "submit",
        "validation": ["field1", "field2"]
      },
      "secondary": {
        "text": "Back",
        "action": "back"
      }
    },
    "analytics": {
      "screen_id": "screen-identifier",
      "track_fields": ["field1", "field2"],
      "important_events": ["event1", "event2"]
    }
  }
  
  PERSONA ADAPTATIONS:
  ${persona.llm_strategy === 'efficiency' ? '- Use compact layouts, keyboard shortcuts, minimal text' : ''}
  ${persona.llm_strategy === 'reassurance' ? '- Add security indicators, detailed help text, progress tracking' : ''}
  ${persona.llm_strategy === 'velocity' ? '- Minimize steps, use auto-fill, show time estimates' : ''}
  ${persona.llm_strategy === 'exploration' ? '- Add comparison tools, save options, clear exit points' : ''}
  ${persona.llm_strategy === 'control' ? '- Show data usage, add consent checkboxes, explicit confirmations' : ''}
  ${persona.llm_strategy === 'clarity' ? '- Use simple language, larger text, clear icons with labels' : ''}`;
  }