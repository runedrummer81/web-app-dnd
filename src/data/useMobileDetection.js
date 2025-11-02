import { useState, useEffect } from "react";

/**
 * How this file works:
 * - Checks the browser’s user agent to see if it matches known mobile devices (like iPhone, Android, etc.).
 * - Looks at the *physical* screen width (`window.screen.width`) instead of the window size,
 *   so it stays accurate even when DevTools are open or the window is resized.
 * - If the screen is smaller than 1024px **or** the user agent matches a mobile device, it’s considered “mobile.”
 *
 * Implementation details:
 * - Runs once when the component mounts, and again on resize (for consistency).
 * - Returns a boolean (`isMobile`) that tells you if the current device should be treated as mobile.
 */

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for actual mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );

      // USE PHYSICAL SCREEN WIDTH - this NEVER changes when DevTools opens
      const physicalScreenWidth = window.screen.width;

      // DEBUG: Log what we're detecting
      console.log("🔍 Mobile Detection:", {
        physicalScreenWidth,
        windowWidth: window.innerWidth, // This changes with DevTools
        isMobileDevice,
        userAgent: navigator.userAgent,
      });

      // SIMPLE LOGIC: Only block if physical screen is small OR it's a detected mobile device
      const shouldBlock = physicalScreenWidth < 1024 || isMobileDevice;

      console.log("📱 Should block?", shouldBlock);
      setIsMobile(shouldBlock);
    };

    // Check on mount
    checkMobile();

    // NO need for resize listener since screen.width doesn't change
    // But we can keep it for consistency
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
