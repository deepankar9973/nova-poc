import OpenAI from 'openai';
import { LLM_CONFIG, LLM_ERRORS } from './config';
import { generateJourneyPlanPrompt, generateScreenDesignPrompt } from './prompts';
import { LLMRequest, LLMResponse, ScreenDesignResponse, LLMServiceError } from './types';

// Initialize the OpenAI client using the API key from our .env.local file
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined. Please add it to your .env.local file.");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class LLMService {
  // This is our new, single function to handle all requests to the OpenAI API
  private async makeOpenAIRequest(prompt: string): Promise<string> {
    try {
      console.log('\nMaking request to OpenAI API...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // A fast, cheap, and very reliable model for this task
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        // This is the key feature: it forces the model to output valid JSON
        response_format: { type: "json_object" },
      });

      const jsonContent = response.choices[0].message.content;
      
      if (!jsonContent) {
        throw this.createServiceError('PARSE_ERROR', "OpenAI returned an empty response.");
      }
      
      console.log('\nReceived valid JSON response from OpenAI.');
      return jsonContent;

    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw this.createServiceError('CONNECTION', `Failed to communicate with OpenAI: ${error.message}`);
    }
  }

  // Our response processor is now MUCH simpler. No more cleaning needed!
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
    } catch (error) {
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
    } catch (error) {
      console.error('Journey Plan Error:', error);
      throw error;
    }
  }

  async getScreenDesign(request: LLMRequest & { step: any }): Promise<ScreenDesignResponse> {
    try {
      console.log('\nGenerating screen design for step:', request.step.step_id);
      const prompt = generateScreenDesignPrompt(request.persona, request.step, request.userData || {});
      const jsonResponse = await this.makeOpenAIRequest(prompt);
      return await this.processLLMResponse<ScreenDesignResponse>(
        jsonResponse,
        this.validateScreenDesign.bind(this)
      );
    } catch (error) {
      console.error('Screen Design Error:', error);
      throw error;
    }
  }

  // The validation functions are still crucial to ensure the LLM follows our business logic.
  private validateJourneyPlan(plan: any): boolean {
    // ... your existing validation code here ...
    // This function is still needed and does not need to change.
    try {
        console.log('\nValidating journey plan...');
        if (!plan || !plan.journey_plan || !plan.rationale) return false;
        if (!Array.isArray(plan.journey_plan) || plan.journey_plan.length === 0) return false;
        console.log('Journey plan validation successful');
        return true;
    } catch { return false; }
  }

  private validateScreenDesign(design: any): boolean {
    // ... your existing validation code here ...
    // This function is still needed and does not need to change.
    try {
        console.log('\nValidating screen design...');
        const hasRequiredKeys = ['screen_title', 'layout', 'components', 'actions', 'analytics'].every(key => key in design);
        if (!hasRequiredKeys) return false;
        console.log('Screen design validation successful');
        return true;
    } catch { return false; }
  }

  private createServiceError(type: keyof typeof LLM_ERRORS, message: string): LLMServiceError {
    const error = new Error(message) as LLMServiceError;
    error.type = type;
    return error;
  }
}