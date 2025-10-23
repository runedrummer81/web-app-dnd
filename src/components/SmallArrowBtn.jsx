// components/SmallArrowBtn.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function SmallArrowBtn({ children, onClick, className = "" }) {
  return (
    <AnimatePresence>
<div className="relative inline-flex items-center justify-center group z-50">
      {/* Venstre pil */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileHover={{ opacity: 1, x: -35 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35.9 67.5"
          className="h-[40px] w-auto rotate-180 text-[#bf883c] drop-shadow-[0_0_10px_rgba(191,136,60,0.7)]"
        >
          <polyline
            fill="none"
            stroke="#bf883c"
            strokeWidth="4"
            strokeMiterlimit="10"
            points="1.4 66.8 34.5 33.8 1.4 .7"
          />
        </svg>
      </motion.div>

      {/* Selve knappen */}
      <motion.button
        onClick={onClick}
        className={`relative z-10 transition duration-200 ${className}`}
      >
        {children}
      </motion.button>

      {/* Højre pil */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        whileHover={{ opacity: 1, x: 35 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35.9 67.5"
          className="h-[40px] w-auto text-[#bf883c] drop-shadow-[0_0_10px_rgba(191,136,60,0.7)]"
        >
          <polyline
            fill="none"
            stroke="#bf883c"
            strokeWidth="4"
            strokeMiterlimit="10"
            points="1.4 66.8 34.5 33.8 1.4 .7"
          />
        </svg>
      </motion.div>
    </div>
    </AnimatePresence>
    
  );
}
