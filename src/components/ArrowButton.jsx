import React from "react";
import { motion } from "framer-motion";

export default function ArrowButton({
  label = "BUTTON",
  onClick,
  size = "lg",
  color = "#DACA89",
  hoverOffset = 100,
  className = "",
  gradient = true, // new prop: use gradient or solid text
  glow = "rgba(218,202,137,0.6)", // default glow for gradient text
}) {
  const textSize =
    size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";

  const textStyles = gradient
    ? {
        backgroundImage: "linear-gradient(to right, #DACA89, #bf883c, #FFD57F)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        textShadow: `0 0 10px ${glow}`,
      }
    : {
        color: color,
        textShadow: glow !== "transparent" ? `0 0 10px ${glow}` : "none",
      };

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center justify-center select-none overflow-visible ${className}`}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* LEFT ARROW */}
      <motion.div
        variants={{ rest: { x: -10 }, hover: { x: -hoverOffset } }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="overflow-visible"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35.9 67.5"
          className="h-12 w-auto rotate-180"
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

      {/* TEXT */}
      <motion.span
        className={`${textSize} font-extrabold cursor-pointer tracking-widest uppercase`}
        style={textStyles}
        whileHover={{
          y: -2,
          backgroundImage: gradient
            ? "linear-gradient(to right, #FFEB9C, #DFAF6A, #FFECA2)"
            : undefined,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {label}
      </motion.span>

      {/* RIGHT ARROW */}
      <motion.div
        variants={{ rest: { x: 10 }, hover: { x: hoverOffset } }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="overflow-visible"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35.9 67.5"
          className="h-12 w-auto"
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
    </motion.button>
  );
}
