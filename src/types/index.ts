export interface UserData {
  coreValues: string[];
  lifeGoals: string[];
  currentStruggles: string[];
  idealSelf: string;
  currentDecision: string;
}

export type FormStep = 'values' | 'goals' | 'struggles' | 'idealSelf' | 'decision' | 'results';