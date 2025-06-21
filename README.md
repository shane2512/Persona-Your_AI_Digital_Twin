# Persona Mirror - Your AI Digital Twin

[![Built on Bolt](https://img.shields.io/badge/Built%20on-Bolt-blue?style=flat-square)](https://bolt.new)

An AI-powered self-reflection tool that helps you align your decisions with your core values and life goals. Using Claude Sonnet 4, it provides personalized guidance and actionable insights based on your unique situation.

## Features

- 🎯 Core Values Assessment
- 🌟 Life Goals Visualization
- 💭 Current Struggles Analysis
- 🔮 Ideal Self Exploration
- 🤔 Decision-Making Support
- 🤖 AI-Powered Personalized Advice with Claude Sonnet 4
- 👤 User Authentication & Data Persistence
- 💬 Claude AI Chat Assistant
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- React 18 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- Framer Motion for smooth animations
- Claude Sonnet 4 for intelligent insights
- Supabase for authentication and database
- Netlify for serverless deployment

## Environment Setup

### Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Claude AI
VITE_CLAUDE_API_KEY=your_claude_api_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Your API Keys

#### 1. Claude API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Copy the key to your `.env` file

#### 2. Supabase Setup
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
- **AI-Powered Insights**: Uses Claude Sonnet 4 to provide personalized advice
- **Data Persistence**: Saves reflections to Supabase for authenticated users, localStorage for guests

### User Authentication
- **Secure Sign-up/Sign-in**: Email and password authentication via Supabase
- **Profile Management**: User profiles with reflection history
- **Guest Mode**: Full functionality available without authentication

### Claude AI Chat Assistant
- **Contextual Responses**: Provides advice based on user's reflection history
- **Always Accessible**: Floating chat button for quick access
- **Personalized Guidance**: Different responses for authenticated vs guest users
- **Powered by Claude Sonnet 4**: Smart, efficient model for everyday use

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Dark Mode**: Automatic theme switching
- **Smooth Animations**: Framer Motion for enhanced UX

## Why Claude Sonnet 4?

Claude Sonnet 4 is the perfect AI model for Persona Mirror because:

- **Empathetic Understanding**: Superior emotional intelligence for personal guidance
- **Contextual Memory**: Excellent at referencing previous conversations and reflections
- **Thoughtful Analysis**: Provides deeper insights into personal values and decision-making
- **Natural Communication**: More conversational and supportive tone than other models
- **Smart & Efficient**: Optimized for everyday use with consistent, high-quality responses

## Troubleshooting

### Database Connection Issues
If you're experiencing "failed to fetch" errors on Netlify:

1. **Check Environment Variables**: Ensure all Supabase variables are set in Netlify
2. **Verify API Keys**: Make sure your Supabase keys are correct and active
3. **Check Network**: Ensure your Supabase project is accessible
4. **Fallback Mode**: The app will work in localStorage mode if Supabase is unavailable

### Common Issues
- **Build Failures**: Check that all environment variables are set
- **API Errors**: Verify your Claude API key is valid and has quota
- **Auth Issues**: Ensure Supabase email confirmation is disabled for development

## Contributing

Feel free to open issues or submit pull requests. All contributions are welcome!

## License

MIT

---

Created with ❤️ using [Bolt](https://bolt.new) and powered by Claude Sonnet 4