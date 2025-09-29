import { 
    LLMResponse, // Note: This might need to be LLMJourneyResponse depending on your types
    ScreenDesignResponse, 
    Persona,
    DynamicJourneyStep,
    UserData
  } from '../features/loan-journey/types';
  
  // The new LLM Client Service that sends the correct request format
  class LLMClientService {
    private async makeRequest(payload: object) {
      try {
        const response = await fetch('/api/llm/journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), // Send the payload directly
        });
  
        if (!response.ok) {
          // Try to get more error details from the backend response
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status} - ${errorBody.details || response.statusText}`);
        }
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.details || 'An API error occurred');
        }
  
        return result.data; // Return the nested data object
      } catch (error) {
        console.error('LLM Client Error:', error);
        throw error;
      }
    }
  
    // SENDS: { type: 'journey_plan', persona: ... }
    async getJourneyPlan(persona: Persona): Promise<LLMResponse> { // Or LLMJourneyResponse
      return this.makeRequest({ type: 'journey_plan', persona });
    }
  
    // SENDS: { type: 'screen_design', persona: ..., step: ..., userData: ... }
    async getScreenDesign(
      persona: Persona,
      step: DynamicJourneyStep,
      userData?: UserData
    ): Promise<ScreenDesignResponse> {
      return this.makeRequest({ type: 'screen_design', persona, step, userData });
    }
  }
  
  export const llmClientService = new LLMClientService();