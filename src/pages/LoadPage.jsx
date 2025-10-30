import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import DeleteModal from "../components/DeleteModal";
import SelectedItem from "../components/SelectedItem";
import ActionButton from "../components/ActionButton";

export default function LoadPage() {
  const { user, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "Campaigns", campaignToDelete.id));

      // Remove from local state so it disappears instantly
      setCampaigns((prev) =>
        prev.filter((camp) => camp.id !== campaignToDelete.id)
      );

      // Close modal
      setDeleteModalOpen(false);

      // Reset centerIndex if needed
      setCenterIndex((prev) =>
        Math.min(prev, campaigns.length - 2 >= 0 ? campaigns.length - 2 : 0)
      );
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

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

  const handleContinue = useCallback(() => {
    if (campaigns.length === 0) return;
    const selectedCampaign = campaigns[centerIndex];
    localStorage.setItem("selectedCampaignId", selectedCampaign.id);
    navigate("/session", {
      state: { campaignId: selectedCampaign.id, from: "/loadcampaign" },
    });
  }, [campaigns, centerIndex, navigate]);

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

  const handleCampaignClick = useCallback((campaignId) => {
    const clickedIndex = campaigns.findIndex((camp) => camp.id === campaignId);
    if (clickedIndex !== -1) {
      setCenterIndex(clickedIndex);
    }
  }, [campaigns]);

  useEffect(() => {
    let scrollAccumulator = 0;
    const SCROLL_THRESHOLD = 50;

    const onWheel = (e) => {
      scrollAccumulator += e.deltaY;

      if (scrollAccumulator >= SCROLL_THRESHOLD) {
        handleScroll("down");
        scrollAccumulator = 0;
        e.preventDefault();
      } else if (scrollAccumulator <= -SCROLL_THRESHOLD) {
        handleScroll("up");
        scrollAccumulator = 0;
        e.preventDefault();
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        handleScroll("up");
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        handleScroll("down");
        e.preventDefault();
      } else if (e.key === "Enter") {
        handleContinue();
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleScroll, handleContinue]);

  if (loading) return null;

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
    <div className="relative min-h-screen flex bg-[var(--dark-muted-bg)] font-serif select-none overflow-hidden p-10">
      {/* Left Panel */}
      <motion.div
        className="relative w-1/2 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="absolute top-24 w-full h-16 bg-gradient-to-b from-[var(--dark-muted-bg)] to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-16 w-full h-16 bg-gradient-to-t from-[var(--dark-muted-bg)] to-transparent pointer-events-none z-20"></div>

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
                  animate={{ opacity, y: yOffset, scale }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: Math.abs(camp.offset) * 0.1,
                  }}
                  className="w-96 cursor-pointer"
                  onClick={() => handleCampaignClick(camp.id)}
                  whileHover={!isCenter ? { scale: 0.9, opacity: 0.7 } : {}}
                >
                  <SelectedItem
                    isSelected={isCenter}
                    showArrow={isCenter}
                    animate={false} // we're handling animation in the parent
                  >
                    {camp.title || camp.name || "Untitled Campaign"}
                  </SelectedItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="relative w-3/4 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            background: `
      linear-gradient(to left, transparent 50%, var(--dark-muted-bg) 100%),
      linear-gradient(to right, transparent 75%, var(--dark-muted-bg) 100%),
      linear-gradient(to bottom, transparent 40%, var(--dark-muted-bg) 100%),
      linear-gradient(to top, transparent 75%, var(--dark-muted-bg) 100%)
    `,
          }}
        />

        {!activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center text-[var(--primary)]/40 italic"
          >
            No preview available
          </motion.div>
        )}

        {selectedCampaign && (
          <motion.div
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            {/* LOAD button */}
            <ActionButton
              label="LOAD"
              onClick={handleContinue}
              color="var(--secondary)"
              bgColor="#f0d382"
              textColor="#1C1B18"
              size="lg"
              showGlow={true}
              showLeftArrow={true}
              showRightArrow={true}
              animate={true}
              animationDelay={0.3}
              shadowColor="rgba(191,136,60,0.6)"
              arrowDropShadow="rgba(191,136,60,0.8)"
            />

            {/* DELETE button */}
            <motion.button
              onClick={() => {
                setCampaignToDelete(selectedCampaign);
                setDeleteModalOpen(true);
              }}
              whileHover={{
                textShadow:
                  "0 0 10px rgba(255,80,80,0.5), 0 0 20px rgba(255,80,80,0.3)",
                color: "#ff6b6b",
              }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-5 py-1 text-lg uppercase tracking-widest font-semibold text-[#a84b4b] opacity-80 hover:opacity-100 transition-all duration-300"
            >
              DELETE
            </motion.button>
          </motion.div>
        )}

        <DeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          campaign={campaignToDelete}
          onConfirm={handleDeleteConfirm}
        />
      </motion.div>
    </div>
  );
}