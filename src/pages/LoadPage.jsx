import React, { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function LoadPage() {
  const { user, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Shared animation for both arrows
  const arrowControls = useAnimation();

  useEffect(() => {
    arrowControls.start({
      y: [0, -6, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    });
  }, [arrowControls]);

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
      {/* Left side — Campaign list */}
      <div className="relative w-1/2 flex flex-col items-center justify-center z-10">
        

        <h2 className="text-2xl uppercase tracking-widest font-semibold text-[#DACA89] mb-10">
          Choose Your Campaign
        </h2>

        {/* Fade top & bottom */}
        <div className="absolute top-24 w-full h-16 bg-gradient-to-b from-[#1C1B18] to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-16 w-full h-16 bg-gradient-to-t from-[#1C1B18] to-transparent pointer-events-none z-20"></div>

        <div
          ref={listRef}
          className="relative flex flex-col items-center justify-center space-y-0 h-[380px]"
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
                  animate={{ opacity, scale, y: yOffset }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-96 relative"
                >
                  {/* Outer border — subtle steady glow for selected */}
                  <motion.div
                    className={`relative p-1 overflow-visible ${
                      isCenter ? "border-2 border-[#bf883c] border-r-0" : ""
                    }`}
                    animate={
                      isCenter
                        ? { boxShadow: "0 0 25px rgba(191,136,60,0.6)" } // steady glow
                        : { boxShadow: "0 0 0px transparent" }
                    }
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {/* Inner box — soft pulsing aura for selected */}
                    <motion.div
                      className={`relative px-6 py-3.5 text-2xl font-semibold uppercase truncate whitespace-nowrap overflow-hidden transition-all duration-500 ${
                        isCenter
                          ? "bg-[#DACA89] text-[#1C1B18]"
                          : "bg-transparent text-[#bf883c]"
                      }`}
                      animate={
                        isCenter
                          ? {
                              boxShadow: [
                                "0 0 20px rgba(191,136,60,0.6)",
                                "0 0 35px rgba(191,136,60,0.9)",
                                "0 0 20px rgba(191,136,60,0.6)",
                              ],
                            }
                          : { boxShadow: "none" }
                      }
                      transition={
                        isCenter
                          ? {
                              repeat: Infinity,
                              repeatType: "mirror",
                              duration: 2,
                              ease: "easeInOut",
                            }
                          : { duration: 0.2 }
                      }
                    >
                      {camp.title || camp.name || "Untitled Campaign"}
                    </motion.div>

                    {/* Arrow — always visible with stronger glow */}
                    {isCenter && (
                      <motion.div
                        key="arrow"
                        className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        initial={{ opacity: 1 }}
                        animate={{
                          opacity: 1,
                          filter:
                            "drop-shadow(0 0 25px rgba(191,136,60,0.9)) drop-shadow(0 0 40px rgba(191,136,60,0.7))",
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 35.9 67.5"
                          className="h-[72px] w-auto"
                        >
                          <defs>
                            <style>{`.st0 { fill: none; stroke: #bf883c; stroke-width: 2px; stroke-miterlimit: 10; }`}</style>
                          </defs>
                          <polyline
                            className="st0"
                            points="1.4 66.8 34.5 33.8 1.4 .7"
                          />
                          <polyline
                            className="st0"
                            points="17.9 17.2 1.4 33.8 17.9 50.3"
                          />
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
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side — Background + gradient + buttons */}
      <div className="relative w-3/4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {activeImg && (
            <motion.div
              key={activeImg}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${activeImg})`,
                backgroundSize: "cover",
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
        {selectedCampaign && (
          <>
            {/* LOAD button — larger, centered vertically */}
            <motion.div
              className="absolute right-1/2 translate-x-[130%] bottom-[10%] z-30 flex items-center justify-center border-2 border-[#bf883c] border-r-0 border-l-0 overflow-visible"
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
                ease: "easeInOut",
              }}
            >
              {/* Left arrow */}
              <motion.div
                className="absolute -left-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20"
                style={{ transform: "translateY(-0%) scale(0.97)" }}
                animate={{
                  filter:
                    "drop-shadow(0 0 25px rgba(191,136,60,0.9)) drop-shadow(0 0 40px rgba(191,136,60,0.7))",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 35.9 67.5"
                  className="h-[70px] w-auto rotate-180"
                >
                  <defs>
                    <style>{`.st0 { fill: none; stroke: #bf883c; stroke-width: 2px; stroke-miterlimit: 10; }`}</style>
                  </defs>
                  <polyline
                    className="st0"
                    points="1.4 66.8 34.5 33.8 1.4 .7"
                  />
                  <polyline
                    className="st0"
                    points="17.9 17.2 1.4 33.8 17.9 50.3"
                  />
                  <polyline
                    className="st0"
                    points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
                  />
                </svg>
              </motion.div>

              {/* LOAD button itself */}
              <motion.button
                onClick={handleContinue}
                className="cursor-pointer btn-glow px-14 py-3 text-4xl font-extrabold uppercase text-[#1C1B18] bg-gradient-to-br from-[#f0d382] to-[#bf883c]"
              >
                LOAD
              </motion.button>

              {/* Right arrow */}
              <motion.div
                className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20"
                style={{ transform: "translateY(-0%) scale(0.97)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 35.9 67.5"
                  className="h-[70px] w-auto"
                >
                  <defs>
                    <style>{`.st0 { fill: none; stroke: #bf883c; stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
                  </defs>
                  <polyline
                    className="st0"
                    points="1.4 66.8 34.5 33.8 1.4 .7"
                  />
                  <polyline
                    className="st0"
                    points="17.9 17.2 1.4 33.8 17.9 50.3"
                  />
                  <polyline
                    className="st0"
                    points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* DELETE button — smaller, bottom-right corner */}
            <div className="absolute bottom-10 right-10 z-20">
              <motion.button
                onClick={() =>
                  console.log("delete campaign", selectedCampaign.id)
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,90,90,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer px-5 py-2 text-1xl uppercase tracking-widest font-bold border border-[#ff4c4c] text-[#ff4c4c] rounded-lg bg-transparent hover:bg-[#ff4c4c] hover:text-[#1C1B18] transition-all"
              >
                DELETE
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
