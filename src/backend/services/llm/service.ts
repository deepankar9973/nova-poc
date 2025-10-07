import OpenAI from 'openai';
import { LLM_CONFIG, LLM_ERRORS } from './config';
import { generateJourneyPlanPrompt, generateScreenDesignPrompt } from './prompts';
import { LLMRequest, LLMResponse, ScreenDesignResponse, LLMServiceError, JourneyStep } from './types';

// Initialize OpenAI (assuming this is at the top of your file)
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined. Please add it to your .env.local file.");
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export class LLMService {
  private async makeOpenAIRequest(prompt: string): Promise<string> {
    try {
      console.log('\nMaking request to OpenAI API...');
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant designed to output JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });
      const jsonContent = response.choices[0].message.content;
      if (!jsonContent) {
        throw this.createServiceError('PARSE_ERROR', "OpenAI returned an empty response.");
      }
      console.log('\nReceived valid JSON response from OpenAI.');
      return jsonContent;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw this.createServiceError('CONNECTION', `Failed to communicate with OpenAI: ${error.message}`);
    }
  }

  private async processLLMResponse<T>(
    jsonString: string,
    validator: (data: any) => boolean
  ): Promise<T> {
    try {
      const result = JSON.parse(jsonString);
      if (!validator(result)) {
        console.error('Validation failed for response structure:', result);
        throw this.createServiceError('VALIDATION', 'Response structure from LLM did not match expected schema.');
      }
      console.log('\nJSON validated successfully.');
      return result as T;
    } catch (error: any) {
      if ((error as LLMServiceError).type) throw error;
      throw this.createServiceError('PARSE_ERROR', `Failed to parse LLM JSON: ${error.message}`);
    }
  }

  async getJourneyPlan(request: LLMRequest): Promise<LLMResponse> {
    try {
      console.log('\nGenerating journey plan for:', request.persona.name);
      const prompt = generateJourneyPlanPrompt(request.persona);
      const jsonResponse = await this.makeOpenAIRequest(prompt);
      return await this.processLLMResponse<LLMResponse>(
        jsonResponse,
        this.validateJourneyPlan.bind(this)
      );
    } catch (error: any) {
      console.error('Journey Plan Error:', error);
      throw error;
    }
  }

  async getScreenDesign(request: LLMRequest & { 
    step: JourneyStep; 
    currentStepIndex: number;
  }): Promise<ScreenDesignResponse> {
    try {
      if (!request.step || !request.step.step_id) {
        throw new Error('Invalid step data provided to screen design generator');
      }
  
      console.log('\nGenerating screen design for step:', request.step.step_id);
      const prompt = generateScreenDesignPrompt(
        request.persona,
        request.step,
        request.userData || {},
        request.currentStepIndex
      );
      const jsonResponse = await this.makeOpenAIRequest(prompt);
      
      // THIS IS THE CORRECTED LOGIC
      const validator = request.persona.llm_strategy === 'clarity'
        ? this.validateChatResponse.bind(this)
        : this.validateScreenDesign.bind(this);
        
      return await this.processLLMResponse<ScreenDesignResponse>(
        jsonResponse,
        validator
      );
    } catch (error: any) {
      console.error('Screen Design Error:', error);
      throw error;
    }
  }

  private validateJourneyPlan(plan: any): boolean {
    try {
      console.log('\nValidating journey plan...');
      if (!plan || !plan.journey_plan || !plan.rationale) return false;
      if (!Array.isArray(plan.journey_plan) || plan.journey_plan.length === 0) return false;
      console.log('Journey plan validation successful');
      return true;
    } catch {
      return false;
    }
  }

  private validateScreenDesign(design: any): boolean {
    try {
      console.log('\nValidating screen design (form)...');
      const hasRequiredKeys = ['screen_title', 'layout', 'components', 'actions', 'analytics'].every(
        key => key in design
      );
      if (!hasRequiredKeys) return false;
      console.log('Screen design validation successful');
      return true;
    } catch {
      return false;
    }
  }

  // NEW VALIDATION FUNCTION FOR CHAT RESPONSES
  private validateChatResponse(response: any): boolean {
    try {
      console.log('\nValidating screen design (chat)...');
      if (!response || !response.chat_response) return false;
      const { bot_message, field_id } = response.chat_response;
      if (typeof bot_message !== 'string' || typeof field_id !== 'string' || field_id === 'undefined') return false;
      console.log('Chat response validation successful');
      return true;
    } catch {
      return false;
    }
  }

  private createServiceError(type: keyof typeof LLM_ERRORS, message: string): LLMServiceError {
    const error = new Error(message) as LLMServiceError;
    error.type = type;
    return error;
  }
}