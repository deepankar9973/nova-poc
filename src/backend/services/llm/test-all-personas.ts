import { LLMService } from './service';
import { Persona } from '@/frontend/features/loan-journey/types';

const ALL_PERSONAS: Persona[] = [
    {
        id: 'power-user',
        name: 'Priya, the Power User',
        description: '28, Salaried Tech Pro. High digital fluency.',
        age: 28,
        occupation: 'Tech Professional',
        ux_goal: 'Fastest path to best offer',
        llm_strategy: 'efficiency' as const,
        key_ui_traits: [
            'Minimalist copy',
            'keyboard-friendly',
            'intuitive controls'
        ]
    },
    {
        id: 'cautious-first-timer',
        name: 'Rajesh, the Cautious First-Timer',
        description: '45, Small Business Owner. Apprehensive about online finance.',
        age: 45,
        occupation: 'Small Business Owner',
        ux_goal: 'Feel safe and understand every step',
        llm_strategy: 'reassurance' as const,
        key_ui_traits: [
            'Detailed helper text',
            'progress bars',
            'security badges',
            'explicit inputs'
        ]
    },
    {
        id: 'urgent-borrower',
        name: 'Amit, the Urgent Borrower',
        description: '32, Sales Executive. Needs funds quickly for a medical emergency.',
        age: 32,
        occupation: 'Sales Executive',
        ux_goal: 'Get money, now. Minimize all friction.',
        llm_strategy: 'velocity' as const,
        key_ui_traits: [
            'Single-focus screens',
            'large CTAs',
            'pre-filled data',
            'time estimates'
        ]
    },
    {
        id: 'freelance-explorer',
        name: 'Sunita, the Freelance Explorer',
        description: '35, Freelance Designer. Variable income, exploring future options.',
        age: 35,
        occupation: 'Freelance Designer',
        ux_goal: 'Understand eligibility without commitment',
        llm_strategy: 'exploration' as const,
        key_ui_traits: [
            'Interactive calculators',
            'Save for Later',
            'clear exit points',
            'comparison views'
        ]
    },
    {
        id: 'privacy-conscious',
        name: 'Neha, the Privacy-Conscious Pro',
        description: '30, Finance Analyst. Highly aware of data security.',
        age: 30,
        occupation: 'Finance Analyst',
        ux_goal: 'Control data sharing and understand usage',
        llm_strategy: 'control' as const,
        key_ui_traits: [
            'Masked fields',
            'explicit consent checkboxes',
            'info icons',
            'data usage explanations'
        ]
    },
    {
        id: 'accessibility-first',
        name: 'Arjun, the Accessibility-First User',
        description: '50, Shop Owner. Low digital literacy, needs assistance.',
        age: 50,
        occupation: 'Shop Owner',
        ux_goal: 'A simple, error-free, and clear process',
        llm_strategy: 'clarity' as const,
        key_ui_traits: [
            'Large fonts',
            'high-contrast theme',
            'simple language',
            'icons with labels'
        ]
    }
];
    


async function testAllPersonas() {
    const llmService = new LLMService();
    
    console.log('🚀 Starting All Personas Test\n');

    for (const persona of ALL_PERSONAS) {
        console.log(`\n📋 Testing Persona: ${persona.name}`);
        console.log('Strategy:', persona.llm_strategy);
        console.log('UI Traits:', persona.key_ui_traits.join(', '));
        
        try {
            console.log('\n1️⃣ Generating Journey Plan...');
            const journeyPlan = await llmService.getJourneyPlan({ persona });
            
            console.log('\n✅ Journey Plan Generated Successfully');
            console.log('Number of steps:', journeyPlan.journey_plan.length);
            console.log('Journey Plan:', JSON.stringify(journeyPlan, null, 2));

            // Add delay between personas to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error('\n❌ Test Failed for', persona.name);
            console.error('Error:', error);
        }
        
        console.log('\n-----------------------------------');
    }
    
    console.log('\n🎉 All Persona Tests Completed!');
}

// Run the tests
console.log('🔍 Starting Persona Tests...');
testAllPersonas().catch(console.error);