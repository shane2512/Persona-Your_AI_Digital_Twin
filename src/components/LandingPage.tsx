import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  Zap, 
  Heart, 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  Download,
  Share2,
  History,
  MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onStartReflection: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onStartReflection }) => {
  const features = [
    {
      icon: Target,
      title: "Values-Based Decisions",
      description: "Make choices that align with your deepest values and long-term vision."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized guidance from advanced AI that understands your unique situation."
    },
    {
      icon: TrendingUp,
      title: "Personal Growth Tracking",
      description: "Monitor your progress and see how your decisions shape your ideal self."
    },
    {
      icon: Heart,
      title: "Mood & Wellness",
      description: "Track your emotional state and understand how decisions affect your wellbeing."
    },
    {
      icon: History,
      title: "Reflection History",
      description: "Compare past insights with current thoughts to see your evolution."
    },
    {
      icon: Share2,
      title: "Export & Share",
      description: "Save your insights and share meaningful reflections with trusted friends."
    }
  ];

  const benefits = [
    "Gain clarity on complex life decisions",
    "Align your actions with your core values",
    "Develop deeper self-awareness",
    "Make confident choices with AI guidance",
    "Track your personal growth journey"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Your AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Self-Reflection Tool
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
            Transform how you make decisions with AI-powered insights that understand your values, 
            goals, and aspirations. Get personalized guidance that helps you become your ideal self.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onStartReflection}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            Start Your Reflection Journey
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-8 pt-8"
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Shield size={16} />
            <span className="text-sm font-medium">Privacy First</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Zap size={16} />
            <span className="text-sm font-medium">Instant AI Insights</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Users size={16} />
            <span className="text-sm font-medium">Trusted by Thousands</span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Everything you need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> better decisions</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our AI understands your unique situation and provides personalized guidance 
            that evolves with your growth journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Why choose
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Persona Mirror?</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Unlike generic advice, our AI creates a personalized reflection of your values, 
                goals, and aspirations to guide every decision.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={onStartReflection}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              Try It Now - Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* App preview mockup */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-800/50">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">AI Reflection</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Personalized insights</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Core Values</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Life Goals</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Ready to discover your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> true potential?</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Join thousands of people who are making better decisions and living more authentic lives 
            with AI-powered self-reflection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onStartReflection}
            className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            Start Your Journey - Free
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-slate-500 dark:text-slate-500"
        >
          Free to start • No credit card required • Privacy protected • Powered by Claude AI
        </motion.p>
      </section>
    </motion.div>
  );
};

export default LandingPage;