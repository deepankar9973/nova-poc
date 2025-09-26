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
            
            // Extract JSON from the response
            const responseText = response.response;
            console.log('Raw response preview:', responseText.substring(0, 100) + '...');
    
            // Find JSON content
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}');
            
            if (jsonStart === -1 || jsonEnd === -1) {
                console.error('No JSON object found in response');
                throw this.createServiceError('PARSE_ERROR', 'No valid JSON found in response');
            }
    
            // Extract and clean JSON string
            let jsonStr = responseText.slice(jsonStart, jsonEnd + 1)
                // Fix common JSON formatting issues
                .replace(/```\s*"/, '],"')  // Fix missing comma after array
                .replace(/,\s*([}```])/g, '$1')  // Remove trailing commas
                .replace(/\n/g, ' ')  // Remove newlines
                .replace(/\s+/g, ' '); // Normalize spaces
    
            console.log('\nExtracted JSON string:', jsonStr.substring(0, 100) + '...');
    
            try {
                const result = JSON.parse(jsonStr);
                console.log('\nJSON parsed successfully');
    
                if (!validator(result)) {
                    console.error('Validation failed for parsed JSON:', result);
                    throw this.createServiceError('VALIDATION', 'Invalid response format from LLM');
                }
    
                return result as T;
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Attempted to parse:', jsonStr);
                throw this.createServiceError('PARSE_ERROR', 'Failed to parse LLM response as JSON');
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error('Syntax Error during JSON parsing:', error);
                throw this.createServiceError('PARSE_ERROR', 'Invalid JSON syntax in LLM response');
            }
            throw error;
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
        const serviceError = error instanceof Error ? error : 
          this.createServiceError('CONNECTION', 'Unknown error occurred');
        console.error('Journey Plan Error:', serviceError);
        throw serviceError;
      }
    }

    async getScreenDesign(
        request: LLMRequest & { step: any }  // Using 'any' temporarily for step
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
            const serviceError = error instanceof Error ? error : 
                this.createServiceError('CONNECTION', 'Unknown error occurred');
            console.error('Screen Design Error:', serviceError);
            throw serviceError;
        }
    }

    private validateJourneyPlan(plan: any): boolean {
        try {
            console.log('\nValidating journey plan...');
            
            // Check basic structure
            if (!plan || typeof plan !== 'object') {
                console.log('Invalid plan structure');
                return false;
            }
    
            // Check journey_plan array
            if (!Array.isArray(plan.journey_plan)) {
                console.log('journey_plan is not an array');
                return false;
            }
    
            if (plan.journey_plan.length === 0) {
                console.log('journey_plan is empty');
                return false;
            }
    
            // Validate each step
            const validStep = (step: any) => {
                const hasRequiredFields = 
                    typeof step.step_id === 'string' &&
                    typeof step.screen_type === 'string' &&
                    Array.isArray(step.required_fields) &&
                    Array.isArray(step.optional_fields) &&
                    typeof step.ui_preferences === 'object' &&
                    typeof step.next_step_condition === 'string';
    
                if (!hasRequiredFields) {
                    console.log('Step missing required fields:', step);
                    return false;
                }
    
                // Validate UI preferences
                const validPreferences = step.ui_preferences &&
                    typeof step.ui_preferences.layout === 'string' &&
                    Array.isArray(step.ui_preferences.component_preferences) &&
                    typeof step.ui_preferences.validation_strategy === 'string' &&
                    typeof step.ui_preferences.helper_text_level === 'string';
    
                if (!validPreferences) {
                    console.log('Invalid UI preferences:', step.ui_preferences);
                    return false;
                }
    
                return true;
            };
    
            // Check all steps
            const allStepsValid = plan.journey_plan.every((step: any, index: number) => {
                const isValid = validStep(step);
                if (!isValid) {
                    console.log(`Invalid step at index ${index}`);
                }
                return isValid;
            });
    
            if (!allStepsValid) {
                return false;
            }
    
            // Validate rationale
            const validRationale = 
                plan.rationale &&
                typeof plan.rationale.strategy_alignment === 'string' &&
                typeof plan.rationale.ux_considerations === 'string' &&
                typeof plan.rationale.accessibility_notes === 'string';
    
            if (!validRationale) {
                console.log('Invalid rationale structure');
                return false;
            }
    
            console.log('Journey plan validation successful');
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }

  private validateScreenDesign(design: any): boolean {
    try {
        console.log('\nValidating screen design...');
        
        // Check basic structure
        if (!design || typeof design !== 'object') {
            console.log('Invalid design structure');
            return false;
        }

        // Check required fields
        const requiredFields = [
            'screen_title',
            'layout',
            'components',
            'actions'
        ];

        const hasAllFields = requiredFields.every(field => {
            const hasField = field in design;
            if (!hasField) console.log(`Missing required field: ${field}`);
            return hasField;
        });

        if (!hasAllFields) return false;

        // Validate layout
        if (!design.layout || !design.layout.type || !design.layout.spacing) {
            console.log('Invalid layout structure');
            return false;
        }

        // Validate components array
        if (!Array.isArray(design.components)) {
            console.log('Components is not an array');
            return false;
        }

        if (design.components.length === 0) {
            console.log('Components array is empty');
            return false;
        }

        // Validate each component
        const validComponents = design.components.every((comp: any, index: number) => {
            const isValid = this.validateComponent(comp);
            if (!isValid) {
                console.log(`Invalid component at index ${index}`);
            }
            return isValid;
        });

        if (!validComponents) return false;

        // Validate actions
        if (!design.actions.primary) {
            console.log('Missing primary action');
            return false;
        }

        console.log('Screen design validation successful');
        return true;
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
        component.position &&
        (!component.validations || 
            Object.keys(component.validations).length <= VALIDATION_CONFIG.maxValidationRules)
    );
}

  private createServiceError(type: keyof typeof LLM_ERRORS, message: string): LLMServiceError {
    const error = new Error(message) as LLMServiceError;
    error.type = type;
    return error;
  }
}