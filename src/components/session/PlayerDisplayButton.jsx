import { motion } from "framer-motion";
import { useState } from "react";

export const PlayerDisplayButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative p-6">
      {/* Pulsing Glow Background */}
      <motion.div
        className="absolute inset-0 opacity-30 blur-2xl pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle, rgba(191,136,60,0.4) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(217,202,137,0.6) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(191,136,60,0.4) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Button Container */}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative w-full bg-gradient-to-br from-[#BF883C] to-[#8b6429] p-6 overflow-hidden group"
        style={{
          clipPath:
            "polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)",
          boxShadow:
            "0 0 30px rgba(191,136,60,0.5), inset 0 0 20px rgba(0,0,0,0.2)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            "0 0 40px rgba(217,202,137,0.8), inset 0 0 30px rgba(0,0,0,0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            "0 0 30px rgba(191,136,60,0.5), inset 0 0 20px rgba(0,0,0,0.2)",
            "0 0 35px rgba(217,202,137,0.6), inset 0 0 25px rgba(0,0,0,0.2)",
            "0 0 30px rgba(191,136,60,0.5), inset 0 0 20px rgba(0,0,0,0.2)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#d9ca89]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#d9ca89]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#d9ca89]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#d9ca89]" />

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
          initial={{ x: "-100%" }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.6 }}
        />

        {/* Inner Border */}
        <div
          className="absolute inset-2 border border-[#d9ca89]/40 pointer-events-none"
          style={{
            clipPath:
              "polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)",
          }}
        />

        {/* Button Content */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          {/* Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#151612"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-center"
            animate={{
              textShadow: [
                "0 0 10px rgba(21,22,18,0.5)",
                "0 0 15px rgba(21,22,18,0.7)",
                "0 0 10px rgba(21,22,18,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="text-xl font-bold uppercase tracking-[0.3em] text-[#151612]"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Open Player Display
            </div>
            <div
              className="text-xs uppercase tracking-[0.2em] text-[#151612]/70 mt-1"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Begin Session
            </div>
          </motion.div>
        </div>

        {/* Animated Particles */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#d9ca89] rounded-full opacity-50"
          animate={{
            scale: [0, 1.5, 0],
            x: [-20, 20],
            y: [-20, -40],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#d9ca89] rounded-full opacity-50"
          animate={{
            scale: [0, 1.5, 0],
            x: [20, -20],
            y: [-20, -40],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
      </motion.button>

      {/* Decorative Lines Below Button */}
      <div className="flex gap-2 mt-3 justify-center">
        <motion.div
          className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BF883C]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="h-[2px] w-4 bg-[#d9ca89]"
          animate={{
            scaleX: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BF883C]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </div>
  );
};
