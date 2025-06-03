import { Handler } from '@netlify/functions';
import axios from 'axios';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  if (!event.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing request body' })
    };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      throw new Error('Text is required');
    }

    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer'
    });

    if (!response.data) {
      throw new Error('No audio data received');
    }

    const audioBase64 = Buffer.from(response.data).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ audioUrl })
    };
  } catch (error: any) {
    console.error('Error generating voice:', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to generate voice response';
    
    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.response?.data || error.message
      })
    };
  }
};

export { handler };