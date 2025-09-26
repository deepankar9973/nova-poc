import { Persona } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'power-user',
    name: 'Priya, the Power User',
    description: '28, Salaried Tech Pro. High digital fluency.',
    age: 28,
    occupation: 'Tech Professional',
    ux_goal: 'Fastest path to best offer',
    llm_strategy: 'efficiency',
    key_ui_traits: [
      'Minimalist copy',
      'keyboard-friendly',
      'intuitive controls',
      'sliders',
      'chips'
    ]
  },
  {
    id: 'cautious-first-timer',
    name: 'Rajesh, the Cautious First-Timer',
    description: '45, Small Business Owner. Apprehensive about online finance.',
    age: 45,
    occupation: 'Small Business Owner',
    ux_goal: 'Feel safe and understand every step',
    llm_strategy: 'reassurance',
    key_ui_traits: [
      'Detailed helper text',
      'progress bars',
      'security badges',
      'explicit inputs',
      'radio buttons'
    ]
  },
  {
    id: 'urgent-borrower',
    name: 'Amit, the Urgent Borrower',
    description: '32, Sales Executive. Needs funds quickly for a medical emergency.',
    age: 32,
    occupation: 'Sales Executive',
    ux_goal: 'Get money, now. Minimize all friction.',
    llm_strategy: 'velocity',
    key_ui_traits: [
      'Single-focus screens',
      'large CTAs',
      'pre-filled data',
      'time estimates',
      '2 mins left indicators'
    ]
  },
  {
    id: 'freelance-explorer',
    name: 'Sunita, the Freelance Explorer',
    description: '35, Freelance Designer. Variable income, exploring future options.',
    age: 35,
    occupation: 'Freelance Designer',
    ux_goal: 'Understand eligibility without commitment',
    llm_strategy: 'exploration',
    key_ui_traits: [
      'Interactive calculators',
      'Save for Later',
      'clear exit points',
      'comparison views',
      'flexible input options'
    ]
  },
  {
    id: 'privacy-conscious',
    name: 'Neha, the Privacy-Conscious Pro',
    description: '30, Finance Analyst. Highly aware of data security.',
    age: 30,
    occupation: 'Finance Analyst',
    ux_goal: 'Control data sharing and understand usage',
    llm_strategy: 'control',
    key_ui_traits: [
      'Masked fields by default',
      'explicit consent checkboxes',
      'info icons',
      'data usage explanations',
      'security indicators'
    ]
  },
  {
    id: 'accessibility-first',
    name: 'Arjun, the Accessibility-First User',
    description: '50, Shop Owner. Low digital literacy, needs assistance.',
    age: 50,
    occupation: 'Shop Owner',
    ux_goal: 'A simple, error-free, and clear process',
    llm_strategy: 'clarity',
    key_ui_traits: [
      'Large fonts',
      'high-contrast theme',
      'simple language',
      'Hinglish option',
      'icons with labels'
    ]
  }
];