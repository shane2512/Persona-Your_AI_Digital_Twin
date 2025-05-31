import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = req.body;

    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const formattedText = text
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n');
    
    res.json({ advice: formattedText });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate advice',
      details: error.message 
    });
  }
}