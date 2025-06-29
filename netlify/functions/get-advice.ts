import { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the correct environment variable for Netlify Functions
const claudeApiKey = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
  console.log('get-advice function called with method:', event.httpMethod);
  console.log('Request body:', event.body);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = requestBody;

    console.log('Parsed request data:', { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision });

    // Validate required fields for reflection generation
    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      console.error('Missing required fields:', { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision });
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false,
          error: 'Missing required fields for reflection generation',
          advice: '',
          received: { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision }
        })
      };
    }

    const prompt = `As a wise and empathetic AI advisor, analyze these personal inputs and provide clear, actionable guidance:

Core Values: ${Array.isArray(coreValues) ? coreValues.join(', ') : coreValues}
Life Goals: ${Array.isArray(lifeGoals) ? lifeGoals.join(', ') : lifeGoals}
Current Struggles: ${Array.isArray(currentStruggles) ? currentStruggles.join(', ') : currentStruggles}
Ideal Self Vision: ${idealSelf}
Current Decision: ${currentDecision}

Please provide a thoughtful response with:

**Value Alignment Analysis**
How do the current struggles and decision relate to their core values? What tensions or alignments do you see?

**Practical Action Steps**
• Three specific, actionable steps they can take to address their current struggles
• Each step should be concrete and achievable within the next 2-4 weeks
• Connect each step to their stated values and goals

**Decision Framework**
Based on their values and ideal self vision, provide a clear framework for approaching their current decision. What questions should they ask themselves? What criteria should guide their choice?

**Growth Perspective**
How can this current challenge become a stepping stone toward their ideal self? What opportunities for growth do you see?

Keep the response under 500 words, use clear formatting with headers, and maintain an encouraging yet realistic tone.`;

    let responseText = '';
    let aiProvider = '';

    // Try Claude first if API key is available
    if (claudeApiKey && claudeApiKey !== 'your_claude_api_key_here' && claudeApiKey.trim() !== '') {
      try {
        console.log('Attempting to use Claude API...');
        const anthropic = new Anthropic({
          apiKey: claudeApiKey,
        });

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        });
        
        responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        aiProvider = 'Claude Sonnet 4';
        console.log('Claude API response received successfully');
      } catch (claudeError: any) {
        console.error('Claude API failed:', claudeError);
        // Fall through to try Gemini
      }
    }

    // Try Gemini if Claude failed or is not available
    if (!responseText && geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here' && geminiApiKey.trim() !== '') {
      try {
        console.log('Attempting to use Gemini API...');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        aiProvider = 'Gemini 2.0 Flash';
        console.log('Gemini API response received successfully');
      } catch (geminiError: any) {
        console.error('Gemini API failed:', geminiError);
        // Fall through to fallback
      }
    }

    // If both APIs failed, provide a structured fallback
    if (!responseText || responseText.trim().length === 0) {
      console.log('Both AI APIs failed, using structured fallback');
      responseText = generateStructuredFallback(coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision);
      aiProvider = 'Structured Guidance System';
    }
    
    console.log('Final response generated by:', aiProvider);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        advice: responseText.trim(),
        provider: aiProvider,
        error: null
      })
    };
  } catch (error: any) {
    console.error('Error in get-advice function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate advice';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'AI API configuration issue';
      statusCode = 200; // Return 200 with error flag for consistent handling
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 200;
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection.';
      statusCode = 200;
    }
    
    // Generate fallback advice even on error
    const fallbackAdvice = generateBasicFallback();
    
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: errorMessage,
        advice: fallbackAdvice,
        provider: 'Fallback System',
        details: error.message
      })
    };
  }
};

function generateStructuredFallback(coreValues: any, lifeGoals: any, currentStruggles: any, idealSelf: string, currentDecision: string): string {
  const values = Array.isArray(coreValues) ? coreValues : [coreValues];
  const goals = Array.isArray(lifeGoals) ? lifeGoals : [lifeGoals];
  const struggles = Array.isArray(currentStruggles) ? currentStruggles : [currentStruggles];

  return `# Your Personal Reflection Analysis

**Value Alignment Analysis**
Your core values of ${values.join(', ')} provide a strong foundation for decision-making. When facing your current struggles with ${struggles.join(', ')}, consider how each challenge might actually be an opportunity to live more authentically according to these values.

**Practical Action Steps**
• **Week 1-2**: Focus on one specific struggle at a time. Break it down into smaller, manageable tasks that align with your values.
• **Week 3-4**: Take concrete steps toward your goals: ${goals.join(', ')}. Set specific, measurable milestones.
• **Ongoing**: Regular self-reflection sessions to assess progress and adjust your approach based on what you learn.

**Decision Framework**
When considering "${currentDecision}", ask yourself:
1. Which option best honors your core values of ${values.join(', ')}?
2. Which choice moves you closer to your ideal self: "${idealSelf}"?
3. What would you regret not trying?
4. How does each option support your long-term goals?

**Growth Perspective**
Your current challenges are stepping stones toward becoming the person you envision: someone who ${idealSelf.toLowerCase()}. Every struggle you face now is building the resilience, wisdom, and character needed for your future self.

Remember: Growth happens in the space between where you are and where you want to be. Trust the process and be patient with yourself.

*Generated by Structured Guidance System*`;
}

function generateBasicFallback(): string {
  return `# Personal Reflection Guidance

**Self-Discovery Process**
Take time to reflect on what truly matters to you. Your values are your compass - they should guide every important decision you make.

**Action-Oriented Approach**
• Start with small, consistent actions that align with your goals
• Focus on progress, not perfection
• Celebrate small wins along the way

**Decision-Making Framework**
When facing difficult choices:
1. Consider your long-term vision for yourself
2. Think about what you'll be proud of in 5 years
3. Choose the path that feels most authentic to who you are

**Growth Mindset**
Challenges are opportunities for growth. Every struggle teaches you something valuable about yourself and builds your resilience for the future.

Trust yourself - you have more wisdom than you realize.

*Generated by Fallback Guidance System*`;
}

export { handler };