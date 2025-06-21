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
          // Add retry logic for Bolt environment
          validateStatus: (status) => {
            return status < 500; // Accept 4xx errors but retry 5xx
          }
        }
      );

      console.log('Claude reflection response:', response.data);
      
      // Handle fallback responses from proxy
      if (response.data?.fallback) {
        throw new Error('Service temporarily unavailable - using fallback');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error generating reflection with Claude:', error);
      
      // Enhanced error handling with Bolt-specific logic
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        
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
                timeout: 30000
              }
            );
            console.log('Direct Netlify call successful:', fallbackResponse.data);
            return fallbackResponse.data;
          } catch (fallbackError) {
            console.error('Direct Netlify call also failed:', fallbackError);
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
          validateStatus: (status) => {
            return status < 500; // Accept 4xx errors but retry 5xx
          }
        }
      );

      console.log('Claude chat response:', response.data);
      
      // Handle fallback responses from proxy
      if (response.data?.fallback) {
        return response.data; // Return fallback response as-is
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error sending chat message to Claude:', error);
      
      // Enhanced error handling with Bolt-specific logic
      if (error.response) {
        console.error('Claude chat response error:', error.response.status, error.response.data);
        
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
                timeout: 30000
              }
            );
            console.log('Direct Netlify Claude chat call successful:', fallbackResponse.data);
            return fallbackResponse.data;
          } catch (fallbackError) {
            console.error('Direct Netlify Claude chat call also failed:', fallbackError);
          }
        }
        
        throw new Error(`Claude Chat API Error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Claude chat request error:', error.request);
        throw new Error('Network error: Unable to reach Claude chat server');
      } else {
        console.error('Claude chat setup error:', error.message);
        throw new Error(`Claude chat request setup error: ${error.message}`);
      }
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
            { timeout: 10000 }
          );
          return { healthy: true, method: 'proxy', response: testResponse.data };
        } catch (proxyError) {
          console.log('Proxy health check failed, trying direct...');
          // Try direct as fallback
          const directResponse = await axios.post(
            'https://persona-mirror-ai.netlify.app/.netlify/functions/chat',
            { message: 'Health check' },
            { timeout: 10000 }
          );
          return { healthy: true, method: 'direct', response: directResponse.data };
        }
      } else {
        // For production, use normal endpoint
        const testResponse = await this.sendChatMessage('Health check');
        return { healthy: true, method: 'normal', response: testResponse };
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