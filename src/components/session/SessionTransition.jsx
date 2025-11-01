// src/components/session/SessionTransition.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SessionTransition({ isVisible, onComplete }) {
  const [phase, setPhase] = useState("fadeIn"); // fadeIn -> animation -> navigate

  useEffect(() => {
    if (!isVisible) return;

    // Phase timing
    const fadeInTimer = setTimeout(() => setPhase("animation"), 500);
    const navigateTimer = setTimeout(() => {
      setPhase("navigate");
      if (onComplete) onComplete(); // Navigate while still showing black screen
    }, 2800); // Navigate slightly before animation would finish

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(navigateTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // Stay at full opacity
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Magical particles flowing */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: "0 0 10px #FFD700, 0 0 20px rgba(255,215,0,0.5)",
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Central ornate frame - fade out before navigation */}
        <motion.div
          className="relative w-[600px] h-[400px] border-4 border-[#BF883C] bg-black/80"
          initial={{ scale: 0, rotate: -10 }}
          animate={{
            scale: phase === "navigate" ? 0.95 : 1,
            rotate: 0,
            opacity: phase === "navigate" ? 0 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3,
          }}
          style={{
            boxShadow:
              "0 0 60px rgba(191, 136, 60, 0.8), inset 0 0 40px rgba(191, 136, 60, 0.2)",
          }}
        >
          {/* Ornate corners */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37 36"
            className="absolute top-0 left-0 w-12 h-12 rotate-[270deg]"
            fill="none"
            strokeWidth="2"
          >
            <path d="M35.178,1.558l0,32.25" stroke="#d9ca89" />
            <path d="M35.178,1.558l-33.179,-0" stroke="#d9ca89" />
            <path d="M26.941,9.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,25.571l8.237,8.237" stroke="#d9ca89" />
            <path d="M1.999,1.558l8,8" stroke="#d9ca89" />
            <path d="M18.911,1.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,9.558l-16.705,-0" stroke="#d9ca89" />
            <path d="M34.971,17.588l-16.06,-0" stroke="#d9ca89" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37 36"
            className="absolute top-0 right-0 w-12 h-12"
            fill="none"
            strokeWidth="2"
          >
            <path d="M35.178,1.558l0,32.25" stroke="#d9ca89" />
            <path d="M35.178,1.558l-33.179,-0" stroke="#d9ca89" />
            <path d="M26.941,9.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,25.571l8.237,8.237" stroke="#d9ca89" />
            <path d="M1.999,1.558l8,8" stroke="#d9ca89" />
            <path d="M18.911,1.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,9.558l-16.705,-0" stroke="#d9ca89" />
            <path d="M34.971,17.588l-16.06,-0" stroke="#d9ca89" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37 36"
            className="absolute bottom-0 left-0 w-12 h-12 rotate-[180deg]"
            fill="none"
            strokeWidth="2"
          >
            <path d="M35.178,1.558l0,32.25" stroke="#d9ca89" />
            <path d="M35.178,1.558l-33.179,-0" stroke="#d9ca89" />
            <path d="M26.941,9.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,25.571l8.237,8.237" stroke="#d9ca89" />
            <path d="M1.999,1.558l8,8" stroke="#d9ca89" />
            <path d="M18.911,1.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,9.558l-16.705,-0" stroke="#d9ca89" />
            <path d="M34.971,17.588l-16.06,-0" stroke="#d9ca89" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37 36"
            className="absolute bottom-0 right-0 w-12 h-12 rotate-[90deg]"
            fill="none"
            strokeWidth="2"
          >
            <path d="M35.178,1.558l0,32.25" stroke="#d9ca89" />
            <path d="M35.178,1.558l-33.179,-0" stroke="#d9ca89" />
            <path d="M26.941,9.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,25.571l8.237,8.237" stroke="#d9ca89" />
            <path d="M1.999,1.558l8,8" stroke="#d9ca89" />
            <path d="M18.911,1.558l0,16.06" stroke="#d9ca89" />
            <path d="M26.941,9.558l-16.705,-0" stroke="#d9ca89" />
            <path d="M34.971,17.588l-16.06,-0" stroke="#d9ca89" />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Compass/Map symbol */}
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 12,
                delay: 0.5,
              }}
            >
              {/* Outer circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#BF883C"
                strokeWidth="3"
              />

              {/* Inner decorative circles */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#d9ca89"
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Compass points */}
              <motion.path
                d="M 60 10 L 65 50 L 60 60 L 55 50 Z"
                fill="#FFD700"
                stroke="#8B6914"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              />

              <motion.path
                d="M 110 60 L 70 65 L 60 60 L 70 55 Z"
                fill="#BF883C"
                stroke="#8B6914"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              />

              <motion.path
                d="M 60 110 L 55 70 L 60 60 L 65 70 Z"
                fill="#BF883C"
                stroke="#8B6914"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              />

              <motion.path
                d="M 10 60 L 50 55 L 60 60 L 50 65 Z"
                fill="#BF883C"
                stroke="#8B6914"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              />

              {/* Center circle */}
              <circle
                cx="60"
                cy="60"
                r="8"
                fill="#FFD700"
                stroke="#8B6914"
                strokeWidth="2"
              />

              {/* Rotating runes */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformOrigin: "60px 60px" }}
              >
                <text
                  x="60"
                  y="25"
                  textAnchor="middle"
                  fill="#BF883C"
                  fontSize="14"
                  fontFamily="serif"
                >
                  N
                </text>
                <text
                  x="95"
                  y="63"
                  textAnchor="middle"
                  fill="#BF883C"
                  fontSize="14"
                  fontFamily="serif"
                >
                  E
                </text>
                <text
                  x="60"
                  y="98"
                  textAnchor="middle"
                  fill="#BF883C"
                  fontSize="14"
                  fontFamily="serif"
                >
                  S
                </text>
                <text
                  x="25"
                  y="63"
                  textAnchor="middle"
                  fill="#BF883C"
                  fontSize="14"
                  fontFamily="serif"
                >
                  W
                </text>
              </motion.g>
            </motion.svg>

            {/* Text animations */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.h1
                className="text-4xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] mb-3"
                style={{
                  fontFamily: "EB Garamond, serif",
                  textShadow: "0 0 30px rgba(217,202,137,0.8)",
                }}
              >
                The Journey Begins
              </motion.h1>

              {/* Loading bar */}
              <div className="w-80 h-1 bg-black/60 border border-[#BF883C] mx-auto mt-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#BF883C] via-[#FFD700] to-[#BF883C]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.3, ease: "easeInOut", delay: 0.5 }}
                  style={{
                    boxShadow: "0 0 20px rgba(255,215,0,0.8)",
                  }}
                />
              </div>

              <motion.p
                className="text-[#BF883C] text-sm uppercase tracking-widest mt-4"
                style={{ fontFamily: "EB Garamond, serif" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Preparing the realm...
              </motion.p>
            </motion.div>
          </div>

          {/* Pulsing glow effect */}
          <motion.div
            className="absolute inset-0 border-2 border-[#FFD700] pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Expanding light rays */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(191,136,60,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
