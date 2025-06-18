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

    // Validate text length (ElevenLabs has limits)
    if (text.length > 5000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Text too long',
          message: 'Text must be less than 5000 characters'
        })
      };
    }

    // Get API key from environment variables
    const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
    if (!ELEVEN_LABS_API_KEY) {
      console.error('ElevenLabs API key not found in environment variables');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Configuration error',
          message: 'Audio service is not properly configured'
        })
      };
    }

    // Voice ID - using Rachel voice as default
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

    // ElevenLabs API endpoint
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

    // Prepare request headers
    const requestHeaders = {
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    };

    // Prepare request payload
    const payload = {
      text: text.trim(),
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    };

    console.log(`Generating audio for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // Make request to ElevenLabs API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

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
        console.error('ElevenLabs API request timed out');
        return {
          statusCode: 504,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Request timeout',
            message: 'Audio generation took too long. Please try again with shorter text.'
          })
        };
      }
      
      console.error('Network error calling ElevenLabs API:', fetchError);
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Service unavailable',
          message: 'Unable to connect to audio generation service'
        })
      };
    }

    clearTimeout(timeoutId);

    // Check if the response is successful
    if (!response.ok) {
      let errorMessage = `ElevenLabs API error: ${response.status}`;
      
      try {
        const errorData = await response.text();
        console.error('ElevenLabs API error response:', errorData);
        
        // Parse error response if it's JSON
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.detail?.message || errorJson.message || errorMessage;
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
            message: 'Audio service authentication error'
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
            message: 'The provided text cannot be processed for audio generation'
          })
        };
      }

      return {
        statusCode: response.status >= 500 ? 502 : 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Audio generation failed',
          message: errorMessage
        })
      };
    }

    // Get the audio data
    let audioBuffer;
    try {
      audioBuffer = await response.arrayBuffer();
    } catch (bufferError) {
      console.error('Failed to read audio buffer:', bufferError);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Audio processing failed',
          message: 'Failed to process generated audio'
        })
      };
    }

    // Validate audio data
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.error('Received empty audio buffer from ElevenLabs');
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Empty audio response',
          message: 'No audio data was generated'
        })
      };
    }

    // Convert to base64 for transmission
    let audioBase64;
    try {
      const uint8Array = new Uint8Array(audioBuffer);
      audioBase64 = Buffer.from(uint8Array).toString('base64');
    } catch (conversionError) {
      console.error('Failed to convert audio to base64:', conversionError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Audio encoding failed',
          message: 'Failed to encode audio for transmission'
        })
      };
    }

    // Create data URL for the audio
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    console.log(`Successfully generated audio: ${audioBuffer.byteLength} bytes`);

    // Return successful response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        audioUrl,
        size: audioBuffer.byteLength,
        format: 'mp3',
        success: true
      })
    };

  } catch (error: any) {
    // Log the full error for debugging
    console.error('Unexpected error in generate-voice function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred while generating audio'
      })
    };
  }
};

export { handler };