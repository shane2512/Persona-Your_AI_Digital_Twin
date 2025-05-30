import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: true,
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

// Add security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/get-advice', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = req.body;

    if (!coreValues || !lifeGoals || !currentStruggles || !idealSelf || !currentDecision) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are the user's ideal self, helping them make life-aligned decisions.
Their values: ${coreValues.join(', ')}
Their goals: ${lifeGoals.join(', ')}
Their struggles: ${currentStruggles.join(', ')}
Their ideal self: ${idealSelf}
They are currently facing this decision: ${currentDecision}

As their ideal self, respond with:
1. What would your ideal self do?
2. Why?
3. Encouragement or challenge.`;

    const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME || "gemini-pro" });
    console.log('Sending request to Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Successfully received response from Gemini API');
    
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