import { Handler } from '@netlify/functions';
import axios from 'axios';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

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
      url: 'https://api.tavus.io/v1/videos',
      headers: {
        'Authorization': `Bearer ${TAVUS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        script: text,
        background: 'office',
        format: 'horizontal',
        model: 'default'
      }
    });

    if (!response.data?.url) {
      throw new Error('No video URL received');
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ 
        videoUrl: response.data.url,
        status: response.data.status
      })
    };
  } catch (error: any) {
    console.error('Error generating video:', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to generate video response';
    
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