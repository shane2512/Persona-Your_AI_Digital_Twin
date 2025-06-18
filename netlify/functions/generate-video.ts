import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        message: 'Only POST requests are supported'
      })
    };
  }

  // Validate request body
  if (!event.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Missing request body',
        message: 'Request body with text field is required'
      })
    };
  }

  try {
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON'
        })
      };
    }

    const { text } = requestData;

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Invalid text',
          message: 'Text field is required and must be a non-empty string'
        })
      };
    }

    // Validate text length (Tavus has limits)
    if (text.length > 2000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Text too long',
          message: 'Text must be less than 2000 characters for video generation'
        })
      };
    }

    // Get API key from environment variables
    const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
    if (!TAVUS_API_KEY) {
      console.error('Tavus API key not found in environment variables');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Configuration error',
          message: 'Video service is not properly configured'
        })
      };
    }

    // Tavus API endpoint
    const apiUrl = 'https://tavusapi.com/v2/videos';

    // Prepare request headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': TAVUS_API_KEY
    };

    // Prepare request payload
    const payload = {
      replica_id: 'rb17cf590e15', // Default replica ID
      script: text.trim()
    };

    console.log(`Generating video for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // Make request to Tavus API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for video generation

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Tavus API request timed out');
        return {
          statusCode: 504,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Request timeout',
            message: 'Video generation took too long. Please try again with shorter text.'
          })
        };
      }
      
      console.error('Network error calling Tavus API:', fetchError);
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Service unavailable',
          message: 'Unable to connect to video generation service'
        })
      };
    }

    clearTimeout(timeoutId);

    // Check if the response is successful
    if (!response.ok) {
      let errorMessage = `Tavus API error: ${response.status}`;
      
      try {
        const errorData = await response.text();
        console.error('Tavus API error response:', errorData);
        
        // Parse error response if it's JSON
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.detail?.message || errorJson.message || errorJson.error || errorMessage;
        } catch {
          // If not JSON, use the text response
          errorMessage = errorData || errorMessage;
        }
      } catch (readError) {
        console.error('Failed to read error response:', readError);
      }

      // Handle specific error codes
      if (response.status === 401) {
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Authentication failed',
            message: 'Video service authentication error'
          })
        };
      } else if (response.status === 429) {
        return {
          statusCode: 429,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.'
          })
        };
      } else if (response.status === 422) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Invalid input',
            message: 'The provided text cannot be processed for video generation'
          })
        };
      }

      return {
        statusCode: response.status >= 500 ? 502 : 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Video generation failed',
          message: errorMessage
        })
      };
    }

    // Get the response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse Tavus response as JSON:', jsonError);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Invalid response',
          message: 'Received invalid response from video generation service'
        })
      };
    }

    console.log('Tavus API response:', responseData);

    // Extract video information from response
    const videoId = responseData.video_id;
    const status = responseData.status;
    const downloadUrl = responseData.download_url;
    const streamUrl = responseData.stream_url;

    // Tavus returns different response formats depending on the status
    let videoUrl = downloadUrl || streamUrl;
    
    // If no direct URL is available, we might need to poll for completion
    if (!videoUrl && videoId) {
      // For now, return the video ID and status
      // In a production app, you might want to implement polling
      return {
        statusCode: 202, // Accepted - processing
        headers: corsHeaders,
        body: JSON.stringify({ 
          videoId,
          status: status || 'processing',
          message: 'Video is being generated. This may take a few minutes.',
          success: true
        })
      };
    }

    if (!videoUrl) {
      console.error('No video URL found in Tavus response:', responseData);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'No video URL',
          message: 'Video generation completed but no URL was provided'
        })
      };
    }

    console.log(`Successfully generated video: ${videoUrl}`);

    // Return successful response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        videoUrl,
        videoId,
        status: status || 'completed',
        downloadUrl,
        streamUrl,
        success: true
      })
    };

  } catch (error: any) {
    // Log the full error for debugging
    console.error('Unexpected error in generate-video function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred while generating video'
      })
    };
  }
};

export { handler };