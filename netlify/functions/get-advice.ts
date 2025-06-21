import { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

// Use the correct environment variable for Netlify Functions
const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;

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

    // Check if Claude API key is configured
    if (!apiKey || apiKey === 'your_claude_api_key_here' || apiKey.trim() === '') {
      console.error('Claude API key not configured');
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false,
          error: 'AI API key missing',
          advice: ''
        })
      };
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

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

    console.log('Generated prompt for Claude');

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
    
    console.log('Claude API response received');
    
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Empty response from Claude API');
    }
    
    console.log('Formatted response:', responseText);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        advice: responseText.trim(),
        error: null
      })
    };
  } catch (error: any) {
    console.error('Error in get-advice function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate advice';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'AI API key missing';
      statusCode = 200; // Return 200 with error flag for consistent handling
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 200;
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection.';
      statusCode = 200;
    }
    
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: errorMessage,
        advice: '',
        details: error.message
      })
    };
  }
};

export { handler };