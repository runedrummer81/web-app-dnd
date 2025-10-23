import { useState, useEffect, useRef, useCallback } from "react";
import {
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import DeleteModal from "../components/DeleteModal";
import ArrowButton from "../components/ArrowButton";

export default function Session() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const [activeImg, setActiveImg] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const listRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      // Delete session from Firestore
      await deleteDoc(doc(db, "Sessions", sessionToDelete.id));
      // Remove it from local state so UI updates immediately
      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));

      // Close modal
      setDeleteModalOpen(false);

      // Clear the deleted session from the screen if it's currently selected
      if (selectedSession?.id === sessionToDelete.id) {
        setSelectedSession(null);
      }

      // Show confirmation toast
      setDeleteMessage("Session deleted!");
      setTimeout(() => setDeleteMessage(""), 2500); // fades out after 2.5s
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const fromPage =
    location.state?.from || localStorage.getItem("lastNonSessionPage");

  // Save last non-session page (same behavior as you had before)
  useEffect(() => {
    if (fromPage && !fromPage.includes("session")) {
      localStorage.setItem("lastNonSessionPage", fromPage);
    }
  }, [fromPage]);

  // Determine campaignId (from nav state or storage)
  useEffect(() => {
    const idFromNav = location.state?.campaignId;
    const idFromStorage = localStorage.getItem("selectedCampaignId");
    const finalId = idFromNav || idFromStorage;
    if (!finalId) {
      console.warn("⚠️ No campaignId found — redirecting to Home");
      navigate("/home");
      return;
    }
    setCampaignId(finalId);
    localStorage.setItem("selectedCampaignId", finalId);
  }, [location.state, navigate]);

  // Fetch campaign image (so background matches LoadPage)
  useEffect(() => {
    if (!campaignId) return;
    const fetchCampaignImg = async () => {
      try {
        const campaignDoc = await getDocs(
          query(
            collection(db, "Campaigns"),
            where("__name__", "==", campaignId)
          )
        );
        const data = campaignDoc.docs[0]?.data();
        setActiveImg(data?.image || data?.img || null);
      } catch (err) {
        console.error("🔥 Could not fetch campaign image:", err);
      }
    };
    fetchCampaignImg();
  }, [campaignId]);

  // Fetch sessions for this campaign and select latest by default
  useEffect(() => {
    if (!campaignId) return;
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, "Sessions"),
          where("campaignId", "==", campaignId)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        const sorted = fetched.sort((a, b) => b.sessNr - a.sessNr);
        setSessions(sorted);
        if (sorted.length > 0) {
          setSelectedSession(sorted[0]);
          setCenterIndex(0); // keep centerIndex in sync (we'll treat index 0 as latest)
        }
      } catch (err) {
        console.error("🔥 Firestore fejl:", err);
      }
    };
    fetchSessions();
  }, [campaignId]);

  // Create a new session (keeps your existing behavior)
  const createNewSession = async () => {
    if (!campaignId) return;
    try {
      const q = query(
        collection(db, "Sessions"),
        where("campaignId", "==", campaignId)
      );
      const snapshot = await getDocs(q);
      const existingSessions = snapshot.docs.map((d) => d.data());
      const highestSessNr = existingSessions.reduce(
        (max, s) => Math.max(max, s.sessNr || 0),
        0
      );
      const nextSessNr = highestSessNr + 1;

      const sessionId = `${campaignId}_sess_${nextSessNr
        .toString()
        .padStart(3, "0")}`;

      const newSession = {
        title: `Session ${nextSessNr}`,
        campaignId,
        sessNr: nextSessNr,
        dmNotes: "",
        encounters: [],
        combatMaps: [],
        createdAt: new Date(),
      };

      await setDoc(doc(db, "Sessions", sessionId), newSession);

      const campaignRef = doc(db, "Campaigns", campaignId);
      await updateDoc(campaignRef, {
        sessionsCount: (existingSessions?.length || 0) + 1,
        lastOpened: new Date(),
      });

      // Update local state and select it
      setSessions((prev) => [{ id: sessionId, ...newSession }, ...prev]);
      setSelectedSession({ id: sessionId, ...newSession });
      setCenterIndex(0);
      navigate("/session-edit", { state: { sessionId } });
    } catch (err) {
      console.error("🔥 Fejl ved oprettelse af ny session:", err);
    }
  };

  // Scroll / center logic
  // centerIndex refers to index into `sessions` array — we keep selectedSession in sync with it
  const handleScroll = useCallback(
    (direction) => {
      // If there are no sessions, nothing to do
      if (!sessions.length) return;

      if (direction === "up" && centerIndex > 0) {
        setCenterIndex((prev) => prev - 1);
      } else if (direction === "down" && centerIndex < sessions.length - 1) {
        setCenterIndex((prev) => prev + 1);
      }
    },
    [centerIndex, sessions.length]
  );

  // Wheel handler with accumulator so touchpad doesn't skip items
  useEffect(() => {
    let scrollAccumulator = 0;
    const SCROLL_THRESHOLD = 50;

    const onWheel = (e) => {
      // Only consider vertical scrolling
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

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [handleScroll]);

  // Visible sessions (center + one above and below)
  const visibleSessions = [];
  for (let offset = -1; offset <= 1; offset++) {
    const idx = centerIndex + offset;
    if (idx >= 0 && idx < sessions.length)
      visibleSessions.push({ ...sessions[idx], offset });
  }

  // Keep selectedSession in sync with centerIndex
  useEffect(() => {
    if (sessions[centerIndex]) setSelectedSession(sessions[centerIndex]);
  }, [centerIndex, sessions]);

  // Utility: safe navigate with session id
  const runSession = (sessionId) => {
    navigate("/session-run", { state: { sessionId } });
  };

  return (
    <div className="relative min-h-screen flex bg-[#1C1B18] font-serif select-none overflow-hidden p-10">
      {/* LEFT PANEL: Session list */}
      <motion.div
        className="relative w-1/3 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ArrowButton
          label="+ New Session"
          onClick={createNewSession}
          color="var(--primary)"
          size="lg"
          className="mb-6 overflow-visible" // ← allow arrows to move outside
          hoverOffset={50} // ← increase to a visible amount
        />

        <div
          ref={listRef}
          className="relative flex flex-col items-center justify-center space-y-0 h-[380px]"
        >
          <AnimatePresence mode="popLayout">
            {visibleSessions.map((sess) => {
              const isCenter = sess.offset === 0;
              const yOffset = sess.offset * 60;
              const scale = isCenter ? 1.1 : 0.85;
              const opacity = isCenter ? 1 : 0.5;

              return (
                <motion.div
                  key={sess.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity, y: yOffset, scale }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: Math.abs(sess.offset) * 0.1,
                  }}
                  className="w-80 relative"
                >
                  <motion.div
                    className={`relative p-1 overflow-visible ${
                      isCenter ? "border-2 border-[var(--secondary)] border-r-0" : ""
                    }`}
                    animate={
                      isCenter
                        ? { boxShadow: "0 0 25px rgba(191,136,60,0.6)" }
                        : { boxShadow: "0 0 0px transparent" }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className={`relative px-6 py-3.5 text-xl font-semibold uppercase truncate whitespace-nowrap overflow-hidden transition-all duration-500 ${
                        isCenter
                          ? "bg-[var(--primary)] text-[#1C1B18]"
                          : "bg-transparent text-[var(--secondary)]"
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
                            }
                          : { duration: 0.2 }
                      }
                    >
                      {sess.title || `Session ${sess.sessNr}`}
                    </motion.div>

                    {/* SVG Arrow for selected session */}
                    {isCenter && (
                      <motion.div
                        key="arrow"
                        className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-10 drop-shadow-[0_0_25px_rgba(191,136,60,0.9)]"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          filter:
                            "drop-shadow(0 0 25px rgba(191,136,60,0.9)) drop-shadow(0 0 40px rgba(191,136,60,0.7))",
                        }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 35.9 67.5"
                          className="h-[72px] w-auto"
                        >
                          <defs>
                            <style>{`.st0 { fill: none; stroke: var(--secondary); stroke-width: 2px; stroke-miterlimit: 10; }`}</style>
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

                  {/* Click handler to select session */}
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => {
                      const idx = sessions.findIndex((s) => s.id === sess.id);
                      if (idx !== -1) setCenterIndex(idx);
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT PANEL: Background + Details */}
      <motion.div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        {/* BACKGROUND IMAGE (blurred) */}
        {activeImg && (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${activeImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(10px) brightness(0.75)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Gradient overlays (matching LoadPage) */}
        <div
          className="absolute inset-0
            [background:linear-gradient(to_left,transparent_30%,#1C1B18_80%),linear-gradient(to_right,transparent_75%,#1C1B18_100%),linear-gradient(to_bottom,transparent_40%,#1C1B18_90%),linear-gradient(to_top,transparent_75%,#1C1B18_100%)]
            [background-size:200px_100%,150px_100%,100%_200px,100%_150px]
            [background-position:left_center,right_center,center_bottom,center_top]
            [background-repeat:no-repeat]"
        />

        {/* Details box */}
        {selectedSession && (
          <>
            <motion.div
              className="relative flex flex-col w-full max-w-4xl bg-[#1F1E1A] p-8 shadow-[0_0_30px_rgba(191,136,60,0.2)] border-3 border-[var(--secondary)] z-10 space-y-5 overflow-hidden max-h-[70vh]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Corner Arrows */}
              <img
                src="public/images/arrow-head.svg"
                alt="corner arrow"
                className="absolute top-1 left-1 w-8 h-8 rotate-[270deg] scale-125 translate-x-[-1px] translate-y-[-1px]"
              />
              <img
                src="public/images/arrow-head.svg"
                alt="corner arrow"
                className="absolute top-1 right-1 w-8 h-8 scale-125 translate-x-[1px] translate-y-[-1px]"
              />
              <img
                src="public/images/arrow-head.svg"
                alt="corner arrow"
                className="absolute bottom-1 left-1 w-8 h-8 rotate-[180deg] scale-125 translate-x-[-1px] translate-y-[21px]"
              />
              <img
                src="public/images/arrow-head.svg"
                alt="corner arrow"
                className="absolute bottom-1 right-1 w-8 h-8 rotate-[90deg] scale-125 translate-x-[1px] translate-y-[21px]"
              />

              {/* Title */}
              <h2 className="text-3xl uppercase tracking-widest font-semibold text-[var(--primary)] drop-shadow-[0_0_10px_rgba(191,136,60,0.5)] mb-4">
                {selectedSession.title}
              </h2>

              {/* DM Notes */}
              <div className="bg-[#1F1E1A]">
                <p className="text-[var(--secondary)] whitespace-pre-wrap h-[300px]">
                  {selectedSession.dmNotes || "Ingen noter endnu"}
                </p>
              </div>
            </motion.div>

            {/* Row beneath DM Notes: Encounters + Maps */}
            <div className="flex w-full max-w-4xl mt-6 z-10 gap-6">
              {/* LEFT: Encounters box */}
              <div className="w-1/3 bg-[#1F1E1A]/50 p-4 rounded border border-[var(--secondary)] overflow-auto">
                <h3 className="text-[var(--primary)] font-semibold mb-2">
                  Encounters
                </h3>
                {selectedSession.encounters &&
                selectedSession.encounters.length > 0 ? (
                  <ul className="text-[var(--secondary)]/90 list-disc list-inside space-y-1">
                    {selectedSession.encounters.map((enc, idx) => (
                      <li key={idx}>{enc.name || `Encounter ${idx + 1}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[var(--secondary)]/80 text-sm">No encounters yet</p>
                )}
              </div>

              {/* RIGHT: Maps */}
              <div className="flex-1 flex gap-4">
                {(selectedSession.combatMaps || [])
                  .slice(0, 3)
                  .map((map, idx) => (
                    <div
                      key={idx}
                      className="w-1/3 h-32 bg-[#2A2A22] rounded border border-[var(--secondary)] overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      {map.imageUrl ? (
                        <img
                          src={map.imageUrl}
                          alt={map.name || `Map ${idx + 1}`}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <p className="text-[var(--secondary)]/80 text-sm text-center px-2">
                          {map.name || `Map ${idx + 1}`}
                        </p>
                      )}
                    </div>
                  ))}

                {/* Fill remaining slots with placeholders */}
                {Array.from({
                  length: 3 - (selectedSession.combatMaps?.length || 0),
                }).map((_, idx) => (
                  <div
                    key={`placeholder-${idx}`}
                    className="w-1/3 h-32 bg-[#2A2A22]/50 rounded border border-[#555] flex items-center justify-center text-[#555] text-sm"
                  >
                    Empty
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons beneath details box */}
            <div className="flex justify-between items-center w-full max-w-4xl mt-6 z-20 space-x-6">
              {/* Left: EDIT + DELETE buttons stacked, centered */}
              <div className="flex flex-col items-center space-y-2">
                {/* EDIT SESSION button */}
                <ArrowButton
                  label="Edit Session"
                  onClick={() =>
                    navigate("/session-edit", {
                      state: { sessionId: selectedSession.id },
                    })
                  }
                  size="sm"
                  color="var(--primary)"
                  glow="transparent" // no glow
                  hoverOffset={20}
                  gradient={false} // solid color text instead of gradient
                />

                {/* DELETE SESSION button (centered beneath EDIT) */}
                <motion.button
                  onClick={() => {
                    setSessionToDelete(selectedSession);
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
              </div>

              {/* Right: RUN SESSION button (unchanged) */}
              <motion.div
                className="shadow-[0_0_30px_rgba(191,136,60,0.6)] flex items-center justify-center border-2 border-[var(--secondary)] border-r-0 border-l-0 overflow-visible px-1 py-1 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Left arrow */}
                <motion.div
                  className="absolute -left-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20 drop-shadow-[0_0_20px_rgba(191,136,60,0.8)]"
                  style={{ transform: "translateY(-0%) scale(0.97)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35.9 67.5"
                    className="h-[70px] w-auto rotate-180"
                  >
                    <defs>
                      <style>{`.st0 { fill: none; stroke: var(--secondary); stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
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

                <motion.button
                  onClick={() => runSession(selectedSession.id)}
                  className="
        relative cursor-pointer px-5 py-2 text-4xl font-extrabold uppercase text-[#1C1B18] bg-[#f0d382]
        overflow-hidden
        before:content-[''] before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
        before:translate-x-[-100%] before:skew-x-12
        hover:before:animate-[shine_1s_ease-in-out_forwards]
      "
                >
                  RUN SESSION
                </motion.button>

                {/* Right arrow */}
                <motion.div
                  className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20 drop-shadow-[0_0_20px_rgba(191,136,60,0.8)]"
                  style={{ transform: "translateY(-0%) scale(0.97)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35.9 67.5"
                    className="h-[70px] w-auto"
                  >
                    <defs>
                      <style>{`.st0 { fill: none; stroke: var(--secondary); stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
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
            </div>

            {/* Deletion success message */}
            {deleteMessage && (
              <motion.div
                key="delete-toast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-[var(--secondary)] text-lg tracking-wide mt-4 font-medium drop-shadow-[0_0_10px_rgba(191,136,60,0.4)]"
              >
                {deleteMessage}
              </motion.div>
            )}
            <DeleteModal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              campaign={sessionToDelete} // still works even if named "campaign" in modal
              onConfirm={handleDeleteConfirm}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
