import { LLMConfig } from './types';

export const LLM_CONFIG: LLMConfig = {
  model: 'llama2',
  baseUrl: 'http://localhost:11434/api',
  temperature: 0.7,
  maxTokens: 1000
};

// Available components for UI generation
export const AVAILABLE_COMPONENTS = [
  'Header',
  'BodyText',
  'InputField',
  'Slider',
  'ChipGroup',
  'RadioButtonGroup',
  'CTAButton'
] as const;