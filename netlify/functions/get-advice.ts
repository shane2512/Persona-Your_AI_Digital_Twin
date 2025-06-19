import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the correct environment variable for Netlify Functions
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyDdN9F95t_E7Zx4X6M8rMWaCvmbPOgRyuk';
const genAI = new GoogleGenerativeAI(apiKey);

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
          error: 'Missing required fields for reflection generation',
          received: { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision }
        })
      };
    }

    // Validate API key
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Gemini API key not configured properly');
    }

    const prompt = `As a concise AI advisor, analyze these inputs and provide clear, actionable advice:

Core Values: ${Array.isArray(coreValues) ? coreValues.join(', ') : coreValues}
Life Goals: ${Array.isArray(lifeGoals) ? lifeGoals.join(', ') : lifeGoals}
Struggles: ${Array.isArray(currentStruggles) ? currentStruggles.join(', ') : currentStruggles}
Ideal Self: ${idealSelf}
Decision: ${currentDecision}

Provide a focused response with:
1. Value alignment analysis (2-3 sentences)
2. Practical steps for current challenges (3 bullet points)
3. Decision framework based on values (2-3 sentences)

Keep the total response under 400 words and use clear formatting.`;

    console.log('Generated prompt:', prompt);

    const model = genAI.getGenerativeModel({ 
      model: process.env.MODEL_NAME || "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });
    
    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API response received:', text);
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }
    
    const formattedText = text
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n');
    
    console.log('Formatted response:', formattedText);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        advice: formattedText,
        success: true 
      })
    };
  } catch (error: any) {
    console.error('Error in get-advice function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate advice';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'API key configuration error';
      statusCode = 401;
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection.';
      statusCode = 503;
    }
    
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        success: false
      })
    };
  }
};

export { handler };