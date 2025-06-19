import axios from 'axios';

// Create a centralized API client for Gemini requests
class GeminiAPIClient {
  private getBaseURL() {
    // Determine if we're in development or production
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('webcontainer');
    
    return isDev ? '' : ''; // Use relative URLs for both dev and prod
  }

  private getEndpoint(endpoint: string) {
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('webcontainer');
    
    if (isDev) {
      return `/api/${endpoint}`; // Will be proxied by Vite
    } else {
      return `/.netlify/functions/${endpoint}`; // Direct Netlify function call
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
      console.log('Generating reflection with data:', userData);
      
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
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('Reflection response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error generating reflection:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(`API Error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        throw new Error('Network error: Unable to reach the server');
      } else {
        console.error('Setup error:', error.message);
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  async sendChatMessage(message: string, userContext?: any[]) {
    try {
      console.log('Sending chat message:', message);
      console.log('Chat endpoint:', this.getEndpoint('chat'));
      
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
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('Chat response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.error('Chat response error:', error.response.status, error.response.data);
        throw new Error(`Chat API Error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Chat request error:', error.request);
        throw new Error('Network error: Unable to reach the chat server');
      } else {
        console.error('Chat setup error:', error.message);
        throw new Error(`Chat request setup error: ${error.message}`);
      }
    }
  }

  // Utility method to check API health
  async checkAPIHealth() {
    try {
      const testResponse = await this.sendChatMessage('Hello');
      return { healthy: true, response: testResponse };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

// Export a singleton instance
export const geminiAPI = new GeminiAPIClient();

// Export the class for testing purposes
export { GeminiAPIClient };