import React from "react";
import { motion } from "framer-motion";

export default function ActionButton({
  label = "BUTTON",
  onClick,
  color = "var(--secondary)",
  bgColor = "#f0d382",
  textColor = "#1C1B18",
  shadowColor = "rgba(191,136,60,0.6)",
  arrowDropShadow = "rgba(191,136,60,0.8)",
  className = "",
  animate = true,
  animationDelay = 0.2,
  size = "lg",
  showLeftArrow = true,
  showRightArrow = true,
  showGlow = true, // ✨ NEW: simple toggle for glow
}) {
  // Size configurations
  const sizeConfig = {
    sm: {
      textSize: "text-lg",
      padding: "px-3 py-1",
      arrowHeight: "h-[50px]",
      arrowOffset: "24px",
      borderWidth: "border",
    },
    md: {
      textSize: "text-2xl",
      padding: "px-4 py-1.5",
      arrowHeight: "h-[55px]",
      arrowOffset: "32px",
      borderWidth: "border-2",
    },
    lg: {
      textSize: "text-4xl",
      padding: "px-5 py-2",
      arrowHeight: "h-[70px]",
      arrowOffset: "35px",
      borderWidth: "border-2",
    },
  };

  const config = sizeConfig[size] || sizeConfig.lg;

  // Conditional border classes based on arrow visibility
  const borderClasses = `
    ${config.borderWidth}
    border-t-2 border-b-2
    ${!showLeftArrow ? "border-l-2" : "border-l-0"}
    ${!showRightArrow ? "border-r-2" : "border-r-0"}
  `.trim();

  return (
    <motion.div
      className={`relative flex items-center justify-center ${borderClasses} overflow-visible px-1.5 py-1 ${className}`}
      style={{
        borderColor: color,
        boxShadow: showGlow ? `0 0 30px ${shadowColor}` : "none", // ✨ conditional glow
      }}
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={animate ? { duration: 0.5, delay: animationDelay } : false}
    >
      {/* Left arrow - only renders if showLeftArrow is true */}
      {showLeftArrow && (
        <motion.div
          className={`absolute top-1/2 pointer-events-none z-20`}
          style={{
            left: `-${config.arrowOffset}`,
            transform: "translateY(-50%) scale(0.97)",
            filter: showGlow
              ? `drop-shadow(0 0 20px ${arrowDropShadow})`
              : "none", // ✨ conditional arrow glow
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35.9 67.5"
            className={`${config.arrowHeight} w-auto rotate-180`}
          >
            <defs>
              <style>{`.st0 { fill: none; stroke: ${color}; stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
            </defs>
            <polyline className="st0" points="1.4 66.8 34.5 33.8 1.4 .7" />
            <polyline className="st0" points="17.9 17.2 1.4 33.8 17.9 50.3" />
            <polyline
              className="st0"
              points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
            />
          </svg>
        </motion.div>
      )}

      {/* Button */}
      <motion.button
        onClick={onClick}
        className={`relative cursor-pointer ${config.textSize} ${config.padding} font-extrabold uppercase overflow-hidden
          before:content-[''] before:absolute before:inset-0
          before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
          before:translate-x-[-100%] before:skew-x-12
          hover:before:animate-[shine_1s_ease-in-out_forwards]`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {label}
      </motion.button>

      {/* Right arrow - only renders if showRightArrow is true */}
      {showRightArrow && (
        <motion.div
          className={`absolute top-1/2 pointer-events-none z-20`}
          style={{
            right: `-${config.arrowOffset}`,
            transform: "translateY(-50%) scale(0.97)",
            filter: showGlow
              ? `drop-shadow(0 0 20px ${arrowDropShadow})`
              : "none", // ✨ conditional arrow glow
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35.9 67.5"
            className={`${config.arrowHeight} w-auto`}
          >
            <defs>
              <style>{`.st0 { fill: none; stroke: ${color}; stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
            </defs>
            <polyline className="st0" points="1.4 66.8 34.5 33.8 1.4 .7" />
            <polyline className="st0" points="17.9 17.2 1.4 33.8 17.9 50.3" />
            <polyline
              className="st0"
              points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
