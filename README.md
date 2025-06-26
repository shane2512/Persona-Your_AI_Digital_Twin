# Persona Mirror - Your AI Digital Twin

[![Built on Bolt](https://img.shields.io/badge/Built%20on-Bolt-blue?style=flat-square)](https://bolt.new)

An AI-powered self-reflection tool that helps you align your decisions with your core values and life goals. Using Claude Sonnet 4 and Google Gemini 2.0 Flash as fallback, it provides personalized guidance and actionable insights based on your unique situation.

## Features

- 🎯 Core Values Assessment
- 🌟 Life Goals Visualization
- 💭 Current Struggles Analysis
- 🔮 Ideal Self Exploration
- 🤔 Decision-Making Support
- 🤖 AI-Powered Personalized Advice with Claude Sonnet 4 & Gemini 2.0 Flash
- 👤 User Authentication & Data Persistence
- 💬 AI Chat Assistant with Fallback Support
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- React 18 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- Framer Motion for smooth animations
- Claude Sonnet 4 & Google Gemini 2.0 Flash for intelligent insights
- Supabase for authentication and database
- Netlify for serverless deployment

## Environment Setup

### Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Claude AI (Primary)
VITE_CLAUDE_API_KEY=your_claude_api_key

# Google Gemini AI (Fallback)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Your API Keys

#### 1. Claude API Key (Primary AI)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Copy the key to your `.env` file

#### 2. Google Gemini API Key (Fallback AI)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### 3. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings → API
3. Copy the Project URL and anon/public key to your `.env` file
4. The database schema will be automatically created when you first use the app

### Netlify Deployment Setup

#### 1. Environment Variables in Netlify
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the following variables:
   - `VITE_CLAUDE_API_KEY`: Your Claude API key
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

#### 2. Deploy Settings
The project includes a `netlify.toml` file with the correct build settings:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your API keys (see above)
4. Start the development server: `npm run dev`

## Features Overview

### Core Functionality
- **Multi-step Reflection Form**: Guides users through values, goals, struggles, ideal self, and current decisions
- **AI-Powered Insights**: Uses Claude Sonnet 4 with Gemini 2.0 Flash fallback for personalized advice
- **Data Persistence**: Saves reflections to Supabase for authenticated users, localStorage for guests

### AI Integration
- **Primary AI**: Claude Sonnet 4 for empathetic, thoughtful responses
- **Fallback AI**: Google Gemini 2.0 Flash when Claude is unavailable
- **Structured Fallback**: Intelligent offline guidance when both AIs are unavailable
- **Smart Routing**: Automatically switches between AI providers based on availability

### User Authentication
- **Secure Sign-up/Sign-in**: Email and password authentication via Supabase
- **Profile Management**: User profiles with reflection history
- **Guest Mode**: Full functionality available without authentication

### AI Chat Assistant
- **Contextual Responses**: Provides advice based on user's reflection history
- **Always Accessible**: Floating chat button for quick access
- **Personalized Guidance**: Different responses for authenticated vs guest users
- **Multi-AI Support**: Uses Claude or Gemini based on availability

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Dark Mode**: Automatic theme switching
- **Smooth Animations**: Framer Motion for enhanced UX

## AI Provider Details

### Claude Sonnet 4 (Primary)
Claude Sonnet 4 is the primary AI model for Persona Mirror because:
- **Empathetic Understanding**: Superior emotional intelligence for personal guidance
- **Contextual Memory**: Excellent at referencing previous conversations and reflections
- **Thoughtful Analysis**: Provides deeper insights into personal values and decision-making
- **Natural Communication**: More conversational and supportive tone

### Google Gemini 2.0 Flash (Fallback)
Gemini 2.0 Flash serves as an excellent fallback because:
- **Fast Response Times**: Quick generation for seamless user experience
- **Reliable Availability**: High uptime and consistent performance
- **Quality Insights**: Provides thoughtful guidance when Claude is unavailable
- **Cost Effective**: Efficient processing for high-volume usage

### Intelligent Fallback System
When both AI providers are unavailable:
- **Structured Guidance**: Creates personalized advice based on user inputs
- **Value-Based Framework**: Provides decision-making frameworks using user's stated values
- **Contextual Responses**: Tailored advice based on specific user situations

## API Request Handling

The application includes robust API handling:

1. **Primary Route**: Attempts Claude Sonnet 4 first
2. **Fallback Route**: Switches to Gemini 2.0 Flash if Claude fails
3. **Offline Mode**: Provides structured guidance if both AIs are unavailable
4. **Error Recovery**: Graceful degradation with meaningful user feedback
5. **Proxy Support**: Works in both development and production environments

## Troubleshooting

### Database Connection Issues
If you're experiencing "failed to fetch" errors on Netlify:

1. **Check Environment Variables**: Ensure all Supabase variables are set in Netlify
2. **Verify API Keys**: Make sure your Supabase keys are correct and active
3. **Check Network**: Ensure your Supabase project is accessible
4. **Fallback Mode**: The app will work in localStorage mode if Supabase is unavailable

### AI API Issues
If AI responses are not working:

1. **Check API Keys**: Verify both Claude and Gemini API keys are valid
2. **Check Quotas**: Ensure you haven't exceeded API limits
3. **Fallback System**: The app will automatically use Gemini if Claude fails
4. **Offline Mode**: Structured guidance is provided if both AIs are unavailable

### Common Issues
- **Build Failures**: Check that all environment variables are set
- **API Errors**: Verify your API keys are valid and have quota
- **Auth Issues**: Ensure Supabase email confirmation is disabled for development

## Contributing

Feel free to open issues or submit pull requests. All contributions are welcome!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

Created with ❤️ using [Bolt](https://bolt.new) and powered by Claude Sonnet 4 & Google Gemini 2.0 Flash
