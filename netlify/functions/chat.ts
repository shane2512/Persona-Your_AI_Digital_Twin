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
  console.log('chat function called with method:', event.httpMethod);
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
    const { message, userContext } = JSON.parse(event.body || '{}');

    console.log('Parsed chat data:', { message, userContext });

    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Validate API key
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Gemini API key not configured properly');
    }

    // Build context-aware prompt
    let systemPrompt = `You are a wise, empathetic AI reflection assistant. You help people with personal growth, self-reflection, and decision-making.`;
    
    if (userContext && userContext.length > 0) {
      const contextSummary = userContext.map((reflection: any) => {
        const coreValues = reflection.core_values || reflection.userData?.coreValues || [];
        const lifeGoals = reflection.life_goals || reflection.userData?.lifeGoals || [];
        const struggles = reflection.current_struggles || reflection.userData?.currentStruggles || [];
        
        return `Previous reflection: Values: ${Array.isArray(coreValues) ? coreValues.join(', ') : 'None'}, Goals: ${Array.isArray(lifeGoals) ? lifeGoals.join(', ') : 'None'}, Struggles: ${Array.isArray(struggles) ? struggles.join(', ') : 'None'}`;
      }).join('\n');
      
      systemPrompt += `\n\nUser's reflection history:\n${contextSummary}\n\nUse this context to provide personalized, relevant advice.`;
    }

    const fullPrompt = `${systemPrompt}

User's message: "${message}"

Provide a thoughtful, empathetic response that:
1. Acknowledges their message and any relevant context
2. Offers practical, actionable advice
3. Encourages self-reflection and growth
4. Maintains a supportive, conversational tone
5. Keeps the response under 200 words

Respond as if you're having a caring conversation with someone who trusts you with their personal growth journey.`;

    console.log('Generated chat prompt:', fullPrompt);

    const model = genAI.getGenerativeModel({ 
      model: process.env.MODEL_NAME || "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      }
    });
    
    console.log('Calling Gemini API for chat...');
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini chat response received:', text);
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        response: text.trim(),
        success: true 
      })
    };
  } catch (error: any) {
    console.error('Error in chat function:', error);
    
    // Provide contextual fallback responses
    const fallbackResponses = [
      "I'm here to help you reflect and explore your thoughts. What's been on your mind lately?",
      "That's an interesting perspective. How do you feel about that situation?",
      "It sounds like you're working through something important. What aspects matter most to you?",
      "Personal growth often comes through challenges. What have you learned about yourself recently?",
      "Values and goals can guide us through difficult decisions. What principles are most important to you?"
    ];
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        response: fallbackResponse,
        success: false,
        fallback: true
      })
    };
  }
};

export { handler };