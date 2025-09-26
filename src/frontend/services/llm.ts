import { 
    LLMRequest, 
    LLMResponse, 
    ScreenDesignResponse, 
    Persona,
    JourneyStep 
  } from '../features/loan-journey/types';
  
  class LLMClientService {
    private async makeRequest(data: LLMRequest) {
      try {
        const response = await fetch('/api/llm/journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('LLM Client Error:', error);
        throw error;
      }
    }
  
    async getJourneyPlan(persona: Persona): Promise<LLMResponse> {
      return this.makeRequest({ persona });
    }
  
    async getScreenDesign(
      persona: Persona,
      currentStep: JourneyStep,
      userData?: Record<string, any>
    ): Promise<ScreenDesignResponse> {
      return this.makeRequest({ 
        persona, 
        currentStep, 
        userData 
      });
    }
  }
  
  export const llmClientService = new LLMClientService();