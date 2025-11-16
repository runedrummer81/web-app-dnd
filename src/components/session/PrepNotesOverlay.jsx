import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function PrepNotesOverlay({
  isOpen,
  onClose,
  sessionData,
  quickNotes,
  onQuickNotesChange,
}) {
  const [activeTab, setActiveTab] = useState("prep"); // "prep" | "quick" | "quests"
  const [quests, setQuests] = useState([]);
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestDescription, setNewQuestDescription] = useState("");
  const [newQuestGiver, setNewQuestGiver] = useState("");
  const [newQuestReward, setNewQuestReward] = useState("");

  const contentRef = useRef(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("story");
  const [particles, setParticles] = useState([]);

  const campaignId = sessionData?.campaignId;

  // Fetch quests from Firestore
  useEffect(() => {
    if (!campaignId || !isOpen) return;

    const q = query(
      collection(db, "Quests"),
      where("campaignId", "==", campaignId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedQuests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuests(fetchedQuests);
    });

    return () => unsubscribe();
  }, [campaignId, isOpen]);

  // Generate floating particles
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 4,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Add quick note
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      text: newNoteText,
      category: newNoteCategory,
      timestamp: new Date().toISOString(),
    };

    onQuickNotesChange([...quickNotes, newNote]);
    setNewNoteText("");
  };

  // Delete quick note
  const handleDeleteNote = (noteId) => {
    onQuickNotesChange(quickNotes.filter((note) => note.id !== noteId));
  };

  // Add quest
  const handleAddQuest = async () => {
    if (!newQuestTitle.trim() || !campaignId) return;

    try {
      await addDoc(collection(db, "Quests"), {
        campaignId,
        title: newQuestTitle,
        description: newQuestDescription,
        questGiver: newQuestGiver,
        reward: newQuestReward,
        status: "active", // "active" | "completed" | "failed"
        dateAdded: new Date(),
        dateCompleted: null,
      });

      // Clear form
      setNewQuestTitle("");
      setNewQuestDescription("");
      setNewQuestGiver("");
      setNewQuestReward("");
    } catch (err) {
      console.error("Error adding quest:", err);
    }
  };

  // Update quest status
  const handleUpdateQuestStatus = async (questId, newStatus) => {
    try {
      await updateDoc(doc(db, "Quests", questId), {
        status: newStatus,
        dateCompleted:
          newStatus === "completed" || newStatus === "failed"
            ? new Date()
            : null,
      });
    } catch (err) {
      console.error("Error updating quest:", err);
    }
  };

  // Delete quest
  const handleDeleteQuest = async (questId) => {
    try {
      await deleteDoc(doc(db, "Quests", questId));
    } catch (err) {
      console.error("Error deleting quest:", err);
    }
  };

  // Category colors
  const categoryColors = {
    story: "#3b82f6",
    npc: "#8b5cf6",
    loot: "#f59e0b",
    quest: "#10b981",
    combat: "#ef4444",
    other: "#6b7280",
  };

  // Quest status icons
  const questStatusIcons = {
    active: { icon: "📜", color: "#f59e0b", label: "Active" },
    completed: { icon: "✅", color: "#10b981", label: "Completed" },
    failed: { icon: "❌", color: "#ef4444", label: "Failed" },
  };

  if (!sessionData) return null;

  const activeQuests = quests.filter((q) => q.status === "active");
  const completedQuests = quests.filter((q) => q.status === "completed");
  const failedQuests = quests.filter((q) => q.status === "failed");

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Magical Backdrop - CLICK TO CLOSE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
            style={{ zIndex: 9998 }}
          >
            {/* Floating Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background:
                    "radial-gradient(circle, rgba(191,136,60,0.6) 0%, transparent 70%)",
                  boxShadow: "0 0 8px rgba(191,136,60,0.4)",
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Open Journal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center p-[5vh] pointer-events-none"
            style={{ zIndex: 9999 }}
          >
            <div
              className="relative flex w-[90vw] h-[85vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                filter:
                  "drop-shadow(0 25px 50px rgba(0,0,0,0.7)) drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
              }}
            >
              {/* LEFT PAGE - Prep Notes (Static) */}
              <div
                className="relative w-[48%] h-full"
                style={{
                  background: "#f5ead6",
                  backgroundImage: `
                    linear-gradient(90deg, rgba(139,115,85,0.03) 1px, transparent 1px),
                    linear-gradient(rgba(139,115,85,0.03) 1px, transparent 1px),
                    radial-gradient(circle at 10% 20%, rgba(101,67,33,0.05) 0%, transparent 50%),
                    radial-gradient(circle at 90% 80%, rgba(101,67,33,0.04) 0%, transparent 40%)
                  `,
                  backgroundSize: "30px 30px, 30px 30px, 100% 100%, 100% 100%",
                  clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)",
                  boxShadow: `
                    inset 15px 0 40px rgba(0,0,0,0.12),
                    inset 0 8px 15px rgba(139,115,85,0.08),
                    inset 0 -8px 15px rgba(139,115,85,0.08)
                  `,
                }}
              >
                {/* Decorations */}
                <div
                  className="absolute top-12 left-8 w-16 h-16 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(101,67,33,0.08) 0%, transparent 70%)",
                    filter: "blur(3px)",
                  }}
                />

                <svg
                  className="absolute top-6 left-6 w-24 h-24 opacity-30"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="#8b7355"
                  strokeWidth="1.2"
                >
                  <path d="M 10,10 Q 30,8 50,10 Q 70,12 90,10" />
                  <path d="M 10,10 Q 8,30 10,50 Q 12,70 10,90" />
                  <circle cx="10" cy="10" r="3" fill="#8b7355" />
                </svg>

                {/* Title */}
                <div className="relative pt-10 pb-5 px-12">
                  <div
                    className="text-center mb-3 pb-3"
                    style={{
                      borderBottom: "2px solid #8b7355",
                      borderImage:
                        "linear-gradient(90deg, transparent, #8b7355, transparent) 1",
                    }}
                  >
                    <h3
                      className="text-3xl font-bold text-[#3d2817]"
                      style={{
                        fontFamily: "EB Garamond, serif",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Preparation Notes
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="h-[calc(100%-160px)] overflow-y-auto px-12 py-4"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#8b7355 transparent",
                  }}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    style={{
                      fontFamily: "EB Garamond, serif",
                      color: "#3d2817",
                      lineHeight: "2",
                      fontSize: "1.1rem",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        sessionData.dmNotes ||
                        `<p style="text-align: center; opacity: 0.4; font-style: italic; margin-top: 80px;">No preparation notes yet...</p>`,
                    }}
                  />
                </div>
              </div>

              {/* CENTER SPINE */}
              <div
                className="relative w-[4%] h-full z-20"
                style={{
                  background:
                    "linear-gradient(90deg, #3d2817 0%, #5a3f2a 30%, #6b4d35 50%, #5a3f2a 70%, #3d2817 100%)",
                  boxShadow: `
                    inset 0 0 40px rgba(0,0,0,0.6),
                    -8px 0 25px rgba(0,0,0,0.4),
                    8px 0 25px rgba(0,0,0,0.4)
                  `,
                }}
              >
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-[2px]"
                    style={{
                      top: `${(i + 1) * 6.25}%`,
                      background:
                        "linear-gradient(90deg, transparent 20%, rgba(101,67,33,0.4) 50%, transparent 80%)",
                    }}
                  />
                ))}

                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, #bf883c 0%, #8b7355 100%)",
                    boxShadow:
                      "inset 0 2px 8px rgba(0,0,0,0.5), 0 0 15px rgba(191,136,60,0.4)",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    className="opacity-80"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="#3d2817"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M 20,8 L 20,32 M 8,20 L 32,20"
                      stroke="#3d2817"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>

              {/* RIGHT PAGE - DYNAMIC CONTENT */}
              <div className="relative w-[48%] h-full">
                {/* BOOKMARK TABS at top */}
                <div className="absolute -top-3 right-8 flex gap-2 z-30">
                  <button
                    onClick={() => setActiveTab("quick")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "quick"
                        ? "bg-[#f5ead6] text-[#3d2817] translate-y-1"
                        : "bg-[#8b7355] text-[#f5ead6] hover:bg-[#9b8365]"
                    }`}
                    style={{
                      fontFamily: "EB Garamond, serif",
                      clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                      boxShadow:
                        activeTab === "quick"
                          ? "0 2px 8px rgba(0,0,0,0.3)"
                          : "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    📝 Quick Notes
                  </button>

                  <button
                    onClick={() => setActiveTab("quests")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "quests"
                        ? "bg-[#f5ead6] text-[#3d2817] translate-y-1"
                        : "bg-[#8b7355] text-[#f5ead6] hover:bg-[#9b8365]"
                    }`}
                    style={{
                      fontFamily: "EB Garamond, serif",
                      clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                      boxShadow:
                        activeTab === "quests"
                          ? "0 2px 8px rgba(0,0,0,0.3)"
                          : "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    ⚔️ Quest Log
                  </button>
                </div>

                {/* PAGE CONTENT with flip animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                      background: "#f5ead6",
                      backgroundImage: `
                        linear-gradient(90deg, rgba(139,115,85,0.03) 1px, transparent 1px),
                        linear-gradient(rgba(139,115,85,0.03) 1px, transparent 1px),
                        radial-gradient(circle at 90% 20%, rgba(101,67,33,0.05) 0%, transparent 50%)
                      `,
                      backgroundSize: "30px 30px, 30px 30px, 100% 100%",
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 2% 100%)",
                      boxShadow: `
                        inset -15px 0 40px rgba(0,0,0,0.12),
                        inset 0 8px 15px rgba(139,115,85,0.08)
                      `,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-6 right-6 z-30 text-2xl text-[#8b7355] hover:text-[#3d2817] transition-colors cursor-pointer"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      ✕
                    </button>

                    {/* Decorations */}
                    <div
                      className="absolute top-16 right-12 w-20 h-20 rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(101,67,33,0.06) 0%, transparent 70%)",
                        filter: "blur(4px)",
                      }}
                    />

                    <svg
                      className="absolute top-6 right-6 w-24 h-24 opacity-30"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#8b7355"
                      strokeWidth="1.2"
                      style={{ transform: "rotate(90deg)" }}
                    >
                      <path d="M 10,10 Q 30,8 50,10 Q 70,12 90,10" />
                      <path d="M 10,10 Q 8,30 10,50 Q 12,70 10,90" />
                      <circle cx="10" cy="10" r="3" fill="#8b7355" />
                    </svg>

                    {/* QUICK NOTES CONTENT */}
                    {activeTab === "quick" && (
                      <>
                        <div className="relative pt-10 pb-5 px-12">
                          <div
                            className="text-center mb-3 pb-3"
                            style={{
                              borderBottom: "2px solid #8b7355",
                              borderImage:
                                "linear-gradient(90deg, transparent, #8b7355, transparent) 1",
                            }}
                          >
                            <h3
                              className="text-3xl font-bold text-[#3d2817]"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Quick Notes
                            </h3>
                          </div>
                        </div>

                        <div
                          className="h-[calc(100%-160px)] overflow-y-auto px-12 py-4 space-y-5"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#8b7355 transparent",
                          }}
                        >
                          {/* Add Note Form */}
                          <div className="space-y-3 pb-5 border-b border-[#8b7355]/40">
                            <textarea
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  handleAddNote();
                                }
                              }}
                              placeholder="Scribe your thoughts... (Ctrl+Enter)"
                              className="w-full p-3 bg-white/70 border border-[#8b7355]/50 focus:border-[#8b7355] outline-none resize-none cursor-text"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                fontSize: "1rem",
                                color: "#3d2817",
                                minHeight: "80px",
                              }}
                            />

                            <div className="flex gap-3">
                              <select
                                value={newNoteCategory}
                                onChange={(e) =>
                                  setNewNoteCategory(e.target.value)
                                }
                                className="flex-1 px-3 py-2 bg-white/70 border border-[#8b7355]/50 outline-none cursor-pointer"
                                style={{
                                  fontFamily: "EB Garamond, serif",
                                  color: "#3d2817",
                                }}
                              >
                                <option value="story">📖 Story</option>
                                <option value="npc">👤 NPC</option>
                                <option value="loot">💰 Loot</option>
                                <option value="quest">⚔️ Quest</option>
                                <option value="combat">⚡ Combat</option>
                                <option value="other">📝 Other</option>
                              </select>

                              <button
                                onClick={handleAddNote}
                                className="px-5 py-2 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90"
                                style={{
                                  fontFamily: "EB Garamond, serif",
                                  background:
                                    "linear-gradient(135deg, #8b7355 0%, #6d5a42 100%)",
                                  color: "#f5ead6",
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {/* Notes List */}
                          <div className="space-y-3">
                            {quickNotes.length === 0 ? (
                              <p
                                className="text-center text-[#8b7355] italic py-16"
                                style={{ fontFamily: "EB Garamond, serif" }}
                              >
                                No notes yet...
                              </p>
                            ) : (
                              quickNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className="p-3 bg-white/60 border-l-4 group hover:bg-white/80"
                                  style={{
                                    borderLeftColor:
                                      categoryColors[note.category],
                                  }}
                                >
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                      <span
                                        className="text-xs font-bold uppercase px-2 py-0.5"
                                        style={{
                                          fontFamily: "EB Garamond, serif",
                                          backgroundColor:
                                            categoryColors[note.category],
                                          color: "white",
                                        }}
                                      >
                                        {note.category}
                                      </span>
                                      <p
                                        className="text-[#3d2817] mt-2 whitespace-pre-wrap"
                                        style={{
                                          fontFamily: "EB Garamond, serif",
                                          fontSize: "1rem",
                                        }}
                                      >
                                        {note.text}
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="opacity-0 group-hover:opacity-100 text-red-600 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* QUEST LOG CONTENT */}
                    {activeTab === "quests" && (
                      <>
                        <div className="relative pt-10 pb-5 px-12">
                          <div
                            className="text-center mb-3 pb-3"
                            style={{
                              borderBottom: "2px solid #8b7355",
                              borderImage:
                                "linear-gradient(90deg, transparent, #8b7355, transparent) 1",
                            }}
                          >
                            <h3
                              className="text-3xl font-bold text-[#3d2817]"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Quest Log
                            </h3>
                          </div>
                        </div>

                        <div
                          className="h-[calc(100%-160px)] overflow-y-auto px-12 py-4 space-y-6"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#8b7355 transparent",
                          }}
                        >
                          {/* Add Quest Form */}
                          <div className="space-y-3 pb-5 border-b-2 border-[#8b7355]/40">
                            <input
                              type="text"
                              value={newQuestTitle}
                              onChange={(e) => setNewQuestTitle(e.target.value)}
                              placeholder="Quest Title..."
                              className="w-full p-3 bg-white/70 border border-[#8b7355]/50 focus:border-[#8b7355] outline-none cursor-text"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                fontSize: "1.1rem",
                                color: "#3d2817",
                                fontWeight: "bold",
                              }}
                            />

                            <textarea
                              value={newQuestDescription}
                              onChange={(e) =>
                                setNewQuestDescription(e.target.value)
                              }
                              placeholder="Quest description..."
                              className="w-full p-3 bg-white/70 border border-[#8b7355]/50 focus:border-[#8b7355] outline-none resize-none cursor-text"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                fontSize: "0.95rem",
                                color: "#3d2817",
                                minHeight: "60px",
                              }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={newQuestGiver}
                                onChange={(e) =>
                                  setNewQuestGiver(e.target.value)
                                }
                                placeholder="Quest Giver"
                                className="p-2 bg-white/70 border border-[#8b7355]/50 outline-none cursor-text"
                                style={{
                                  fontFamily: "EB Garamond, serif",
                                  color: "#3d2817",
                                }}
                              />

                              <input
                                type="text"
                                value={newQuestReward}
                                onChange={(e) =>
                                  setNewQuestReward(e.target.value)
                                }
                                placeholder="Reward"
                                className="p-2 bg-white/70 border border-[#8b7355]/50 outline-none cursor-text"
                                style={{
                                  fontFamily: "EB Garamond, serif",
                                  color: "#3d2817",
                                }}
                              />
                            </div>

                            <button
                              onClick={handleAddQuest}
                              className="w-full py-2 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90"
                              style={{
                                fontFamily: "EB Garamond, serif",
                                background:
                                  "linear-gradient(135deg, #8b7355 0%, #6d5a42 100%)",
                                color: "#f5ead6",
                              }}
                            >
                              Add Quest
                            </button>
                          </div>

                          {/* Active Quests */}
                          {activeQuests.length > 0 && (
                            <div>
                              <h4
                                className="text-xl font-bold text-[#3d2817] mb-3 flex items-center gap-2"
                                style={{ fontFamily: "EB Garamond, serif" }}
                              >
                                📜 Active Quests
                              </h4>
                              <div className="space-y-3">
                                {activeQuests.map((quest) => (
                                  <div
                                    key={quest.id}
                                    className="p-4 bg-white/60 border-l-4 border-[#f59e0b] group hover:bg-white/80"
                                  >
                                    <div className="flex justify-between items-start gap-3">
                                      <div className="flex-1">
                                        <h5
                                          className="text-lg font-bold text-[#3d2817] mb-1"
                                          style={{
                                            fontFamily: "EB Garamond, serif",
                                          }}
                                        >
                                          {quest.title}
                                        </h5>
                                        {quest.description && (
                                          <p
                                            className="text-sm text-[#3d2817]/80 mb-2"
                                            style={{
                                              fontFamily: "EB Garamond, serif",
                                            }}
                                          >
                                            {quest.description}
                                          </p>
                                        )}
                                        <div className="flex gap-4 text-xs text-[#8b7355]">
                                          {quest.questGiver && (
                                            <span>🧙 {quest.questGiver}</span>
                                          )}
                                          {quest.reward && (
                                            <span>💰 {quest.reward}</span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-1">
                                        <button
                                          onClick={() =>
                                            handleUpdateQuestStatus(
                                              quest.id,
                                              "completed"
                                            )
                                          }
                                          className="px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                          title="Mark Complete"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleUpdateQuestStatus(
                                              quest.id,
                                              "failed"
                                            )
                                          }
                                          className="px-2 py-1 text-xs bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                          title="Mark Failed"
                                        >
                                          ✕
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteQuest(quest.id)
                                          }
                                          className="px-2 py-1 text-xs bg-gray-600 text-white hover:bg-gray-700 cursor-pointer"
                                          title="Delete"
                                        >
                                          🗑
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Completed Quests */}
                          {completedQuests.length > 0 && (
                            <div>
                              <h4
                                className="text-xl font-bold text-[#10b981] mb-3 flex items-center gap-2"
                                style={{ fontFamily: "EB Garamond, serif" }}
                              >
                                ✅ Completed Quests
                              </h4>
                              <div className="space-y-2">
                                {completedQuests.map((quest) => (
                                  <div
                                    key={quest.id}
                                    className="p-3 bg-green-50/50 border-l-4 border-green-500 opacity-70"
                                    style={{ textDecoration: "line-through" }}
                                  >
                                    <p
                                      className="font-bold text-[#3d2817]"
                                      style={{
                                        fontFamily: "EB Garamond, serif",
                                      }}
                                    >
                                      {quest.title}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Failed Quests */}
                          {failedQuests.length > 0 && (
                            <div>
                              <h4
                                className="text-xl font-bold text-[#ef4444] mb-3 flex items-center gap-2"
                                style={{ fontFamily: "EB Garamond, serif" }}
                              >
                                ❌ Failed Quests
                              </h4>
                              <div className="space-y-2">
                                {failedQuests.map((quest) => (
                                  <div
                                    key={quest.id}
                                    className="p-3 bg-red-50/50 border-l-4 border-red-500 opacity-70"
                                  >
                                    <p
                                      className="font-bold text-[#3d2817]"
                                      style={{
                                        fontFamily: "EB Garamond, serif",
                                      }}
                                    >
                                      {quest.title}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {quests.length === 0 && (
                            <p
                              className="text-center text-[#8b7355] italic py-16"
                              style={{ fontFamily: "EB Garamond, serif" }}
                            >
                              No quests yet. Begin your adventure above!
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(overlayContent, document.body);
}
