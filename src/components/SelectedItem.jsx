import React from "react";
import { motion } from "framer-motion";

export default function SelectedItem({
  children,
  isSelected = true,
  showArrow = true,
  onClick,
  className = "",
  animate = true,
  arrowColor = "var(--secondary)",
  selectedBgColor = "var(--primary)",
  selectedTextColor = "#1C1B18",
  unselectedTextColor = "var(--secondary)",
  glowColor = "rgba(191,136,60,0.6)",
  arrowGlow = "rgba(191,136,60,0.9)",
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative ${className}`}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={
        animate
          ? {
              type: "spring",
              stiffness: 200,
              damping: 25,
            }
          : false
      }
    >
      <motion.div
        className={`relative p-1 overflow-visible ${
          isSelected ? "border-2 border-r-0" : ""
        }`}
        style={{
          borderColor: isSelected ? arrowColor : "transparent",
        }}
        animate={
          isSelected
            ? { boxShadow: `0 0 25px ${glowColor}` }
            : { boxShadow: "0 0 0px transparent" }
        }
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div
          className={`relative px-8 py-3.5 text-2xl font-semibold uppercase truncate whitespace-nowrap overflow-hidden transition-all duration-500 ${
            onClick ? "cursor-pointer" : ""
          }`}
          style={{
            backgroundColor: isSelected ? selectedBgColor : "transparent",
            color: isSelected ? selectedTextColor : unselectedTextColor,
          }}
          animate={
            isSelected
              ? {
                  boxShadow: [
                    `0 0 20px ${glowColor}`,
                    `0 0 35px ${glowColor.replace("0.6", "0.9")}`,
                    `0 0 20px ${glowColor}`,
                  ],
                }
              : { boxShadow: "0 0 0px transparent" }
          }
          transition={
            isSelected
              ? {
                  boxShadow: {
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }
              : { duration: 0.3 }
          }
        >
          {children}

          {/* Shiny sweep animation */}
          {isSelected && (
            <motion.div
              key={`shine-${isSelected}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0) 20%,
                  rgba(255, 255, 255, 0.8) 50%,
                  rgba(255, 255, 255, 0) 80%,
                  transparent 100%)`,
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Arrow - now always visible when selected, no delay */}
        {showArrow && (
          <motion.div
            className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isSelected ? 1 : 0,
              filter: isSelected
                ? `drop-shadow(0 0 25px ${arrowGlow}) drop-shadow(0 0 40px ${arrowGlow.replace(
                    "0.9",
                    "0.7"
                  )})`
                : "drop-shadow(0 0 0px transparent)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 35.9 67.5"
              className="h-[72px] w-auto"
            >
              <defs>
                <style>{`.st0 { fill: none; stroke: ${arrowColor}; stroke-width: 2px; stroke-miterlimit: 10; }`}</style>
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
    </motion.div>
  );
}
