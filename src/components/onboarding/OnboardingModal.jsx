import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "../onboarding/OnboardingContext";
import {
  onboardingSteps,
  defaultOnboarding,
} from "../onboarding/onboardingContent";

export default function OnboardingModal() {
  const {
    isActive,
    currentStep,
    currentRoute,
    nextStep,
    prevStep,
    skipOnboarding,
    setCurrentStep,
  } = useOnboarding();

  // Get steps for current route or use default
  const steps = onboardingSteps[currentRoute] || defaultOnboarding;
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={skipOnboarding}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Parchment-style container */}
            <div className="relative bg-[#1C1B18] border-4 border-[var(--primary)] shadow-[0_0_60px_rgba(191,136,60,0.5)] overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--secondary)]/30" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--secondary)]/30" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[var(--secondary)]/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--secondary)]/30" />

              {/* Content */}
              <div className="relative p-12">
                {/* Skip button */}
                <button
                  onClick={skipOnboarding}
                  className="absolute top-6 right-6 text-[var(--secondary)] hover:text-red-400 transition text-2xl"
                  title="Close tutorial"
                >
                  ✕
                </button>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2
                      className="text-4xl font-bold text-[var(--primary)] uppercase tracking-[0.2em] mb-6 text-center"
                      style={{
                        fontFamily: "EB Garamond, serif",
                        textShadow: "0 0 20px rgba(191,136,60,0.4)",
                      }}
                    >
                      {currentStepData.title}
                    </h2>

                    <div className="h-[2px] w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent" />

                    <p
                      className="text-[var(--secondary)] text-lg leading-relaxed text-center mb-8"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {currentStepData.content}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)} // ✅ Fixed: use the already destructured function
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "w-8 bg-[var(--primary)]"
                          : "w-2 bg-[var(--secondary)]/30 hover:bg-[var(--secondary)]/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={`flex items-center gap-2 px-6 py-3 border-2 transition uppercase tracking-wider font-semibold ${
                      isFirstStep
                        ? "border-[var(--secondary)]/20 text-[var(--secondary)]/20 cursor-not-allowed"
                        : "border-[var(--secondary)] text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 48 41"
                      fill="currentColor"
                      className="rotate-0"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M47 39.8119C41.3727 32.9601 36.3755 29.0724 32.0086 28.1486C27.6417 27.2248 23.484 27.0853 19.5357 27.7299V40L1 19.9781L19.5357 1V12.6621C26.8367 12.7195 33.0436 15.3321 38.1565 20.5C43.2686 25.6679 46.2165 32.1052 47 39.8119Z"
                      />
                    </svg>
                    Back
                  </button>

                  {isLastStep ? (
                    <button
                      onClick={skipOnboarding}
                      className="px-8 py-3 bg-[var(--primary)] text-[#1C1B18] border-2 border-[var(--primary)] hover:bg-[var(--secondary)] hover:border-[var(--secondary)] transition uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(191,136,60,0.4)]"
                    >
                      Get Started
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#1C1B18] transition uppercase tracking-wider font-semibold"
                    >
                      Next
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 48 41"
                        fill="currentColor"
                        className="rotate-180"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M47 39.8119C41.3727 32.9601 36.3755 29.0724 32.0086 28.1486C27.6417 27.2248 23.484 27.0853 19.5357 27.7299V40L1 19.9781L19.5357 1V12.6621C26.8367 12.7195 33.0436 15.3321 38.1565 20.5C43.2686 25.6679 46.2165 32.1052 47 39.8119Z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
