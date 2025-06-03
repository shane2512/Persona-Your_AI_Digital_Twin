import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || 'gemini-2.0-flash';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
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
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = JSON.parse(event.body || '{}');

    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields' })
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
    
    const formattedText = text
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n');
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ advice: formattedText })
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to generate advice',
        details: error.message 
      })
    };
  }
};

export { handler };