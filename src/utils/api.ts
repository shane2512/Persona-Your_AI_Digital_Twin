// API Error Types
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends APIError {
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends APIError {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// API Response Types
export interface APIResponse<T> {
  data?: T;
  error?: APIError;
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: '❌ Network error: Please check your internet connection',
  TIMEOUT: '⚠️ Request timed out. Retrying...',
  UNAUTHORIZED: '❌ Authentication failed: Please check your API credentials',
  RATE_LIMIT: '⚠️ Rate limit exceeded. Please try again in a few minutes',
  BAD_REQUEST: '❌ Invalid request: Please check your input',
  SERVER_ERROR: '⚠️ Server error: Our team has been notified',
  UNKNOWN: '❗Something went wrong. Please try again or contact support',
  
  // Service-specific errors
  GEMINI: {
    INVALID_KEY: '❌ Invalid Gemini API key. Please check your credentials',
    MODEL_ERROR: '❌ Gemini model error: Please try with different input',
  },
  ELEVEN_LABS: {
    INVALID_KEY: '❌ Invalid ElevenLabs API key. Please check your credentials',
    VOICE_ERROR: '❌ Voice generation failed. Please try again',
  },
  TAVUS: {
    INVALID_KEY: '❌ Invalid Tavus API key. Please check your credentials',
    VIDEO_ERROR: '❌ Video generation failed. Please try again',
  },
};

// Retry configuration
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 1;

// Generic API call wrapper with retry logic
export async function makeAPICall<T>(
  apiCall: () => Promise<T>,
  options: {
    service: string;
    operation: string;
    retryOnError?: boolean;
  }
): Promise<APIResponse<T>> {
  const { service, operation, retryOnError = true } = options;
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const data = await apiCall();
      return { data };
    } catch (error: any) {
      console.error(`${service} ${operation} error:`, error);

      // Handle network errors
      if (!navigator.onLine || error.name === 'NetworkError') {
        throw new NetworkError(ERROR_MESSAGES.NETWORK);
      }

      // Handle timeout errors
      if (error.name === 'TimeoutError') {
        if (retries < MAX_RETRIES && retryOnError) {
          console.log(`Retrying ${service} ${operation} after timeout...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          retries++;
          continue;
        }
        throw new TimeoutError(ERROR_MESSAGES.TIMEOUT);
      }

      // Handle HTTP errors
      if (error.status) {
        switch (error.status) {
          case 401:
            throw new APIError(ERROR_MESSAGES[service].INVALID_KEY, 401);
          case 429:
            throw new APIError(ERROR_MESSAGES.RATE_LIMIT, 429);
          case 400:
            throw new APIError(ERROR_MESSAGES.BAD_REQUEST, 400, undefined, error.details);
          case 500:
            if (retries < MAX_RETRIES && retryOnError) {
              console.log(`Retrying ${service} ${operation} after server error...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              retries++;
              continue;
            }
            throw new APIError(ERROR_MESSAGES.SERVER_ERROR, 500);
          default:
            throw new APIError(ERROR_MESSAGES.UNKNOWN, error.status);
        }
      }

      // Handle any other unexpected errors
      throw new APIError(
        ERROR_MESSAGES.UNKNOWN,
        undefined,
        undefined,
        { originalError: error.message }
      );
    }
  }

  // This should never be reached due to the while loop condition
  throw new APIError(ERROR_MESSAGES.UNKNOWN);
}

// API service functions
export async function generateAdvice(userData: any): Promise<string> {
  return makeAPICall(
    async () => {
      const response = await fetch('/.netlify/functions/get-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new APIError('Failed to generate advice', response.status);
      }

      const data = await response.json();
      if (!data.advice) {
        throw new APIError('Invalid response format');
      }

      return data.advice;
    },
    { service: 'GEMINI', operation: 'generateAdvice' }
  ).then(response => response.data as string);
}

export async function generateVoice(text: string): Promise<string> {
  return makeAPICall(
    async () => {
      const response = await fetch('/.netlify/functions/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new APIError('Failed to generate voice', response.status);
      }

      const data = await response.json();
      if (!data.audioUrl) {
        throw new APIError('Invalid response format');
      }

      return data.audioUrl;
    },
    { service: 'ELEVEN_LABS', operation: 'generateVoice' }
  ).then(response => response.data as string);
}

export async function generateVideo(text: string): Promise<string> {
  return makeAPICall(
    async () => {
      const response = await fetch('/.netlify/functions/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new APIError('Failed to generate video', response.status);
      }

      const data = await response.json();
      if (!data.videoUrl) {
        throw new APIError('Invalid response format');
      }

      return data.videoUrl;
    },
    { service: 'TAVUS', operation: 'generateVideo' }
  ).then(response => response.data as string);
}