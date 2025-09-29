import { LLM_CONFIG, LLM_ERRORS, VALIDATION_CONFIG } from './config';
import { generateJourneyPlanPrompt, generateScreenDesignPrompt } from './prompts';
import { 
  LLMRequest, 
  LLMResponse, 
  ScreenDesignResponse, 
  OllamaResponse,
  JourneyStep,
  LLMServiceError,
  ValidationConfig
} from './types';

export class LLMService {
    private async makeRequest(prompt: string, attempt: number = 1): Promise<OllamaResponse> {
      try {
        console.log(`\nMaking request (Attempt ${attempt}/${LLM_CONFIG.retry.maxAttempts})`);
        console.log('Request config:', {
          model: LLM_CONFIG.model,
          temperature: LLM_CONFIG.temperature,
          max_tokens: LLM_CONFIG.maxTokens
        });
  
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), LLM_CONFIG.timeout);
  
        const response = await fetch(`${LLM_CONFIG.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: LLM_CONFIG.model,
            prompt,
            temperature: LLM_CONFIG.temperature,
            max_tokens: LLM_CONFIG.maxTokens,
            stream: false // Ensure we get complete response
          }),
          signal: controller.signal
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          throw this.createServiceError('CONNECTION', `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('\nReceived response:', {
          model: data.model,
          created_at: data.created_at,
          response_length: data.response?.length || 0
        });
  
        return data as OllamaResponse;
      } catch (error) {
        console.error(`\nRequest failed (Attempt ${attempt}):`, error);
  
        if (error.name === 'AbortError') {
          throw this.createServiceError('TIMEOUT', `Request timed out after ${LLM_CONFIG.timeout}ms`);
        }
  
        if (attempt < LLM_CONFIG.retry.maxAttempts) {
          const delay = Math.min(
            LLM_CONFIG.retry.initialDelay * Math.pow(2, attempt - 1),
            LLM_CONFIG.retry.maxDelay
          );
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makeRequest(prompt, attempt + 1);
        }
  
        throw this.createServiceError(
          'RETRY_FAILED',
          `Failed after ${attempt} attempts: ${error.message}`
        );
      }
    }
  
    private async processLLMResponse<T>(
        response: OllamaResponse,
        validator: (data: any) => boolean
    ): Promise<T> {
        try {
            console.log('\nProcessing LLM response...');
            let responseText = response.response;
            console.log('Raw response preview:', responseText.substring(0, 100) + '...');
    
            // 1. Remove markdown and trim
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
            // 2. Extract JSON object
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}');
            
            if (jsonStart === -1 || jsonEnd === -1) {
                console.error('No JSON object found in response');
                throw this.createServiceError('PARSE_ERROR', 'No valid JSON found in response');
            }
    
            let jsonStr = responseText.slice(jsonStart, jsonEnd + 1);
    
            // --- THE FIX IS HERE ---
            // 3. Clean common structural and value errors before parsing
            
            // Fix missing comma between array and next key
            jsonStr = jsonStr.replace(/```\s*"/g, '], "');
            
            // Remove trailing commas
            jsonStr = jsonStr.replace(/,\s*([}```])/g, '$1');
    
            // NEW: Remove invalid code-like boolean values
            // This looks for keys like "disabled": !isFormValid() and replaces the value with a valid boolean `false`
            jsonStr = jsonStr.replace(/:(\s*)!isFormValidKATEX_INLINE_OPENKATEX_INLINE_CLOSE/g, '": false');
    
            console.log('\nCleaned & Extracted JSON string (preview):', jsonStr.substring(0, 100) + '...');
    
            try {
                const result = JSON.parse(jsonStr);
                console.log('\nJSON parsed successfully');
    
                // Structural Integrity Check: Ensure 'rationale' is not inside a step
                if (result.journey_plan && result.journey_plan.some((step: any) => step.rationale)) {
                    console.error("Validation failed: 'rationale' object found inside a journey step.");
                    throw this.createServiceError('VALIDATION', "Structural error: 'rationale' should be at the top level.");
                }
    
                if (!validator(result)) {
                    console.error('Validation failed for parsed JSON:', result);
                    throw this.createServiceError('VALIDATION', 'Invalid response format from LLM');
                }
    
                return result as T;
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Attempted to parse this string:', jsonStr);
                throw this.createServiceError('PARSE_ERROR', 'Failed to parse LLM response as JSON');
            }
        } catch (error) {
            if ((error as LLMServiceError).type) {
                throw error;
            }
            throw this.createServiceError('PARSE_ERROR', `An unexpected error occurred during processing: ${error.message}`);
        }
    }
    async getJourneyPlan(request: LLMRequest): Promise<LLMResponse> {
      try {
        console.log('\nGenerating journey plan for:', request.persona.name);
        console.log('Strategy:', request.persona.llm_strategy);
        
        const prompt = generateJourneyPlanPrompt(request.persona);
        console.log('Prompt length:', prompt.length);
        
        const response = await this.makeRequest(prompt);
        return await this.processLLMResponse<LLMResponse>(
          response,
          this.validateJourneyPlan.bind(this)
        );
      } catch (error) {
        const serviceError = error as LLMServiceError;
        console.error('Journey Plan Error:', serviceError);
        throw serviceError;
      }
    }

    async getScreenDesign(
        request: LLMRequest & { step: any }
    ): Promise<ScreenDesignResponse> {
        try {
            console.log('\nGenerating screen design for step:', request.step.step_id);
            console.log('Strategy:', request.persona.llm_strategy);
            
            const prompt = generateScreenDesignPrompt(
                request.persona,
                request.step,
                request.userData || {}
            );
            console.log('Prompt length:', prompt.length);
            
            const response = await this.makeRequest(prompt);
            return await this.processLLMResponse<ScreenDesignResponse>(
                response,
                this.validateScreenDesign.bind(this)
            );
        } catch (error) {
            const serviceError = error as LLMServiceError;
            console.error('Screen Design Error:', serviceError);
            throw serviceError;
        }
    }

    private validateJourneyPlan(plan: any): boolean {
        // This validation function is already good and should work with the fixed JSON.
        try {
            console.log('\nValidating journey plan...');
            if (!plan || typeof plan !== 'object' || !Array.isArray(plan.journey_plan) || plan.journey_plan.length === 0 || !plan.rationale) {
                return false;
            }
            const allStepsValid = plan.journey_plan.every((step: any) => 
                typeof step.step_id === 'string' &&
                typeof step.screen_type === 'string' &&
                Array.isArray(step.required_fields) &&
                typeof step.ui_preferences === 'object'
            );
            const validRationale = typeof plan.rationale.strategy_alignment === 'string';
            if (allStepsValid && validRationale) {
              console.log('Journey plan validation successful');
              return true;
            }
            return false;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }

    private validateScreenDesign(design: any): boolean {
        // This validation function is also good.
        try {
            console.log('\nValidating screen design...');
            const hasRequiredFields = ['screen_title', 'layout', 'components', 'actions'].every(field => field in design);
            if (!hasRequiredFields) return false;

            const hasAllFields = hasRequiredFields && design.components.length > 0 && design.actions.primary;
            if (hasAllFields) {
              console.log('Screen design validation successful');
              return true;
            }
            return false;
        } catch (error) {
            console.error('Screen design validation error:', error);
            return false;
        }
    }

    private validateComponent(component: any): boolean {
        return (
            component &&
            typeof component.component_type === 'string' &&
            typeof component.props === 'object' &&
            component.position
        );
    }

    private createServiceError(type: keyof typeof LLM_ERRORS, message: string): LLMServiceError {
        const error = new Error(message) as LLMServiceError;
        error.type = type;
        return error;
    }
}