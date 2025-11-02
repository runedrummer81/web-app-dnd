// src/components/RunSession/CombatTransition.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const CombatTransition = ({ type, isVisible, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (type === "enter") {
      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 800),
        setTimeout(() => setStage(3), 1400),
        setTimeout(() => setStage(4), 2800),
        setTimeout(() => setStage(5), 3800),
        setTimeout(() => {
          setStage(0);
          onComplete();
        }, 4500),
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
        {/* ENTER COMBAT - DARK RED EVIL THEME */}
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

            {/* DARK RED ominous vignette */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 0%, rgba(60, 0, 0, 0.7) 40%, rgba(20, 0, 0, 0.95) 100%)",
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: stage >= 2 ? 1 : 0,
                scale: stage >= 2 ? 1 : 1.5,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Dark crimson energy border */}
            <motion.div
              className="absolute inset-0"
              style={{
                border: "4px solid #5C0A0A",
                boxShadow: "inset 0 0 150px rgba(92, 10, 10, 0.8)",
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

            {/* Dark red slash marks */}
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
                      "linear-gradient(to bottom, transparent 0%, rgba(92, 10, 10, 0.9) 30%, rgba(60, 0, 0, 0.9) 70%, transparent 100%)",
                    transform: `rotate(${-15 + i * 2}deg)`,
                    boxShadow: "0 0 20px rgba(92, 10, 10, 0.8)",
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

            {/* Expanding dark red shockwave rings */}
            {stage >= 2 &&
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                  style={{
                    borderColor: "#5C0A0A",
                    boxShadow: "0 0 30px rgba(92, 10, 10, 0.8)",
                  }}
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
                />
              ))}

            {/* Main text container */}
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
              {/* Top flourish */}
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
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[#5C0A0A] to-transparent" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-[#800020] to-transparent" />
              </motion.div>

              {/* COMBAT title - DARK RED */}
              <motion.h1
                className="text-[12rem] font-black uppercase tracking-[0.4em] mb-8 leading-none"
                style={{
                  fontFamily: "EB Garamond, serif",
                  color: "#8B0000",
                  textShadow:
                    "0 0 60px rgba(139, 0, 0, 0.9), 0 0 100px rgba(92, 10, 10, 0.6), 0 4px 20px rgba(0,0,0,1)",
                }}
                animate={
                  stage >= 4
                    ? {
                        textShadow: [
                          "0 0 60px rgba(139, 0, 0, 0.9), 0 0 100px rgba(92, 10, 10, 0.6)",
                          "0 0 80px rgba(139, 0, 0, 1), 0 0 120px rgba(92, 10, 10, 0.8)",
                          "0 0 60px rgba(139, 0, 0, 0.9), 0 0 100px rgba(92, 10, 10, 0.6)",
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

              {/* Subtitle */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: stage >= 3 ? 1 : 0,
                  y: stage >= 3 ? 0 : 30,
                }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                <div className="h-px w-96 mx-auto bg-gradient-to-r from-transparent via-[#5C0A0A] to-transparent mb-8 shadow-[0_0_20px_rgba(92,10,10,0.8)]" />
                <motion.p
                  className="text-4xl text-[#8B0000] font-bold uppercase tracking-[0.5em] italic"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow:
                      "0 0 40px rgba(139, 0, 0, 0.9), 0 2px 10px rgba(0,0,0,0.9)",
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
                <div className="h-px w-96 mx-auto bg-gradient-to-r from-transparent via-[#5C0A0A] to-transparent mt-8 shadow-[0_0_20px_rgba(92,10,10,0.8)]" />
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
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[#5C0A0A] to-transparent" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-[#800020] to-transparent" />
              </motion.div>
            </motion.div>

            {/* Dark red particles */}
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
                        ? "#8B0000"
                        : i % 3 === 1
                        ? "#5C0A0A"
                        : "#3C0000",
                    filter: "blur(1px)",
                    boxShadow: `0 0 ${
                      Math.random() * 15 + 10
                    }px rgba(139, 0, 0, 0.8)`,
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

            {/* Dark embers rising */}
            {stage >= 3 &&
              [...Array(20)].map((_, i) => (
                <motion.div
                  key={`ember-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-[#8B0000]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: 0,
                    filter: "blur(0.5px)",
                    boxShadow: "0 0 8px rgba(139, 0, 0, 0.9)",
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

            {/* Ominous symbol - faint */}
            {stage >= 3 && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] opacity-5 pointer-events-none"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 0.08 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  color: "#5C0A0A",
                  textShadow: "0 0 100px rgba(92, 10, 10, 0.5)",
                  fontFamily: "serif",
                }}
              >
                ⚔
              </motion.div>
            )}

            {/* Final fade to black */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 5 ? 1 : 0 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        {/* EXIT COMBAT - VICTORY (keep golden) */}
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
