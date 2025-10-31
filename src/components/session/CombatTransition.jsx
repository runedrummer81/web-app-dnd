// src/components/RunSession/CombatTransition.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const CombatTransition = ({ type, isVisible, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (type === "enter") {
      const timers = [
        setTimeout(() => setStage(1), 200), // Initial rumble
        setTimeout(() => setStage(2), 800), // Vignette + slash lines
        setTimeout(() => setStage(3), 1400), // Text appears
        setTimeout(() => setStage(4), 2800), // Intensify
        setTimeout(() => setStage(5), 3800), // Final fade
        setTimeout(() => {
          setStage(0);
          onComplete();
        }, 4800),
      ];
      return () => timers.forEach(clearTimeout);
    }

    if (type === "exit") {
      const timers = [
        setTimeout(() => setStage(1), 300),
        setTimeout(() => setStage(2), 1000),
        setTimeout(() => setStage(3), 2500),
        setTimeout(() => {
          setStage(0);
          onComplete();
        }, 3800),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isVisible, type, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ENTER COMBAT */}
        {type === "enter" && (
          <>
            {/* Screen shake effect */}
            {stage >= 1 && stage < 5 && (
              <motion.div
                className="fixed inset-0"
                animate={{
                  x: stage >= 2 ? [0, -8, 8, -6, 6, -4, 4, 0] : 0,
                  y: stage >= 2 ? [0, 6, -6, 4, -4, 2, -2, 0] : 0,
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
                  repeat: stage >= 2 && stage < 4 ? Infinity : 0,
                  repeatDelay: 1.5,
                }}
              />
            )}

            {/* Deep black background */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />

            {/* Blood red vignette - more intense */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 0%, rgba(100, 0, 0, 0.5) 40%, rgba(40, 0, 0, 0.95) 100%)",
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: stage >= 2 ? 1 : 0,
                scale: stage >= 2 ? 1 : 1.5,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Animated crackling energy border */}
            <motion.div
              className="absolute inset-0"
              style={{
                border: "4px solid transparent",
                borderImage:
                  "linear-gradient(45deg, #8B0000, #DC143C, #FF0000, #8B0000) 1",
                boxShadow: "inset 0 0 150px rgba(139, 0, 0, 0.6)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: stage >= 2 ? [0, 0.8, 0.6] : 0,
                scale: stage >= 2 ? [0.9, 1, 1] : 0.9,
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.5, 1],
                ease: "easeOut",
              }}
            />

            {/* Multiple slash effects */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(220, 20, 60, 0.8) 30%, rgba(220, 20, 60, 0.8) 70%, transparent 100%)",
                    transform: `rotate(${-15 + i * 2}deg)`,
                    boxShadow: "0 0 20px rgba(220, 20, 60, 0.6)",
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={
                    stage >= 2
                      ? {
                          scaleY: [0, 1.5, 1],
                          opacity: [0, 1, 0.7],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Expanding shockwave rings */}
            {stage >= 2 &&
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-600"
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: [0, 1200, 1600],
                    height: [0, 1200, 1600],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                  style={{
                    boxShadow: "0 0 30px rgba(220, 20, 60, 0.8)",
                  }}
                />
              ))}

            {/* Main text container with dramatic entrance */}
            <motion.div
              className="relative z-10 text-center px-8"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{
                opacity: stage >= 3 ? 1 : 0,
                y: stage >= 3 ? 0 : 50,
                scale: stage >= 3 ? 1 : 0.8,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Dramatic top flourish */}
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-1"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  stage >= 3
                    ? { scaleX: 1, opacity: 0.8 }
                    : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-red-600 to-transparent" />
              </motion.div>

              {/* COMBAT title - more dramatic */}
              <motion.h1
                className="text-[12rem] font-black uppercase tracking-[0.4em] mb-8 leading-none"
                style={{
                  fontFamily: "EB Garamond, serif",
                  background:
                    "linear-gradient(to bottom, #FF4444 0%, #CC0000 50%, #880000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter:
                    "drop-shadow(0 0 40px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 80px rgba(220, 20, 60, 0.4))",
                }}
                animate={
                  stage >= 4
                    ? {
                        filter: [
                          "drop-shadow(0 0 40px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 80px rgba(220, 20, 60, 0.4))",
                          "drop-shadow(0 0 60px rgba(220, 20, 60, 1)) drop-shadow(0 0 120px rgba(220, 20, 60, 0.6))",
                          "drop-shadow(0 0 40px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 80px rgba(220, 20, 60, 0.4))",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                COMBAT
              </motion.h1>

              {/* Subtitle - changed to "Enemies are approaching" */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: stage >= 3 ? 1 : 0,
                  y: stage >= 3 ? 0 : 30,
                }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                <div className="h-px w-96 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent mb-8 shadow-[0_0_20px_rgba(220,20,60,0.6)]" />
                <motion.p
                  className="text-4xl text-red-400 font-bold uppercase tracking-[0.5em] italic"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow:
                      "0 0 30px rgba(220, 20, 60, 0.8), 0 2px 10px rgba(0,0,0,0.8)",
                  }}
                  animate={
                    stage >= 4
                      ? {
                          opacity: [0.8, 1, 0.8],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Enemies are approaching...
                </motion.p>
                <div className="h-px w-96 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent mt-8 shadow-[0_0_20px_rgba(220,20,60,0.6)]" />
              </motion.div>

              {/* Bottom flourish */}
              <motion.div
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-1"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  stage >= 3
                    ? { scaleX: 1, opacity: 0.8 }
                    : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-red-600 to-transparent" />
              </motion.div>
            </motion.div>

            {/* Enhanced particle storm */}
            {stage >= 3 &&
              [...Array(40)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    background:
                      i % 3 === 0
                        ? "#FF0000"
                        : i % 3 === 1
                        ? "#DC143C"
                        : "#8B0000",
                    filter: "blur(1px)",
                    boxShadow: `0 0 ${
                      Math.random() * 20 + 10
                    }px rgba(220, 20, 60, 0.8)`,
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2, 1.5, 0],
                    x:
                      Math.cos((i * Math.PI * 2) / 40) *
                      (300 + Math.random() * 300),
                    y:
                      Math.sin((i * Math.PI * 2) / 40) *
                      (300 + Math.random() * 300),
                    opacity: [0, 0.9, 0.7, 0],
                  }}
                  transition={{
                    duration: 2.5 + Math.random(),
                    ease: "easeOut",
                    delay: i * 0.03,
                  }}
                />
              ))}

            {/* Ember particles rising */}
            {stage >= 3 &&
              [...Array(20)].map((_, i) => (
                <motion.div
                  key={`ember-${i}`}
                  className="absolute w-1 h-1 bg-orange-500 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: 0,
                    filter: "blur(0.5px)",
                    boxShadow: "0 0 10px rgba(255, 100, 0, 0.8)",
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: -window.innerHeight,
                    opacity: [0, 1, 0],
                    x: (Math.random() - 0.5) * 100,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}

            {/* Final dramatic fade to black */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 5 ? [0, 1, 1, 0] : 0 }}
              transition={{
                duration: 2,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
            />
          </>
        )}

        {/* EXIT COMBAT - Keep existing but slightly enhanced */}
        {type === "exit" && (
          <>
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)",
              }}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                scale: stage >= 1 ? 1 : 1.2,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <motion.div
              className="relative z-10 text-center px-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                scale: stage >= 1 ? 1 : 0.8,
              }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.h1
                className="text-9xl font-black uppercase tracking-[0.3em] mb-6"
                style={{
                  fontFamily: "EB Garamond, serif",
                  color: "#BF883C",
                  textShadow: `
                    0 0 40px rgba(191, 136, 60, 0.8),
                    0 0 80px rgba(191, 136, 60, 0.4),
                    0 4px 20px rgba(0, 0, 0, 0.9)
                  `,
                }}
                animate={
                  stage >= 2
                    ? {
                        textShadow: [
                          "0 0 40px rgba(191, 136, 60, 0.8), 0 0 80px rgba(191, 136, 60, 0.4)",
                          "0 0 60px rgba(191, 136, 60, 1), 0 0 100px rgba(191, 136, 60, 0.6)",
                          "0 0 40px rgba(191, 136, 60, 0.8), 0 0 80px rgba(191, 136, 60, 0.4)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                VICTORY
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: stage >= 2 ? 1 : 0,
                  y: stage >= 2 ? 0 : 20,
                }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-[#BF883C] to-transparent mb-4" />
                <p
                  className="text-2xl text-[#BF883C]/80 font-bold uppercase tracking-[0.4em]"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  Combat Concluded
                </p>
                <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-[#BF883C] to-transparent mt-4" />
              </motion.div>
            </motion.div>

            {stage >= 2 &&
              [...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: "50%",
                    top: "30%",
                    background: "#BF883C",
                    boxShadow: "0 0 15px rgba(191, 136, 60, 0.8)",
                    filter: "blur(1px)",
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 1, 0],
                    x: (Math.random() - 0.5) * 700,
                    y: Math.random() * 600 + 100,
                    opacity: [0, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}

            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 3 ? [0, 1, 1, 0] : 0 }}
              transition={{
                duration: 2,
                times: [0, 0.4, 0.8, 1],
                ease: "easeInOut",
              }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
