import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || 'gemini-2.0-flash';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

const handler: Handler = async (event) => {
  // Handle preflight requests
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
      body: JSON.stringify({ 
        error: 'Method not allowed',
        details: 'Only POST requests are supported'
      })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = JSON.parse(event.body);

    // Validate required fields
    if (!coreValues?.length || !lifeGoals?.length || !currentStruggles?.length || !idealSelf || !currentDecision) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            coreValues: !coreValues?.length ? 'Core values are required' : null,
            lifeGoals: !lifeGoals?.length ? 'Life goals are required' : null,
            currentStruggles: !currentStruggles?.length ? 'Current struggles are required' : null,
            idealSelf: !idealSelf ? 'Ideal self description is required' : null,
            currentDecision: !currentDecision ? 'Current decision is required' : null
          }
        })
      };
    }

    const prompt = `As a concise AI advisor, analyze these inputs and provide clear, actionable advice:

Core Values: ${coreValues.join(', ')}
Life Goals: ${lifeGoals.join(', ')}
Struggles: ${currentStruggles.join(', ')}
Ideal Self: ${idealSelf}
Decision: ${currentDecision}

Provide a focused response with:
1. Value alignment analysis (2-3 sentences)
2. Practical steps for current challenges (3 bullet points)
3. Decision framework based on values (2-3 sentences)

Keep the total response under 400 words and use clear formatting.`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    
    const formattedText = text
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n');
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ advice: formattedText })
    };
  } catch (error: any) {
    console.error('Error generating advice:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid API key',
          details: 'Please check your Gemini API credentials'
        })
      };
    }

    if (error.message?.includes('rate limit')) {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Please try again in a few minutes'
        })
      };
    }

    if (error.message === 'Request body is required' || error.message?.includes('JSON')) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid request format',
          details: error.message
        })
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to generate advice',
        details: error.message || 'An unexpected error occurred'
      })
    };
  }
};

export { handler };