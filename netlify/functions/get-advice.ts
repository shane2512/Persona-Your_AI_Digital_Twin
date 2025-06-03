import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDdN9F95t_E7Zx4X6M8rMWaCvmbPOgRyuk');

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = JSON.parse(event.body || '{}');

    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      return {
        statusCode: 400,
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

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ advice: formattedText })
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate advice',
        details: error.message 
      })
    };
  }
};

export { handler };