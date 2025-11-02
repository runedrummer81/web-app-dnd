import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  // Reset to step 0 when route changes
  useEffect(() => {
    setCurrentStep(0);
  }, [location.pathname]);

  const toggleOnboarding = () => {
    setIsActive((prev) => !prev);
    setCurrentStep(0); // Reset to first step when toggling
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const skipOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const value = {
    isActive,
    currentStep,
    currentRoute: location.pathname,
    toggleOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    setCurrentStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ✅ Moved hook to separate export to fix Fast Refresh warning
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
