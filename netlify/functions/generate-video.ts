import { Handler } from '@netlify/functions';
import axios, { AxiosError } from 'axios';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

if (!TAVUS_API_KEY) {
  throw new Error('TAVUS_API_KEY environment variable is required');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

async function makeRequest(text: string, attempt: number = 1) {
  try {
    console.log(`Attempting Tavus API request (attempt ${attempt})`);
    
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
      timeout: REQUEST_TIMEOUT
    });

    if (!response.data?.url) {
      throw new Error('No video URL in Tavus API response');
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Log detailed error information
    console.error('Tavus API Error:', {
      attempt,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      code: axiosError.code
    });

    // Handle specific error cases
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid Tavus API key');
    }

    if (axiosError.response?.status === 429) {
      throw new Error('Tavus API rate limit exceeded');
    }

    // Determine if we should retry
    const shouldRetry = attempt < MAX_RETRIES && (
      axiosError.code === 'ECONNABORTED' ||
      axiosError.response?.status === 502 ||
      axiosError.response?.status === 504 ||
      axiosError.response?.status === 500
    );

    if (shouldRetry) {
      console.log(`Retrying after ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return makeRequest(text, attempt + 1);
    }

    throw error;
  }
}

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Validate request
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

    // Make request with retry logic
    const result = await makeRequest(text);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        videoUrl: result.url,
        status: result.status
      })
    };

  } catch (error: any) {
    console.error('Video generation error:', error);

    // Handle known error cases
    if (error.message === 'Invalid Tavus API key') {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Authentication failed',
          details: 'Please check your Tavus API credentials'
        })
      };
    }

    if (error.message === 'Tavus API rate limit exceeded') {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Please try again in a few minutes'
        })
      };
    }

    // Generic error response
    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Video generation failed',
        details: error.message || 'An unexpected error occurred',
        suggestion: 'Please try again later or contact support if the issue persists'
      })
    };
  }
};

export { handler };