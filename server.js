import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/get-advice', async (req, res) => {
  try {
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = req.body;

    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `As an advanced AI mentor, analyze the following personal information and provide deep, actionable insights:

CORE VALUES: ${coreValues.join(', ')}
LIFE GOALS: ${lifeGoals.join(', ')}
CURRENT STRUGGLES: ${currentStruggles.join(', ')}
IDEAL SELF VISION: ${idealSelf}
CURRENT DECISION: ${currentDecision}

Provide a comprehensive analysis that includes:
1. How your core values align with your current decision
2. Practical steps to overcome your struggles while pursuing your goals
3. Specific actions to move closer to your ideal self
4. A framework for making this decision based on your values
5. Long-term implications and opportunities

Format the response in clear paragraphs with actionable advice.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      res.json({ advice: text });
    } catch (genError) {
      console.error('Gemini API Error:', genError);
      res.status(500).json({ 
        error: 'Failed to generate advice',
        details: genError.message 
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Key configured:', !!process.env.GEMINI_API_KEY);
  console.log('Using model: gemini-2.0-flash');
});