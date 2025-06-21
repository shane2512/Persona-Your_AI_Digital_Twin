import axios from 'axios';

// Create a centralized API client for Claude requests
class ClaudeAPIClient {
  private isBoltEnvironment() {
    return window.location.hostname.includes('webcontainer') || 
           window.location.hostname.includes('bolt') ||
           window.location.hostname.includes('stackblitz');
  }

  private isLocalDev() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  private getEndpoint(endpoint: string) {
    // In Bolt or local dev, use the proxy
    if (this.isBoltEnvironment() || this.isLocalDev()) {
      return `/api/${endpoint}`; // Will be proxied by Vite to Netlify
    } else {
      // In production (Netlify), use direct function calls
      return `/.netlify/functions/${endpoint}`;
    }
  }

  async generateReflection(userData: {
    coreValues: string[];
    lifeGoals: string[];
    currentStruggles: string[];
    idealSelf: string;
    currentDecision: string;
  }) {
    try {
      console.log('Environment check:', {
        hostname: window.location.hostname,
        isBolt: this.isBoltEnvironment(),
        isLocal: this.isLocalDev(),
        endpoint: this.getEndpoint('get-advice')
      });
      
      console.log('Generating reflection with Claude Sonnet 4:', userData);
      
      const response = await axios.post(
        this.getEndpoint('get-advice'),
        {
          coreValues: userData.coreValues,
          lifeGoals: userData.lifeGoals,
          currentStruggles: userData.currentStruggles,
          idealSelf: userData.idealSelf,
          currentDecision: userData.currentDecision
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 45000, // Increased timeout for Bolt environment
          // Accept all status codes to handle our custom error responses
          validateStatus: () => true
        }
      );

      console.log('Claude reflection response:', response.data);
      
      // Check for API key missing or other errors
      if (response.data?.success === false || response.data?.error) {
        if (response.data?.error === 'AI API key missing') {
          throw new Error('AI_API_KEY_MISSING');
        }
        throw new Error(response.data?.error || 'Service temporarily unavailable');
      }
      
      // Ensure we have advice in the response
      if (!response.data?.advice) {
        throw new Error('Invalid response format - missing advice');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error generating reflection with Claude:', error);
      
      // Handle specific API key missing error
      if (error.message === 'AI_API_KEY_MISSING') {
        throw new Error('AI_API_KEY_MISSING');
      }
      
      // Enhanced error handling with Bolt-specific logic
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        
        // Check if the response contains our custom error format
        if (error.response.data?.success === false) {
          if (error.response.data?.error === 'AI API key missing') {
            throw new Error('AI_API_KEY_MISSING');
          }
          throw new Error(error.response.data?.error || 'Service error');
        }
        
        // If we're in Bolt and get a 503, try direct Netlify call as fallback
        if (this.isBoltEnvironment() && error.response.status >= 500) {
          console.log('Trying direct Netlify call as fallback...');
          try {
            const fallbackResponse = await axios.post(
              'https://persona-mirror-ai.netlify.app/.netlify/functions/get-advice',
              {
                coreValues: userData.coreValues,
                lifeGoals: userData.lifeGoals,
                currentStruggles: userData.currentStruggles,
                idealSelf: userData.idealSelf,
                currentDecision: userData.currentDecision
              },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000,
                validateStatus: () => true
              }
            );
            console.log('Direct Netlify call response:', fallbackResponse.data);
            
            // Check fallback response for errors
            if (fallbackResponse.data?.success === false || fallbackResponse.data?.error) {
              if (fallbackResponse.data?.error === 'AI API key missing') {
                throw new Error('AI_API_KEY_MISSING');
              }
              throw new Error(fallbackResponse.data?.error || 'Service temporarily unavailable');
            }
            
            return fallbackResponse.data;
          } catch (fallbackError: any) {
            console.error('Direct Netlify call also failed:', fallbackError);
            if (fallbackError.message === 'AI_API_KEY_MISSING') {
              throw new Error('AI_API_KEY_MISSING');
            }
          }
        }
        
        throw new Error(`Claude API Error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        throw new Error('Network error: Unable to reach Claude API server');
      } else {
        console.error('Setup error:', error.message);
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  async sendChatMessage(message: string, userContext?: any[]) {
    try {
      console.log('Environment check for Claude chat:', {
        hostname: window.location.hostname,
        isBolt: this.isBoltEnvironment(),
        isLocal: this.isLocalDev(),
        endpoint: this.getEndpoint('chat')
      });
      
      console.log('Sending chat message to Claude:', message);
      
      const response = await axios.post(
        this.getEndpoint('chat'),
        {
          message,
          userContext: userContext || []
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 45000, // Increased timeout for Bolt environment
          // Accept all status codes to handle our custom error responses
          validateStatus: () => true
        }
      );

      console.log('Claude chat response:', response.data);
      
      // Check for API key missing or other errors
      if (response.data?.success === false || response.data?.error) {
        if (response.data?.error === 'AI API key missing') {
          // Return fallback response for chat
          return {
            success: false,
            response: "Our AI helper is having a moment. Please try again soon.",
            error: 'AI API key missing',
            fallback: true
          };
        }
        // For other errors, return the fallback response if available
        return response.data;
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error sending chat message to Claude:', error);
      
      // Enhanced error handling with Bolt-specific logic
      if (error.response) {
        console.error('Claude chat response error:', error.response.status, error.response.data);
        
        // Check if the response contains our custom error format
        if (error.response.data?.success === false) {
          if (error.response.data?.error === 'AI API key missing') {
            return {
              success: false,
              response: "Our AI helper is having a moment. Please try again soon.",
              error: 'AI API key missing',
              fallback: true
            };
          }
          return error.response.data; // Return the fallback response
        }
        
        // If we're in Bolt and get a 503, try direct Netlify call as fallback
        if (this.isBoltEnvironment() && error.response.status >= 500) {
          console.log('Trying direct Netlify call for Claude chat as fallback...');
          try {
            const fallbackResponse = await axios.post(
              'https://persona-mirror-ai.netlify.app/.netlify/functions/chat',
              {
                message,
                userContext: userContext || []
              },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000,
                validateStatus: () => true
              }
            );
            console.log('Direct Netlify Claude chat call response:', fallbackResponse.data);
            
            // Check fallback response for errors
            if (fallbackResponse.data?.success === false || fallbackResponse.data?.error) {
              if (fallbackResponse.data?.error === 'AI API key missing') {
                return {
                  success: false,
                  response: "Our AI helper is having a moment. Please try again soon.",
                  error: 'AI API key missing',
                  fallback: true
                };
              }
              return fallbackResponse.data; // Return the fallback response
            }
            
            return fallbackResponse.data;
          } catch (fallbackError: any) {
            console.error('Direct Netlify Claude chat call also failed:', fallbackError);
          }
        }
      }
      
      // Return a generic fallback response for any unhandled errors
      return {
        success: false,
        response: "Our AI helper is having a moment. Please try again soon.",
        error: 'Service temporarily unavailable',
        fallback: true
      };
    }
  }

  // Utility method to check Claude API health
  async checkAPIHealth() {
    try {
      console.log('Checking Claude API health...');
      
      // For Bolt environment, try both proxy and direct
      if (this.isBoltEnvironment()) {
        try {
          // Try proxy first
          const testResponse = await axios.post(
            this.getEndpoint('chat'),
            { message: 'Health check' },
            { timeout: 10000, validateStatus: () => true }
          );
          
          if (testResponse.data?.success !== false) {
            return { healthy: true, method: 'proxy', response: testResponse.data };
          } else {
            throw new Error('Proxy returned error response');
          }
        } catch (proxyError) {
          console.log('Proxy health check failed, trying direct...');
          // Try direct as fallback
          const directResponse = await axios.post(
            'https://persona-mirror-ai.netlify.app/.netlify/functions/chat',
            { message: 'Health check' },
            { timeout: 10000, validateStatus: () => true }
          );
          
          if (directResponse.data?.success !== false) {
            return { healthy: true, method: 'direct', response: directResponse.data };
          } else {
            throw new Error('Direct call returned error response');
          }
        }
      } else {
        // For production, use normal endpoint
        const testResponse = await this.sendChatMessage('Health check');
        if (testResponse?.success !== false) {
          return { healthy: true, method: 'normal', response: testResponse };
        } else {
          throw new Error('Health check returned error response');
        }
      }
    } catch (error) {
      console.error('Claude API health check failed:', error);
      return { healthy: false, error: error.message };
    }
  }
}

// Export a singleton instance
export const claudeAPI = new ClaudeAPIClient();

// Export with backward compatibility
export const geminiAPI = claudeAPI; // For backward compatibility

// Export the class for testing purposes
export { ClaudeAPIClient };