// AI advice utility functions
export const getAIAdvice = async (formData: any): Promise<string> => {
  // Simulate AI advice generation based on form data
  const { coreValues, lifeGoals, currentStruggles, idealSelf, decision } = formData;
  
  // Create a comprehensive advice based on the user's input
  const advice = generateAdvice(coreValues, lifeGoals, currentStruggles, idealSelf, decision);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return advice;
};

const generateAdvice = (
  coreValues: string[],
  lifeGoals: string[],
  currentStruggles: string[],
  idealSelf: string,
  decision: string
): string => {
  const valuesList = coreValues.join(', ');
  const goalsList = lifeGoals.join(', ');
  const strugglesList = currentStruggles.join(', ');
  
  return `Based on your core values of ${valuesList}, your life goals of ${goalsList}, and considering your current struggles with ${strugglesList}, here's my advice for your decision about "${decision}":

Your ideal self vision of "${idealSelf}" provides a clear north star for this decision. 

**Key Considerations:**
• Align this decision with your core values, especially ${coreValues[0] || 'your primary value'}
• Consider how this choice moves you closer to ${lifeGoals[0] || 'your main goal'}
• Address the challenge of ${currentStruggles[0] || 'your primary struggle'} in your approach

**Recommended Action:**
Take time to reflect on whether this decision brings you closer to your ideal self. If it aligns with your values and goals while helping you overcome your struggles, it's likely the right path forward.

**Next Steps:**
1. Create a concrete plan with specific milestones
2. Identify potential obstacles and prepare solutions
3. Set up accountability measures to track your progress
4. Remember that growth often requires stepping outside your comfort zone

Trust your instincts while staying true to your values. You have the wisdom within you to make the right choice.`;
};