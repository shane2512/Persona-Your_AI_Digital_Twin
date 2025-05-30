import { UserData } from '../types';

export function generateAdvice(userData: UserData): string {
  const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = userData;
  
  const valuesList = formatList(coreValues);
  const introduction = `Your reflection reveals that you deeply value ${valuesList}. These core values form the foundation of your authentic self and guide your decisions in life.`;
  
  const goalsList = formatList(lifeGoals);
  const goalsAdvice = `Your aspirations to ${goalsList} align with your core values and show a desire for growth and fulfillment. As you pursue these goals, remember to celebrate small victories along the way and maintain perspective on why these achievements matter to you personally.`;
  
  const strugglesList = formatList(currentStruggles);
  let strugglesAdvice = '';
  
  if (currentStruggles.some(s => s.toLowerCase().includes('balance') || s.toLowerCase().includes('time'))) {
    strugglesAdvice += `I notice you're dealing with challenges related to ${strugglesList}. Finding balance requires regular reflection on your priorities and having the courage to set boundaries. Consider allocating specific time blocks for different aspects of your life and practicing saying no to commitments that don't align with your core values.`;
  } else if (currentStruggles.some(s => s.toLowerCase().includes('doubt') || s.toLowerCase().includes('confidence'))) {
    strugglesAdvice += `You've shared that you're currently facing ${strugglesList}. Self-doubt often appears when we're stepping outside our comfort zone, which is actually a sign of growth. Try to reframe these moments as evidence that you're challenging yourself rather than indicators of inadequacy.`;
  } else {
    strugglesAdvice += `You're currently navigating challenges like ${strugglesList}. Remember that obstacles are opportunities for developing resilience and discovering new strengths. Consider how these struggles might be guiding you toward important insights or preparing you for future success.`;
  }
  
  const idealSelfAdvice = idealSelf.split(' ').length > 100
    ? `Your detailed vision of your ideal self shows thoughtful reflection and self-awareness. This clarity is powerful. Consider identifying one quality from this vision that you can intentionally develop starting today - perhaps through a small daily habit that reinforces this aspect of your ideal self.`
    : `The way you've described your ideal self provides a valuable north star for your personal development. Each morning, take a moment to visualize this version of yourself and identify one action you can take that day to move closer to this vision.`;
  
  let decisionAdvice = '';
  if (currentDecision) {
    decisionAdvice = `Regarding your current decision: ${currentDecision}\n\nWhen facing this choice, consider how each option aligns with your core values of ${valuesList}. Sometimes the right decision isn't the easiest one, but the one that best reflects who you want to become. Take time to visualize how each potential path might affect your progress toward your stated goals and ideal self.`;
  }
  
  const actionableAdvice = generateActionableAdvice(coreValues, currentStruggles, currentDecision);
  
  return `${introduction}\n\n${goalsAdvice}\n\n${strugglesAdvice}\n\n${idealSelfAdvice}\n\n${decisionAdvice}\n\n${actionableAdvice}`;
}

function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, items.length - 1).join(', ');
  return `${otherItems}, and ${lastItem}`;
}

function generateActionableAdvice(values: string[], struggles: string[], decision: string): string {
  let advice = 'Here are three practical steps you might consider taking:';
  
  if (decision) {
    advice += '\n\n1. Create a decision matrix: List your options as rows and your core values as columns. Rate how well each option aligns with each value (1-5). This can help clarify which choice best reflects your authentic self.';
  } else if (values.some(v => v.toLowerCase().includes('family') || v.toLowerCase().includes('relationship'))) {
    advice += '\n\n1. Schedule dedicated, uninterrupted time with loved ones each week where devices are set aside and meaningful connection is the priority.';
  } else if (values.some(v => v.toLowerCase().includes('growth') || v.toLowerCase().includes('learn'))) {
    advice += '\n\n1. Set aside 20 minutes each day for learning something new related to your interests or goals - whether through reading, online courses, or practice.';
  } else {
    advice += '\n\n1. Create a morning ritual that reinforces your core values and sets a positive tone for the day - perhaps through journaling, meditation, or affirmations.';
  }
  
  if (struggles.some(s => s.toLowerCase().includes('procrastin') || s.toLowerCase().includes('focus'))) {
    advice += '\n\n2. Try the "5-minute rule" when facing tasks you tend to avoid - commit to just 5 minutes of work, knowing you can stop after that if needed (though you\'ll often continue once started).';
  } else if (struggles.some(s => s.toLowerCase().includes('stress') || s.toLowerCase().includes('anxiety'))) {
    advice += '\n\n2. Practice the "3-3-3 technique" during moments of stress: name 3 things you can see, 3 things you can hear, and move 3 parts of your body to ground yourself in the present moment.';
  } else {
    advice += '\n\n2. Break down your larger goals into smaller, specific actions that can be accomplished within a week, creating momentum and a sense of progress.';
  }
  
  advice += '\n\n3. Consider starting a reflection practice where you review your progress weekly, celebrating wins (however small), learning from challenges, and adjusting your approach as needed.';
  
  advice += '\n\nRemember that personal growth isn\'t linear - it\'s a journey of continuous learning and adjustment. Trust the process and be compassionate with yourself along the way.';
  
  return advice;
}