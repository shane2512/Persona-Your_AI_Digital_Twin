import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI('AIzaSyDdN9F95t_E7Zx4X6M8rMWaCvmbPOgRyuk');

app.post('/api/get-advice', async (req, res) => {
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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate advice',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});