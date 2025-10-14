import { LLMService } from './service';
import { LLM_CONFIG } from './config';

async function testOllamaConnection() {
    try {
        const response = await fetch('http://localhost:11434/api/version');
        const version = await response.json();
        console.log('✅ Ollama connection successful:', version);
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to Ollama:', error);
        return false;
    }
}

async function testModelResponse() {
    console.log('Testing model response...');
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama2:latest",  // Use exact model name
                prompt: "Say 'test successful'",
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Model test response:', result);
        return true;
    } catch (error) {
        console.error('Model test failed:', error);
        return false;
    }
}

async function testLLMService() {
    console.log('\n🚀 Starting LLM test...');
    console.log('Configuration:', {
        model: LLM_CONFIG.model,
        baseUrl: LLM_CONFIG.baseUrl
    });

    // Check Ollama connection
    const isConnected = await testOllamaConnection();
    if (!isConnected) {
        console.error('❌ Cannot proceed: Ollama is not running');
        return;
    }

    // Test model response
    console.log('\nTesting model availability...');
    const isModelResponding = await testModelResponse();
    if (!isModelResponding) {
        console.error('❌ Model is not responding correctly');
        console.log('\nTroubleshooting steps:');
        console.log('1. Make sure Ollama is running: ollama run llama2:latest');
        console.log('2. Try in another terminal: ollama run llama2:latest');
        console.log('3. Check model status: ollama list');
        return;
    }

    const llmService = new LLMService();
    
    try {
        console.log('\n📝 Testing Journey Plan Generation...');
        
        const testPersona = {
            id: 'test-power-user',
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
        };

        console.log('Using test persona:', testPersona.name);
        
        const journeyPlan = await llmService.getJourneyPlan({ persona: testPersona });
        console.log('\n✅ Journey Plan Response:');
        console.log(JSON.stringify(journeyPlan, null, 2));
        
    } catch (error) {
        console.error('\n❌ Test Failed:', error);
        process.exit(1);
    }
}

console.log('🔍 Running LLM Service Tests...');
testLLMService().catch(console.error);