import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiceD20 } from "react-icons/fa";
import { GiD4, GiDiceEightFacesEight, GiD10, GiD12 } from "react-icons/gi";
import { IoDice } from "react-icons/io5";

export const DiceRoller = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [selectedDie, setSelectedDie] = useState({
    sides: 20,
    label: "d20",
    icon: FaDiceD20,
  });

  const dice = [
    { sides: 4, label: "d4", icon: GiD4 },
    { sides: 6, label: "d6", icon: IoDice },
    { sides: 8, label: "d8", icon: GiDiceEightFacesEight },
    { sides: 10, label: "d10", icon: GiD10 },
    { sides: 12, label: "d12", icon: GiD12 },
    { sides: 20, label: "d20", icon: FaDiceD20 },
  ];

  const createParticles = (isCritical) => {
    const particleCount = isCritical ? 50 : 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      angle: (360 / particleCount) * i,
      distance: Math.random() * 100 + 50,
      scale: Math.random() * 1 + 0.5,
      color: isCritical
        ? Math.random() > 0.5
          ? "#22c55e"
          : "#d9ca89"
        : "#BF883C",
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  };

  const createSparkles = (isSuccess) => {
    const sparkleCount = 30;
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 400,
      y: Math.random() * 400,
      delay: Math.random() * 0.5,
      duration: Math.random() * 1 + 0.8,
      color: isSuccess ? "#22c55e" : "#ef4444",
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);

    let rolls = 0;
    const maxRolls = 25;
    const rollInterval = setInterval(() => {
      const tempResult = Math.floor(Math.random() * selectedDie.sides) + 1;
      setActiveResult({
        value: tempResult,
        label: selectedDie.label,
        sides: selectedDie.sides,
      });
      rolls++;

      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * selectedDie.sides) + 1;
        const isCritical =
          selectedDie.sides === 20 && (finalResult === 20 || finalResult === 1);

        const newRoll = {
          id: Date.now(),
          value: finalResult,
          label: selectedDie.label,
          sides: selectedDie.sides,
          isCritical,
          isSuccess: finalResult === 20,
          isFail: finalResult === 1,
        };

        createParticles(isCritical);

        if (isCritical) {
          createSparkles(newRoll.isSuccess);
        }

        setActiveResult(newRoll);

        setTimeout(() => {
          setIsRolling(false);
        }, 1000);
      }
    }, 60);
  };

  const handleDieSelect = (die) => {
    setSelectedDie(die);
    setActiveResult(null);
  };

  const orbitingParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (360 / 20) * i,
    delay: i * 0.05,
  }));

  const SelectedIcon = selectedDie.icon;

  return (
    <div className=" overflow-hidden">
      {/* Main Container with Border Frame */}
      <div className="relative p-4overflow-hidden">
        {/* Main Dice Display - FIXED DIMENSIONS */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-square flex items-center justify-center mx-auto">
            {/* Layered Glow Effects */}
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity:
                  activeResult && !isRolling
                    ? [0.4, 0.2, 0.4]
                    : [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(217,202,137,0.6) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />

            <motion.div
              className="absolute inset-0"
              animate={{
                opacity:
                  activeResult && !isRolling
                    ? [0.3, 0.15, 0.3]
                    : [0.3, 0.6, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(191,136,60,0.5) 0%, transparent 50%)",
                filter: "blur(30px)",
              }}
            />

            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              className="absolute"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="strongGlow">
                  <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <radialGradient id="particleGradient">
                  <stop offset="0%" stopColor="#d9ca89" stopOpacity="1" />
                  <stop offset="100%" stopColor="#BF883C" stopOpacity="0.6" />
                </radialGradient>
              </defs>

              {/* Orbiting Particles */}
              <motion.g
                animate={{
                  opacity: activeResult && !isRolling ? 0.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {orbitingParticles.map((particle) => {
                  const radius = 140;
                  const angle = particle.angle;
                  const x = 200 + radius * Math.cos((angle * Math.PI) / 180);
                  const y = 200 + radius * Math.sin((angle * Math.PI) / 180);

                  return (
                    <motion.circle
                      key={particle.id}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="url(#particleGradient)"
                      filter="url(#strongGlow)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 1],
                        opacity: [0, 1, 0.8],
                        cx: [200, x],
                        cy: [200, y],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: particle.delay,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </motion.g>

              {/* Rotating Rings */}
              <motion.circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="#d9ca89"
                strokeWidth="2"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={{
                  pathLength: 1,
                  rotate: 360,
                  opacity: activeResult && !isRolling ? 0.1 : 0.3,
                }}
                transition={{
                  pathLength: { duration: 2, delay: 0.5 },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.3 },
                }}
                strokeDasharray="10 5"
              />

              <motion.circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#BF883C"
                strokeWidth="1.5"
                opacity="0.4"
                animate={{
                  rotate: -360,
                  opacity: activeResult && !isRolling ? 0.1 : 0.4,
                }}
                transition={{
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.3 },
                }}
                strokeDasharray="8 4"
              />

              {/* Sparkle Effects for Critical Hits */}
              <AnimatePresence>
                {sparkles.map((sparkle) => (
                  <motion.g key={sparkle.id}>
                    <motion.path
                      d={`M ${sparkle.x},${sparkle.y - 8} L ${sparkle.x + 2},${
                        sparkle.y - 2
                      } L ${sparkle.x + 8},${sparkle.y} L ${sparkle.x + 2},${
                        sparkle.y + 2
                      } L ${sparkle.x},${sparkle.y + 8} L ${sparkle.x - 2},${
                        sparkle.y + 2
                      } L ${sparkle.x - 8},${sparkle.y} L ${sparkle.x - 2},${
                        sparkle.y - 2
                      } Z`}
                      fill={sparkle.color}
                      filter="url(#strongGlow)"
                      initial={{ scale: 0, opacity: 0, rotate: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180],
                      }}
                      transition={{
                        duration: sparkle.duration,
                        delay: sparkle.delay,
                        ease: "easeOut",
                      }}
                    />
                  </motion.g>
                ))}
              </AnimatePresence>

              {/* Particle Burst Effects */}
              <AnimatePresence>
                {particles.map((particle) => {
                  const x =
                    200 +
                    particle.distance *
                      Math.cos((particle.angle * Math.PI) / 180);
                  const y =
                    200 +
                    particle.distance *
                      Math.sin((particle.angle * Math.PI) / 180);
                  return (
                    <motion.circle
                      key={particle.id}
                      cx="200"
                      cy="200"
                      r="3"
                      fill={particle.color}
                      filter="url(#strongGlow)"
                      initial={{
                        cx: 200,
                        cy: 200,
                        opacity: 1,
                        scale: particle.scale,
                      }}
                      animate={{ cx: x, cy: y, opacity: 0, scale: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  );
                })}
              </AnimatePresence>

              {/* Result Display */}
              <AnimatePresence mode="wait">
                {activeResult && (
                  <motion.g
                    key={activeResult.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fontSize={activeResult.isCritical ? "110" : "100"}
                      fontWeight="900"
                      fill={
                        activeResult.isCritical
                          ? activeResult.isSuccess
                            ? "#22c55e"
                            : "#ef4444"
                          : "#d9ca89"
                      }
                      style={{
                        filter: isRolling
                          ? "drop-shadow(0 0 40px rgba(217,202,137,1)) drop-shadow(0 0 20px rgba(217,202,137,1))"
                          : activeResult.isCritical
                          ? `drop-shadow(0 0 30px ${
                              activeResult.isSuccess ? "#22c55e" : "#ef4444"
                            })`
                          : "drop-shadow(0 0 25px rgba(217,202,137,0.9))",
                      }}
                      animate={
                        isRolling
                          ? { scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }
                          : { scale: [1, 1.05, 1] }
                      }
                      transition={
                        isRolling
                          ? { duration: 0.3, repeat: Infinity }
                          : { duration: 0.6, delay: 0.2 }
                      }
                    >
                      {activeResult.value}
                    </motion.text>

                    <motion.text
                      x="200"
                      y="260"
                      textAnchor="middle"
                      fontSize="16"
                      fill="#BF883C"
                      fontWeight="bold"
                      style={{
                        letterSpacing: "0.3em",
                        filter: "drop-shadow(0 0 12px rgba(191,136,60,0.8))",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {activeResult.label.toUpperCase()}
                    </motion.text>

                    {activeResult.isCritical && (
                      <>
                        <motion.circle
                          cx="200"
                          cy="200"
                          r="0"
                          fill="none"
                          stroke={
                            activeResult.isSuccess ? "#22c55e" : "#ef4444"
                          }
                          strokeWidth="4"
                          animate={{ r: [0, 180], opacity: [1, 0] }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                        <motion.text
                          x="200"
                          y="300"
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="bold"
                          fill={activeResult.isSuccess ? "#22c55e" : "#ef4444"}
                          style={{
                            letterSpacing: "0.3em",
                            filter: `drop-shadow(0 0 20px ${
                              activeResult.isSuccess ? "#22c55e" : "#ef4444"
                            })`,
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {activeResult.isSuccess ? "★ CRITICAL ★" : "☠ FAIL ☠"}
                        </motion.text>
                      </>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>

            {/* Main Dice Icon */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDie.label}
                className="relative z-10 cursor-pointer flex items-center justify-center"
                onClick={rollDice}
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={
                  isRolling
                    ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 360],
                        opacity: 1,
                      }
                    : {
                        scale: 1,
                        rotate: 0,
                        opacity: activeResult && !isRolling ? 0.15 : 1,
                      }
                }
                transition={
                  isRolling
                    ? {
                        scale: { duration: 0.3, repeat: Infinity },
                        rotate: {
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }
                    : {
                        scale: {
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                        },
                        rotate: { duration: 0.3, ease: "easeOut" },
                        opacity: { duration: 0.2 },
                      }
                }
                exit={{
                  scale: 0,
                  rotate: 90,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    filter:
                      activeResult && !isRolling
                        ? "drop-shadow(0 0 10px rgba(217,202,137,0.3)) drop-shadow(0 0 20px rgba(217,202,137,0.2))"
                        : [
                            "drop-shadow(0 0 20px rgba(217,202,137,0.8)) drop-shadow(0 0 40px rgba(217,202,137,0.4))",
                            "drop-shadow(0 0 30px rgba(217,202,137,1)) drop-shadow(0 0 60px rgba(217,202,137,0.6))",
                            "drop-shadow(0 0 20px rgba(217,202,137,0.8)) drop-shadow(0 0 40px rgba(217,202,137,0.4))",
                          ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <SelectedIcon size={120} color="#d9ca89" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Dice Selector */}
        <div className="relative mb-3 lg:mb-4">
          <div className="flex justify-center gap-2">
            {dice.map((die) => {
              const Icon = die.icon;
              return (
                <motion.button
                  key={die.label}
                  onClick={() => handleDieSelect(die)}
                  className={`relative p-2 border-2 transition-all duration-300 ${
                    selectedDie.label === die.label
                      ? "border-[#d9ca89] bg-[#d9ca89]/10"
                      : "border-[#BF883C]/30 hover:border-[#BF883C]/60"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow:
                      selectedDie.label === die.label
                        ? "0 0 20px rgba(217,202,137,0.4)"
                        : "none",
                  }}
                >
                  <Icon
                    size={20}
                    className={
                      selectedDie.label === die.label
                        ? "text-[#d9ca89]"
                        : "text-[#BF883C]"
                    }
                    style={{
                      filter:
                        selectedDie.label === die.label
                          ? "drop-shadow(0 0 8px rgba(217,202,137,0.6))"
                          : "none",
                    }}
                  />
                  <div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] uppercase tracking-wider font-bold whitespace-nowrap"
                    style={{
                      color:
                        selectedDie.label === die.label ? "#d9ca89" : "#BF883C",
                      textShadow:
                        selectedDie.label === die.label
                          ? "0 0 10px rgba(217,202,137,0.5)"
                          : "none",
                    }}
                  >
                    {die.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
