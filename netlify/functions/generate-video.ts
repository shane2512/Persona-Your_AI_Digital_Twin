import { Handler } from '@netlify/functions';
import axios from 'axios';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

if (!TAVUS_API_KEY) {
  throw new Error('TAVUS_API_KEY is required');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
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
      body: JSON.stringify({ 
        error: 'Missing request body',
        details: 'Request body is required'
      })
    };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Missing required field',
          details: 'Text content is required'
        })
      };
    }

    let retries = 0;
    const maxRetries = 1;
    const retryDelay = 2000; // 2 seconds

    while (retries <= maxRetries) {
      try {
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
          },
          timeout: 30000 // 30 second timeout
        });

        if (!response.data?.url) {
          throw new Error('No video URL received from Tavus API');
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            videoUrl: response.data.url,
            status: response.data.status
          })
        };
      } catch (error: any) {
        console.error(`Tavus API error (attempt ${retries + 1}):`, error);

        // Check if we should retry
        if (retries < maxRetries && (
          error.code === 'ECONNABORTED' || 
          error.response?.status === 502 ||
          error.response?.status === 504
        )) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({
              error: 'Authentication failed',
              details: 'Invalid Tavus API key'
            })
          };
        }

        if (error.response?.status === 429) {
          return {
            statusCode: 429,
            headers: corsHeaders,
            body: JSON.stringify({
              error: 'Rate limit exceeded',
              details: 'Please try again in a few minutes'
            })
          };
        }

        throw error; // Re-throw for general error handling
      }
    }

    throw new Error('Max retries exceeded');
  } catch (error: any) {
    console.error('Error generating video:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to generate video',
        details: error.response?.data?.message || error.message || 'An unexpected error occurred',
        suggestion: 'Please try again later or contact support if the issue persists'
      })
    };
  }
};

export { handler };