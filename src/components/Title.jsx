import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Helper: split words from camelCase, PascalCase, underscores, or concatenated lowercase
function splitWords(str) {
  if (!str) return "";
  return str
    .replace(/_/g, " ") // underscores → space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → separate
    .replace(/(new|campaign|load|information|encounters)/gi, " $1") // catch lowercase combos
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Title({ children, fallbackCampaignId }) {
  const location = useLocation();
  const [campaignId, setCampaignId] = useState(
    location.state?.campaignId || fallbackCampaignId
  );

  // Keep campaignId updated if coming from navigation
  useEffect(() => {
    if (location.state?.campaignId) {
      setCampaignId(location.state.campaignId);
    }
  }, [location.state?.campaignId]);

  const hiddenPaths = [
    "/home",
    "/login",
    "/signup",
    "/settings",
    "/RunSession",
  ];
  if (hiddenPaths.includes(location.pathname)) return null;

  const isSessionPage = location.pathname.startsWith("/session");

  const formattedCampaignName =
    isSessionPage && campaignId
      ? splitWords(campaignId.replace(/^camp_/, ""))
      : null;

  // Fallback: format last path segment
  const formatPageName = (path) => {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return splitWords(lastSegment);
  };

  const title =
    children || formattedCampaignName || formatPageName(location.pathname);

  return (
    <>
      {/* <h1 className="absolute uppercase left-50 top-22 text-2xl font-bold text-[var(--secondary)] mb-6 z-[999]">
      {title}
    </h1> */}

      {/* Better Title with Glow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-4 select-none"
      >
        <h1
          className={` text-l lg:text-2xl font-bold uppercase tracking-[0.1em] text-center ${"text-[var(--secondary)]"}`}
          style={{
            fontFamily: "EB Garamond, serif",
          }}
        >
          {title}
        </h1>
        <motion.div
          className={`h-[2px] w-48 mt-2 mx-auto bg-gradient-to-r ${"from-transparent via-[var(--secondary)] to-transparent"}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.div>
    </>
  );
}
