import React, { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function LoadPage() {
  const { user, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    async function getCampaigns() {
      try {
        const q = query(
          collection(db, "Campaigns"),
          where("ownerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(fetched);
      } catch (err) {
        console.error("🔥 Firestore error:", err);
      }
    }
    getCampaigns();
  }, [user]);

  const handleContinue = () => {
    if (campaigns.length === 0) return;
    const selectedCampaign = campaigns[centerIndex];
    localStorage.setItem("selectedCampaignId", selectedCampaign.id);
    navigate("/session", {
      state: { campaignId: selectedCampaign.id, from: "/load" },
    });
  };

  const handleScroll = useCallback(
    (direction) => {
      if (direction === "up" && centerIndex > 0) {
        setCenterIndex((prev) => prev - 1);
      } else if (direction === "down" && centerIndex < campaigns.length - 1) {
        setCenterIndex((prev) => prev + 1);
      }
    },
    [centerIndex, campaigns.length]
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    let lastAt = 0;
    const THROTTLE_MS = 200;

    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastAt < THROTTLE_MS) {
        e.preventDefault();
        return;
      }
      lastAt = now;

      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (e.deltaY > 0) handleScroll("down");
      else if (e.deltaY < 0) handleScroll("up");

      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [handleScroll]);

  if (loading) return null;

  // Compute visible campaigns around center
  const visibleCampaigns = [];
  for (let offset = -1; offset <= 1; offset++) {
    const idx = centerIndex + offset;
    if (idx >= 0 && idx < campaigns.length) {
      visibleCampaigns.push({ ...campaigns[idx], offset });
    }
  }

  const selectedCampaign = campaigns[centerIndex];
  const activeImg = selectedCampaign?.image || selectedCampaign?.img;

  return (
    <div className="relative min-h-screen flex bg-[#1C1B18] font-serif select-none overflow-hidden p-10">
      {/* Left side — Cinematic stack */}
      <div className="relative w-1/2 flex flex-col items-center justify-center z-10">
        <button
          onClick={() => navigate("/home")}
          className="absolute top-6 left-6 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
        >
          <span>Back to Home</span>
        </button>

        <h2 className="text-2xl uppercase tracking-widest font-semibold text-[#DACA89] mb-10">
          Choose Your Campaign
        </h2>

        {/* Fade top & bottom */}
        <div className="absolute top-24 w-full h-16 bg-gradient-to-b from-[#1C1B18] to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-16 w-full h-16 bg-gradient-to-t from-[#1C1B18] to-transparent pointer-events-none z-20"></div>

        <div
          ref={listRef}
          className="relative flex flex-col items-center justify-center space-y-6 h-[380px]"
        >
          <AnimatePresence mode="popLayout">
            {visibleCampaigns.map((camp) => {
              const isCenter = camp.offset === 0;
              const yOffset = camp.offset * 60;
              const scale = isCenter ? 1.1 : 0.85;
              const opacity = isCenter ? 1 : 0.5;

              return (
                <motion.div
                  key={camp.id}
                  layout
                  initial={{ opacity: 0, y: yOffset }}
                  animate={{
                    opacity,
                    scale,
                    y: yOffset, // spring-animated
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  className="w-80"
                >
                  <div
                    className={`text-center text-3xl font-semibold px-6 py-3 rounded-lg transition-all duration-200 ${
                      isCenter
                        ? "bg-[#DACA89] text-[#1C1B18] border-2 border-[#DACA89]"
                        : "bg-[#2A2A2A]/50 text-[#DACA89] border border-[#DACA89]/30"
                    }`}
                  >
                    {camp.title || camp.name || "Untitled Campaign"}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side — Dynamic background + gradient + LOAD button */}
      <div className="relative w-3/4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {activeImg && (
            <motion.div
              key={activeImg}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${activeImg})`,
                backgroundSize: "cover", // fills the space while maintaining aspect ratio
                backgroundPosition: "center",
                filter: "brightness(0.85)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0
      [background:linear-gradient(to_left,transparent_30%,#1C1B18_80%),linear-gradient(to_right,transparent_75%,#1C1B18_100%),linear-gradient(to_bottom,transparent_40%,#1C1B18_90%),linear-gradient(to_top,transparent_75%,#1C1B18_100%)]
      [background-size:200px_100%,150px_100%,100%_200px,100%_150px]
      [background-position:left_center,right_center,center_bottom,center_top]
      [background-repeat:no-repeat]"
        />

        {!activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-[#DACA89]/40 italic"
          >
            No preview available
          </motion.div>
        )}

        <div className="absolute bottom-10 right-10 z-20">
          {selectedCampaign && (
            <motion.button
              onClick={handleContinue}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(218,202,137,0.6)",
              }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(218,202,137,0.4)",
                  "0 0 20px rgba(218,202,137,0.7)",
                  "0 0 10px rgba(218,202,137,0.4)",
                ],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
              }}
              className="px-8 py-3 text-3xl uppercase tracking-widest font-bold border border-[#DACA89] text-[#DACA89] rounded-lg bg-transparent hover:bg-[#DACA89] hover:text-[#1C1B18] transition-all"
            >
              LOAD
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
