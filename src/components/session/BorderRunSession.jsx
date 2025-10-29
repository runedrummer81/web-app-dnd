import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const Border = ({ currentPath, isSelected = true }) => {
  const prevPath = useRef(currentPath);
  const isLoginPage = currentPath === "/" || currentPath === "/login";
  const [shineKey, setShineKey] = useState(0);

  // Determine scale based on path
  const getScale = () => {
    if (isLoginPage) return "scale-200";
    return "scale-100";
  };

  const [scale, setScale] = useState(getScale());

  useEffect(() => {
    const wasLoginPage =
      prevPath.current === "/" || prevPath.current === "/login";
    const isHomePage = currentPath === "/home";

    // If transitioning from login to home, animate
    if (wasLoginPage && isHomePage) {
      setScale("scale-200");
      const timer = setTimeout(() => setScale("scale-100"), 100);
      prevPath.current = currentPath;
      return () => clearTimeout(timer);
    }

    // Otherwise, just set the appropriate scale immediately
    setScale(getScale());
    prevPath.current = currentPath;
  }, [currentPath]);

  // Trigger shine every 20 seconds
  useEffect(() => {
    if (!isSelected) return;

    // Initial trigger
    setShineKey((prev) => prev + 1);

    const interval = setInterval(() => {
      setShineKey((prev) => prev + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [isSelected]);

  return (
    <motion.div
      className={`transition-transform duration-700 ease-out origin-center absolute inset-0 pointer-events-none z-9999 ${scale}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        {" "}
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[var(--primary)]"
              strokeWidth="3"
            />
          </svg>
          {isSelected && (
            <motion.div
              key={`shine-tl-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 40%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 60%,
                            transparent 100%)`,
              }}
              initial={{ x: "-100%", y: "-100%" }}
              animate={{ x: "100%", y: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 rotate-90 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[var(--primary)]"
              strokeWidth="3"
            />
          </svg>
          {isSelected && (
            <motion.div
              key={`shine-tr-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 40%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 60%,
                            transparent 100%)`,
              }}
              initial={{ x: "-100%", y: "-100%" }}
              animate={{ x: "100%", y: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-20 h-20 rotate-270 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[var(--primary)]"
              strokeWidth="3"
            />
          </svg>
          {isSelected && (
            <motion.div
              key={`shine-bl-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 40%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 60%,
                            transparent 100%)`,
              }}
              initial={{ x: "-100%", y: "-100%" }}
              animate={{ x: "100%", y: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[var(--secondary)]"
              strokeWidth="3"
            />
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[var(--primary)]"
              strokeWidth="3"
            />
          </svg>
          {isSelected && (
            <motion.div
              key={`shine-br-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 40%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 60%,
                            transparent 100%)`,
              }}
              initial={{ x: "-100%", y: "-100%" }}
              animate={{ x: "100%", y: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Top Edge */}
        <div className="absolute top-0 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--secondary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-top-${shineKey}`}
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Bottom Edge */}
        <div className="absolute bottom-0 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--secondary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-bottom-${shineKey}`}
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Left Edge */}
        <div className="absolute left-0 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--secondary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-left-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 20%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 80%,
                            transparent 100%)`,
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Right Edge */}
        <div className="absolute right-0 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--secondary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-right-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 20%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 80%,
                            transparent 100%)`,
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Top Edge 2 */}
        <div className="absolute top-2 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--primary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-top2-${shineKey}`}
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Bottom Edge 2 */}
        <div className="absolute bottom-2 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--primary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-bottom2-${shineKey}`}
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Left Edge 2 */}
        <div className="absolute left-2 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--primary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-left2-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 20%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 80%,
                            transparent 100%)`,
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        {/* Right Edge 2 */}
        <div className="absolute right-2 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--primary)] overflow-hidden">
          {isSelected && (
            <motion.div
              key={`shine-right2-${shineKey}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, 
                            transparent 0%, 
                            rgba(255, 255, 255, 0) 20%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 80%,
                            transparent 100%)`,
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Border;
