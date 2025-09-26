import { LLMService } from './service';
import { Persona } from '@/frontend/features/loan-journey/types';

// Sample persona for testing
const testPersona: Persona = {
    id: 'test-power-user',
    name: 'Priya, the Power User',
    description: '28, Salaried Tech Pro. High digital fluency.',
    age: 28,
    occupation: 'Tech Professional',
    ux_goal: 'Fastest path to best offer',
    llm_strategy: 'efficiency',
    key_ui_traits: [
        'Minimalist copy',
        'keyboard-friendly',
        'intuitive controls'
    ]
};

async function testLLMService() {
    const llmService = new LLMService();
    
    console.log('Starting LLM Service Test...\n');

    try {
        // Test 1: Journey Plan Generation
        console.log('Test 1: Generating Journey Plan');
        console.log('Using persona:', testPersona.name);
        
        const journeyPlan = await llmService.getJourneyPlan({ persona: testPersona });
        console.log('\nJourney Plan Response:');
        console.log(JSON.stringify(journeyPlan, null, 2));

        // Test 2: Screen Design Generation (if journey plan successful)
        if (journeyPlan.journey_plan.length > 0) {
            console.log('\nTest 2: Generating Screen Design');
            const screenDesign = await llmService.getScreenDesign({
                persona: testPersona,
                step: journeyPlan.journey_plan[0],
                userData: {}
            });
            console.log('\nScreen Design Response:');
            console.log(JSON.stringify(screenDesign, null, 2));
        }

    } catch (error) {
        console.error('\nTest Failed:', error);
    }
}

// Run the test
console.log('Running LLM Service Tests...');
testLLMService();