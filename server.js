import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

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

Provide a comprehensive analysis in the following structure:

1. Values Analysis
- How the person's core values interconnect
- Potential value conflicts and their resolution
- How these values manifest in daily life

2. Goals & Vision Alignment
- Connection between stated goals and core values
- Potential synergies between different goals
- Gaps between current state and ideal self
- Practical steps to bridge these gaps

3. Challenge Analysis
- Root causes of current struggles
- How struggles might be serving a deeper purpose
- Connection between struggles and growth opportunities
- Specific strategies for overcoming each challenge

4. Decision Framework
- Analysis of the current decision through the lens of core values
- Short-term vs long-term implications
- Potential hidden opportunities or risks
- Decision-making framework tailored to their values

5. Action Plan
- 3 immediate actions (next 24 hours)
- 3 short-term strategies (next month)
- 2 long-term development areas
- Specific success metrics and milestones

6. Mindset Shifts
- Limiting beliefs to challenge
- New perspectives to consider
- Empowering reframes of current situations

Conclude with a powerful, personalized message that connects their values, vision, and current situation into a meaningful narrative for growth.

Format the response in clear sections with thoughtful transitions. Use specific examples and metaphors where appropriate. Focus on depth, practicality, and psychological insight.`;

    const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME || "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ advice: text });
  } catch (error) {
    console.error('Error generating advice:', error);
    res.status(500).json({ 
      error: 'Failed to generate advice', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`Using model: ${process.env.MODEL_NAME || "gemini-pro"}`);
});