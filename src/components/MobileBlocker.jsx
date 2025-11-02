// src/components/MobileBlocker.jsx
import { motion } from "framer-motion";

export default function MobileBlocker() {
  return (
    <div className="fixed inset-0 bg-[#151612] flex items-center justify-center overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23BF883C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Border frame - FILLS ENTIRE SCREEN */}
        <div className="absolute inset-0 border-4 border-[#BF883C] bg-[#1a1814]">
          {/* Corner decorations - AT SCREEN CORNERS */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37 36"
            className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 rotate-[270deg]"
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
            className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8"
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
            className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 rotate-[180deg]"
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
            className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 rotate-[90deg]"
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

          {/* Content wrapper - perfectly centered with safe padding */}
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 overflow-y-auto">
            <div className="flex flex-col items-center space-y-2 max-w-2xl w-full">
              {/* Logo - HUGE on all screens */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="flex justify-center mb-2"
              >
                <motion.img
                  src="images/logo.svg"
                  alt="Logo"
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain"
                  style={{
                    filter:
                      "drop-shadow(0 0 5px rgba(217, 202, 137, 0.9)) drop-shadow(0 0 1px rgba(191, 136, 60, 0.7))",
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#d9ca89] uppercase text-center tracking-[0.2em] sm:tracking-[0.3em] px-2"
                style={{
                  fontFamily: "EB Garamond, serif",
                  textShadow: "0 0 20px rgba(217, 202, 137, 0.6)",
                }}
              >
                Quest Unavailable
              </motion.h1>

              {/* Decorative divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="h-[2px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#BF883C] to-transparent mt-2 mb-3"
              />

              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-[#BF883C] text-center space-y-2 px-2"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                <p className="text-sm sm:text-base leading-relaxed">
                  Brave adventurer, you have attempted to access the Overseers
                  Vault using a device of insufficient size!
                </p>

                <p className="text-xs sm:text-sm leading-relaxed">
                  This campaign management system requires the vast canvas of a
                  laptop or desktop screen to properly display its intricate
                  maps, detailed DM-tools, and sprawling session notes.
                </p>

                <p className="text-xs sm:text-sm leading-relaxed">
                  Mobile and tablet devices, while excellent for sending ravens
                  and consulting spell scrolls, simply cannot contain the
                  majesty of this digital dungeon masters toolkit.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="pt-3"
                >
                  <p className="text-sm sm:text-base md:text-lg font-bold text-[#d9ca89]">
                    Please return on a larger device to begin your journey.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Outer glow effect */}
        <div className="absolute inset-0 border-2 border-[#d9ca89] opacity-20 pointer-events-none" />
      </motion.div>
    </div>
  );
}
