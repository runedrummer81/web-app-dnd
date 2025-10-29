import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SessionNotes = ({
  initialNotes = [],
  selectedSession,
  onNotesChange,
}) => {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("story");
  const [notesOpen, setNotesOpen] = useState(false);

  const categories = [
    { id: "story", label: "Story Moment", color: "blue" },
    { id: "npc", label: "NPC", color: "purple" },
    { id: "loot", label: "Loot/Item", color: "yellow" },
    { id: "quest", label: "Quest", color: "green" },
    { id: "combat", label: "Combat", color: "red" },
    { id: "other", label: "Other", color: "gray" },
  ];

  // Merge initialNotes and selectedSession notes on mount or when selectedSession changes
  useEffect(() => {
    const premadeNotes = selectedSession?.sessionNotes || [];
    setNotes([...premadeNotes, ...initialNotes]);
  }, [initialNotes, selectedSession]);

  const addNote = () => {
    if (!newNoteText.trim()) return;
    const newNote = {
      id: Date.now(),
      text: newNoteText.trim(),
      category: selectedCategory,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setNewNoteText("");
    onNotesChange?.(updated);
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    onNotesChange?.(updated);
  };

  const getCat = (id) => categories.find((c) => c.id === id) || categories[5];

  return (
    <div className="relative w-full h-full flex flex-col overflow-y-hidden gap-4 px-4">
      {/* Quick Note Section */}
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center">
          <h3 className="text-[var(--primary)] font-bold text-sm tracking-wide uppercase ">
            Quick Notes
          </h3>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
      relative flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold transition-all
      border border-[var(--secondary)]
      ${
        selectedCategory === cat.id
          ? `bg-[var(--primary)] text-[var(--dark-muted-bg)]`
          : `text-[var(--secondary)] hover:border-[var(--primary)]`
      }
    `}
            >
              {selectedCategory === cat.id && (
                <span
                  className="absolute left-0 top-0 h-full w-4"
                  style={{ backgroundColor: `var(--${cat.color})` }}
                />
              )}
              <span>{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Input Row */}
        <div className="flex">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Record an event, NPC, or treasure..."
            className="flex-1 text-[var(--primary)] px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={addNote}
            className="cursor-pointer border-2 border-[var(--secondary)] hover:bg-[var(--primary)] hover:border-[var(--primary)] text-[var(--primary)] hover:text-[var(--dark-muted-bg)] px-4 py-2 font-semibold text-sm transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* NOTES OVERVIEW DROPDOWN */}
      <section className="relative">
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="w-full p-4 transition-all duration-300 flex items-center justify-between group"
        >
          <div className="text-left">
            <h2
              className={`text-base font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                notesOpen ? "text-[var(--primary)]" : "text-[var(--secondary)]"
              }`}
            >
              Session Log
            </h2>
            {notes.length > 0 && (
              <p className="text-xs text-[#BF883C]/70 uppercase tracking-wider mt-1">
                {notes.length} note{notes.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-[#BF883C] transition-colors duration-300"
            animate={{ rotate: notesOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M 5,7 L 10,12 L 15,7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="square"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {notesOpen && notes.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 p-4">
                {notes.map((note) => {
                  const cat = getCat(note.category);
                  return (
                    <div
                      key={note.id}
                      className="relative border-l-[4px] p-3 rounded-r-md group transition-all"
                      style={{ borderLeftColor: `var(--${cat.color})` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-s font-semibold"
                              style={{ color: `var(--${cat.color})` }}
                            >
                              {cat.label}
                            </span>
                            <span className="text-xs text-[var(--secondary)]">
                              {note.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--primary)] leading-snug">
                            {note.text}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => setNotes([])}
                  className="text-xs text-red-500 hover:text-red-400 mt-2"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
          {notesOpen && notes.length === 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden p-4 bg-[#1a1814]/60 border border-[#d9ca89]/20 rounded text-center"
            >
              <p className="text-gray-500 text-sm italic">
                “No tales recorded yet, Dungeon Master.”
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
