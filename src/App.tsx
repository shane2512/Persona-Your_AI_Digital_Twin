import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ReflectionInput from './components/ReflectionInput';
import FormStepper from './components/FormStepper';
import CoreValuesStep from './components/FormSteps/CoreValuesStep';
import LifeGoalsStep from './components/FormSteps/LifeGoalsStep';
import CurrentStrugglesStep from './components/FormSteps/CurrentStrugglesStep';
import IdealSelfStep from './components/FormSteps/IdealSelfStep';
import DecisionStep from './components/FormSteps/DecisionStep';
import ResultsStep from './components/FormSteps/ResultsStep';
import { FormStep, UserData } from './types';

type AppView = 'landing' | 'reflection' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentStep, setCurrentStep] = useState<FormStep>('values');
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
  
  const [userData, setUserData] = useState<UserData>({
    coreValues: [],
    lifeGoals: [],
    currentStruggles: [],
    idealSelf: '',
    currentDecision: '',
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    switch (currentStep) {
      case 'values':
        setCurrentStep('goals');
        break;
      case 'goals':
        setCurrentStep('struggles');
        break;
      case 'struggles':
        setCurrentStep('idealSelf');
        break;
      case 'idealSelf':
        setCurrentStep('decision');
        break;
      case 'decision':
        setCurrentStep('results');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'goals':
        setCurrentStep('values');
        break;
      case 'struggles':
        setCurrentStep('goals');
        break;
      case 'idealSelf':
        setCurrentStep('struggles');
        break;
      case 'decision':
        setCurrentStep('idealSelf');
        break;
      case 'results':
        setCurrentStep('decision');
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setUserData({
      coreValues: [],
      lifeGoals: [],
      currentStruggles: [],
      idealSelf: '',
      currentDecision: '',
    });
    setCurrentStep('values');
    setCompletedSteps([]);
    setCurrentView('landing');
  };

  const startReflection = () => {
    setCurrentView('form');
    setCurrentStep('values');
    setCompletedSteps([]);
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <LandingPage 
            key="landing"
            onGetStarted={() => setCurrentView('reflection')}
            onStartReflection={startReflection}
          />
        )}
        
        {currentView === 'reflection' && (
          <ReflectionInput 
            key="reflection"
            onStartReflection={startReflection}
            onBack={() => setCurrentView('landing')}
          />
        )}
        
        {currentView === 'form' && (
          <div key="form">
            <FormStepper currentStep={currentStep} completedSteps={completedSteps} />
            
            <AnimatePresence mode="wait">
              {currentStep === 'values' && (
                <CoreValuesStep 
                  key="values-step"
                  userData={userData} 
                  updateUserData={updateUserData} 
                  onNext={handleNext} 
                />
              )}
              
              {currentStep === 'goals' && (
                <LifeGoalsStep 
                  key="goals-step"
                  userData={userData} 
                  updateUserData={updateUserData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 'struggles' && (
                <CurrentStrugglesStep 
                  key="struggles-step"
                  userData={userData} 
                  updateUserData={updateUserData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 'idealSelf' && (
                <IdealSelfStep 
                  key="ideal-self-step"
                  userData={userData} 
                  updateUserData={updateUserData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 'decision' && (
                <DecisionStep 
                  key="decision-step"
                  userData={userData} 
                  updateUserData={updateUserData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 'results' && (
                <ResultsStep 
                  key="results-step"
                  userData={userData}
                  onBack={handleBack}
                  onReset={handleReset}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;