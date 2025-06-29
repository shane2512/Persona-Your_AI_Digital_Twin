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
        body: JSON.stringify({ 
          success: false,
          error: 'Message is required',
          response: ''
        })
      };
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

    console.log('Generated chat prompt for AI');

    let responseText = '';
    let aiProvider = '';

    // Try Claude first if API key is available
    if (claudeApiKey && claudeApiKey !== 'your_claude_api_key_here' && claudeApiKey.trim() !== '') {
      try {
        console.log('Attempting to use Claude API for chat...');
        const anthropic = new Anthropic({
          apiKey: claudeApiKey,
        });

        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 512,
          temperature: 0.8,
          messages: [
            {
              role: "user",
              content: fullPrompt
            }
          ]
        });
        
        responseText = response.content[0].type === 'text' ? response.content[0].text : '';
        aiProvider = 'Claude';
        console.log('Claude chat response received');
      } catch (claudeError: any) {
        console.error('Claude chat API failed:', claudeError);
        // Fall through to try Gemini
      }
    }

    // Try Gemini if Claude failed or is not available
    if (!responseText && geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here' && geminiApiKey.trim() !== '') {
      try {
        console.log('Attempting to use Gemini API for chat...');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        responseText = response.text();
        aiProvider = 'Gemini';
        console.log('Gemini chat response received');
      } catch (geminiError: any) {
        console.error('Gemini chat API failed:', geminiError);
        // Fall through to fallback
      }
    }

    // If both APIs failed, provide contextual fallback responses
    if (!responseText || responseText.trim().length === 0) {
      console.log('Both AI APIs failed, using contextual fallback');
      responseText = generateContextualFallback(message);
      aiProvider = 'Fallback Assistant';
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        response: responseText.trim(),
        provider: aiProvider,
        error: null,
        fallback: aiProvider === 'Fallback Assistant'
      })
    };
  } catch (error: any) {
    console.error('Error in chat function:', error);
    
    // Provide contextual fallback responses
    const fallbackResponse = generateContextualFallback(
      JSON.parse(event.body || '{}').message || 'general'
    );
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        response: fallbackResponse,
        provider: 'Fallback Assistant',
        error: 'Service temporarily unavailable',
        fallback: true
      })
    };
  }
};

function generateContextualFallback(message: string): string {
  const userInput = message.toLowerCase();
  
  if (userInput.includes('value')) {
    return "Values are the compass that guides our decisions. What principles matter most to you in life? Understanding your core values can help you make choices that feel authentic and fulfilling.";
  } else if (userInput.includes('goal')) {
    return "Goals give us direction and purpose. What dreams are you working toward? Sometimes breaking big goals into smaller, actionable steps makes them feel more achievable.";
  } else if (userInput.includes('struggle') || userInput.includes('difficult') || userInput.includes('problem')) {
    return "Struggles are part of growth. What challenges are you facing right now? Remember, every obstacle is an opportunity to learn something new about yourself.";
  } else if (userInput.includes('decision') || userInput.includes('choose') || userInput.includes('choice')) {
    return "Decisions can feel overwhelming. What choice are you trying to make? Sometimes it helps to consider which option aligns best with your values and long-term goals.";
  } else if (userInput.includes('stress') || userInput.includes('anxious') || userInput.includes('worried')) {
    return "It's natural to feel stressed sometimes. What's weighing on your mind? Taking a step back and focusing on what you can control often helps bring clarity.";
  } else if (userInput.includes('future') || userInput.includes('plan')) {
    return "Planning for the future shows great self-awareness. What vision do you have for yourself? Remember, the future is built through the choices we make today.";
  } else if (userInput.includes('relationship') || userInput.includes('friend') || userInput.includes('family')) {
    return "Relationships are such an important part of our lives. What's happening in your relationships that you'd like to explore? Sometimes understanding our own needs helps us connect better with others.";
  } else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
    return "Hello! I'm here to help you reflect and explore your thoughts. What's been on your mind lately? Whether it's about decisions, goals, or just life in general, I'm here to listen and offer support.";
  } else {
    return "I'm here to help you reflect and explore your thoughts. What's been on your mind lately? Feel free to share what you're thinking about - whether it's a decision you're facing, goals you're working toward, or anything else that's important to you.";
  }
}

export { handler };