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
import SelectedItem from "../components/SelectedItem";
import ActionButton from "../components/ActionButton";

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

  // Refresh when returning from edit
  useEffect(() => {
    if (location.state?.refreshSessions && campaignId) {
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
          if (selectedSession) {
            const updated = sorted.find((s) => s.id === selectedSession.id);
            if (updated) setSelectedSession(updated);
          }
        } catch (err) {
          console.error("🔥 Firestore fejl:", err);
        }
      };
      fetchSessions();
      navigate(location.pathname, {
        state: { campaignId, refreshSessions: false },
        replace: true,
      });
    }
  }, [
    location.state?.refreshSessions,
    campaignId,
    selectedSession,
    navigate,
    location.pathname,
  ]);

  // Find createNewSession funktionen og erstat med:
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

    // Navigate med draft data i stedet for at oprette session
    navigate("/session-edit", { 
      state: { 
        isDraft: true,
        campaignId,
        sessNr: nextSessNr,
      } 
    });
  } catch (err) {
    console.error("🔥 Fejl ved oprettelse af ny session:", err);
  }
};

// Add this function after createNewSession
  const runSession = (sessionId) => {
    navigate(`/run-session/${sessionId}`, {
      state: { campaignId },
    });
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

  //keystroke for arrow keys
  useEffect(() => {
    if (sessions[centerIndex]) setSelectedSession(sessions[centerIndex]);
  }, [centerIndex, sessions]);

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

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [handleScroll]);

  
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        handleScroll("up");
        e.preventDefault();
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        handleScroll("down");
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleScroll]);

  return (
    <div
      className="fixed inset-0 flex bg-[var(--dark-muted-bg)] font-serif select-none overflow-hidden 
  p-20 pt-40 gap-30"
    >
      {/* LEFT PANEL: Session list */}
      <motion.div
        className="relative flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ArrowButton
          label="New Session"
          onClick={createNewSession}
          color="var(--primary)"
          size="lg"
          className="mb-6 overflow-visible scale-80" // ← allow arrows to move outside
          hoverOffset={50} // ← increase to a visible amount
        />

        <div
          ref={listRef}
          className="relative flex flex-col items-center justify-center space-y-0 h-[35vh] min-h-[300px] max-h-[420px]"
        >
          <AnimatePresence mode="popLayout">
            {visibleSessions.map((sess) => {
              const isCenter = sess.offset === 0;
              const yOffset = sess.offset * 20;
              const scale = isCenter ? 1 : 0.9;
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
                    <SelectedItem
                      isSelected={isCenter}
                      showArrow={true}
                      animate={false} // The outer motion.div handles animation
                      className="[&>div>div>div]:text-xl" // Override text size to xl
                    >
                      {sess.title || `Session ${sess.sessNr}`}
                    </SelectedItem>
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
      <motion.div className="relative flex-1 ml-20 flex flex-col items-center justify-center overflow-hidden mx-auto ">
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
          className="absolute inset-0"
          style={{
            background: `
        linear-gradient(to left, transparent 30%, var(--dark-muted-bg) 80%),
        linear-gradient(to right, transparent 75%, var(--dark-muted-bg) 100%),
        linear-gradient(to bottom, transparent 40%, var(--dark-muted-bg) 100%),
        linear-gradient(to top, transparent 75%, var(--dark-muted-bg) 100%)
      `,
          }}
        />

        {/* Details box */}
        {selectedSession && (
          <>
            <motion.div className="relative h-120 flex flex-row gap-5 w-full z-10 overflow-hidden ">
              <motion.div
                className="relative w-3/5 flex flex-col p-6 border-2 border-[var(--secondary)] z-10 space-y-5 overflow-hidden bg-[var(--dark-muted-bg)]/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Corner Arrows */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 37 36"
                  className="absolute top-0 left-0 w-8 h-8 rotate-[270deg] scale-125"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M35.178,1.558l0,32.25" stroke="#bf883c" />
                  <path d="M35.178,1.558l-33.179,-0" stroke="#bf883c" />
                  <path d="M26.941,9.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,25.571l8.237,8.237" stroke="#bf883c" />
                  <path d="M1.999,1.558l8,8" stroke="#bf883c" />
                  <path d="M18.911,1.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,9.558l-16.705,-0" stroke="#bf883c" />
                  <path d="M34.971,17.588l-16.06,-0" stroke="#bf883c" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 37 36"
                  className="absolute top-0 right-0 w-8 h-8 scale-125 "
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M35.178,1.558l0,32.25" stroke="#bf883c" />
                  <path d="M35.178,1.558l-33.179,-0" stroke="#bf883c" />
                  <path d="M26.941,9.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,25.571l8.237,8.237" stroke="#bf883c" />
                  <path d="M1.999,1.558l8,8" stroke="#bf883c" />
                  <path d="M18.911,1.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,9.558l-16.705,-0" stroke="#bf883c" />
                  <path d="M34.971,17.588l-16.06,-0" stroke="#bf883c" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 37 36"
                  className="absolute bottom-0 left-0 w-8 h-8 rotate-[180deg] scale-125  translate-y-[21px]"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M35.178,1.558l0,32.25" stroke="#bf883c" />
                  <path d="M35.178,1.558l-33.179,-0" stroke="#bf883c" />
                  <path d="M26.941,9.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,25.571l8.237,8.237" stroke="#bf883c" />
                  <path d="M1.999,1.558l8,8" stroke="#bf883c" />
                  <path d="M18.911,1.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,9.558l-16.705,-0" stroke="#bf883c" />
                  <path d="M34.971,17.588l-16.06,-0" stroke="#bf883c" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 37 36"
                  className="absolute bottom-0 right-0 w-8 h-8 rotate-[90deg] scale-125 translate-y-[21px]"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M35.178,1.558l0,32.25" stroke="#bf883c" />
                  <path d="M35.178,1.558l-33.179,-0" stroke="#bf883c" />
                  <path d="M26.941,9.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,25.571l8.237,8.237" stroke="#bf883c" />
                  <path d="M1.999,1.558l8,8" stroke="#bf883c" />
                  <path d="M18.911,1.558l0,16.06" stroke="#bf883c" />
                  <path d="M26.941,9.558l-16.705,-0" stroke="#bf883c" />
                  <path d="M34.971,17.588l-16.06,-0" stroke="#bf883c" />
                </svg>

                {/* Title */}
                <h2 className="text-2xl uppercase tracking-widest font-semibold text-[var(--primary)] drop-shadow-[0_0_10px_rgba(191,136,60,0.5)] mb-4">
                  {selectedSession.notesHeadline}
                </h2>

              {/* DM Notes */}
<div className="text-[#bf883c] whitespace-pre-wrap mb-4">
  {selectedSession.dmNotes || "No notes yet"}
</div>

{/* Session Notes */}
<div>
  <h3 className="text-[var(--primary)] font-semibold mb-2">Session Notes</h3>
  {selectedSession.sessionNotes?.length > 0 ? (
    <ul className="space-y-3">
      {selectedSession.sessionNotes.map((note) => {
        const colorMap = {
          story: "var(--blue)",
          npc: "var(--purple)",
          loot: "var(--yellow)",
          quest: "var(--green)",
          combat: "var(--red)",
          other: "var(--gray)",
        };
        const textColor = colorMap[note.category] || "var(--primary)";
        return (
          <li key={note.id} className="whitespace-pre-wrap">
            <p
              style={{ color: textColor }}
              className="text-lg tracking-wide leading-snug"
            >
              {note.text}
            </p>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-[var(--secondary)]/70 italic">No session notes yet</p>
  )}
</div>
            </motion.div>

              {/* Row beneath DM Notes: Encounters + Maps */}
              <motion.div className="w-2/5 flex flex-col z-10 justify-between">
                {/* LEFT: Encounters box */}
                <div className="w-full p-6 border-2 border-[var(--secondary)] bg-[var(--dark-muted-bg)]/90">
                  <div className="grid grid-cols-2 grid-rows-3">
                    {selectedSession.encounters &&
                    selectedSession.encounters.length > 0 ? (
                      <>
                        {selectedSession.encounters
                          .slice(0, 5)
                          .map((enc, idx) => (
                            <div key={idx}>
                              <p className="font-semibold text-[var(--primary)] mb-3">
                                {enc.name || `Encounter ${idx + 1}`}
                              </p>
                              {enc.creatures && enc.creatures.length > 0 ? (
                                <ul className="ml-2 space-y-1 text-sm text-[var(--secondary)]">
                                  {enc.creatures.map((c, i) => (
                                    <li key={i}>
                                      {c.name} × {c.count}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[var(--secondary)]/60 italic text-sm">
                                  No creatures
                                </p>
                              )}
                            </div>
                          ))}

                        {/* 9th slot shows +X more */}
                        {selectedSession.encounters.length > 5 ? (
                          <div className="flex items-center justify-start">
                            <p className="text-[var(--secondary)] text-center text-3xl font-semibold">
                              +{selectedSession.encounters.length - 5}
                            </p>
                          </div>
                        ) : (
                          selectedSession.encounters
                            .slice(7, 9)
                            .map((enc, idx) => (
                              <div
                                key={idx + 8}
                                className="border border-[var(--secondary)] p-2 rounded"
                              >
                                <p className="font-semibold text-[var(--primary)] mb-1">
                                  {enc.name || `Encounter ${idx + 9}`}
                                </p>
                                {enc.creatures && enc.creatures.length > 0 ? (
                                  <ul className="ml-2 space-y-1 text-sm text-[var(--secondary)]">
                                    {enc.creatures.map((c, i) => (
                                      <li key={i}>
                                        {c.name} × {c.count}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[var(--secondary)]/60 italic text-sm">
                                    No creatures
                                  </p>
                                )}
                              </div>
                            ))
                        )}
                      </>
                    ) : (
                      <p className="col-span-3 text-[var(--secondary)]/80 text-sm text-center">
                        No encounters yet
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT: Maps */}
                <div className="flex gap-4 pointer-events-none">
                  {(selectedSession.combatMaps || [])
                    .slice(0, 2)
                    .map((map, idx) => (
                      <div
                        key={idx}
                        className="flex-1 aspect-square p-2 border-2 border-[var(--secondary)] overflow-hidden cursor-pointer flex items-center justify-center"
                      >
                        {map.image ? (
                          <img
                            src={map.image}
                            alt={map.title || `Map ${idx + 1}`}
                            className="object-cover w-full h-full transition-transform duration-200"
                          />
                        ) : (
                          <p className="text-[var(--secondary)]/80 text-sm text-center px-2">
                            {map.title || `Map ${idx + 1}`}
                          </p>
                        )}
                      </div>
                    ))}

                  {/* Placeholder or +X more */}
                  {(selectedSession.combatMaps?.length || 0) > 2 ? (
                    <div className="flex-1 aspect-square flex items-center justify-center border-2 border-[var(--secondary)]">
                      <p className="text-[var(--secondary)] text-3xl font-semibold">
                        +{(selectedSession.combatMaps?.length || 0) - 2}
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 aspect-square border-2 border-[var(--secondary)]/50 flex items-center justify-center text-[#555] text-sm">
                      Empty
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Buttons beneath details box */}
            <div
              className="flex justify-between items-center w-full
mt-8 z-20"
            >
              {/* Left: EDIT + DELETE buttons stacked, centered */}
              <div className="flex flex-col items-center pl-10">
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
              <div className="pr-10">
                <ActionButton
                  label="RUN SESSION"
                  onClick={() => runSession(selectedSession.id)}
                  size="md"
                  showLeftArrow={true}
                  showRightArrow={true}
                  showGlow={false}
                  animate={true}
                  animationDelay={0.2}
                />
              </div>
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
          </>
        )}
      </motion.div>
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
      backdrop-blur-sm bg-black/60"
        >
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            campaign={sessionToDelete}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      )}
    </div>
  );
}

