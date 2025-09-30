// src/frontend/services/llm.ts
import { 
    LLMResponse,
    ScreenDesignResponse, 
    Persona,
    DynamicJourneyStep,
    UserData,
    UIPreferences
  } from '../features/loan-journey/types';
  
  export class LLMClientService {
    private async makeRequest(payload: { 
      type: 'journey_plan' | 'screen_design' | 'calculate_offer';
      persona?: Persona;
      step?: DynamicJourneyStep;
      userData?: UserData;
      currentStepIndex?: number;
    }) {
      try {
        console.log('Making API request with payload:', payload);
  
        const response = await fetch('/api/llm/journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status} - ${errorBody.details || response.statusText}`);
        }
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.details || 'An API error occurred');
        }
  
        return result.data;
      } catch (error) {
        console.error('LLM Client Error:', error);
        throw error;
      }
    }
  
    private validatePersona(persona: Persona): boolean {
      return !!(
        persona &&
        persona.id &&
        persona.name &&
        persona.llm_strategy &&
        Array.isArray(persona.key_ui_traits)
      );
    }
  
    private normalizeStep(step: Partial<DynamicJourneyStep>, currentStepIndex: number): DynamicJourneyStep {
      const defaultUiPreferences: UIPreferences = {
        layout: 'form',
        component_preferences: [],
        validation_strategy: 'immediate',
        helper_text_level: 'minimal'
      };
  
      return {
        step_id: step.step_id || `STEP_${currentStepIndex + 1}`,
        screen_type: step.screen_type || 'form',
        required_fields: step.required_fields || [],
        optional_fields: step.optional_fields || [],
        ui_preferences: {
          ...defaultUiPreferences,
          ...step.ui_preferences
        },
        next_step_condition: step.next_step_condition || ''
      };
    }
  
    async getJourneyPlan(persona: Persona): Promise<LLMResponse> {
      if (!this.validatePersona(persona)) {
        throw new Error('Invalid persona data provided');
      }
  
      const normalizedPersona: Persona = {
        id: persona.id,
        name: persona.name,
        description: persona.description || '',
        age: persona.age || 0,
        occupation: persona.occupation || '',
        ux_goal: persona.ux_goal || '',
        llm_strategy: persona.llm_strategy,
        key_ui_traits: persona.key_ui_traits || []
      };
  
      console.log('Getting journey plan for persona:', normalizedPersona);
  
      return this.makeRequest({ 
        type: 'journey_plan', 
        persona: normalizedPersona
      });
    }
  
    async getScreenDesign(params: {
      persona: Persona;
      step: Partial<DynamicJourneyStep>;
      userData?: UserData;
      currentStepIndex: number;
    }): Promise<ScreenDesignResponse> {
      if (!this.validatePersona(params.persona)) {
        throw new Error('Invalid persona data for screen design');
      }
  
      if (!params.step) {
        throw new Error('Step data is required for screen design');
      }
  
      const normalizedStep = this.normalizeStep(params.step, params.currentStepIndex);
      console.log('Getting screen design for step:', normalizedStep);
  
      return this.makeRequest({ 
        type: 'screen_design', 
        persona: params.persona,
        step: normalizedStep,
        userData: params.userData || {},
        currentStepIndex: params.currentStepIndex
      });
    }
  
    async calculateOffer(userData: UserData): Promise<any> {
      if (!userData) {
        throw new Error('User data is required for offer calculation');
      }
  
      console.log('Calculating offer for user data:', userData);
  
      return this.makeRequest({ 
        type: 'calculate_offer', 
        userData 
      });
    }
  
    // Helper method to validate step data
    private validateStep(step: any): boolean {
      return !!(
        step &&
        typeof step === 'object' &&
        (step.step_id || step.step) &&
        Array.isArray(step.required_fields || step.tasks)
      );
    }
  }
  
  export const llmClientService = new LLMClientService();