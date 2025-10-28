import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SessionNotes = ({ initialNotes = [], onNotesChange }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("story");

  const categories = [
    { id: "story", label: "Story Moment", color: "blue" },
    { id: "npc", label: "NPC", color: "purple" },
    { id: "loot", label: "Loot/Item", color: "yellow" },
    { id: "quest", label: "Quest", color: "green" },
    { id: "combat", label: "Combat", color: "red" },
    { id: "other", label: "Other", color: "gray" },
  ];

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
  const countBy = (id) => notes.filter((n) => n.category === id).length;

  return (
    <div className="relative w-full h-full flex flex-col gap-4 p-5 bg-gradient-to-br from-[#181713] to-[#221f18] shadow-[inset_0_0_25px_rgba(217,202,137,0.15)] overflow-y-hidden">
      {/* Ambient Glow */}
      <div className="absolute -inset-2 rounded-2xl pointer-events-none opacity-30 blur-2xl bg-gradient-to-tr from-[#d9ca89]/20 to-[#bf883c]/10" />

      {/* Quick Note Section */}
      <div className="relative z-10 bg-[#1a1814] border border-[#d9ca89]/40 p-5 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[var(--primary)] font-bold text-sm tracking-wide uppercase drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]">
            Quick Notes
          </h3>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-all border ${
                selectedCategory === cat.id
                  ? `bg-[var(--${cat.color})] text-[var(--primary)] border-transparent shadow-[0_0_8px_rgba(234,179,8,0.5)]`
                  : "bg-[#25221c] text-gray-300 border-[#3a362c] hover:bg-[#312d25]"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Input Row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Record an event, NPC, or treasure..."
            className="flex-1 bg-[#2a2720] text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/60"
          />
          <button
            onClick={addNote}
            className="cursor-pointer bg-[var(--primary)] hover:bg-[var(--secondary)] text-black px-4 py-2 font-semibold text-sm shadow-[0_0_12px_rgba(234,179,8,0.4)] transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* 📜 Notes Log */}
      <div className="relative z-10 space-y-3 overflow-y-auto">
        {notes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-yellow-500 font-semibold text-sm tracking-wide drop-shadow-[0_0_6px_rgba(234,179,8,0.6)] uppercase">
                Session Log
              </h3>
              <button
                onClick={() => setNotes([])}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Clear All
              </button>
            </div>

            <AnimatePresence>
              {notes.map((note) => {
                const cat = getCat(note.category);
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-[#1a1814] border-l-[4px] p-3 rounded-r-md group shadow-md hover:bg-[#23201a] transition-all"
                    style={{ borderLeftColor: `var(--${cat.color})` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-xs font-semibold text-yellow-500">
                            {cat.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {note.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 leading-snug">
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </>
        ) : (
          <div className="bg-[#1a1814]/60 border border-[#d9ca89]/20 p-8 rounded text-center">
            <p className="text-gray-500 text-sm italic">
              “No tales recorded yet, Dungeon Master.”
            </p>
          </div>
        )}
      </div>

      {/* 🧭 Category Summary */}
      {notes.length > 0 && (
        <div className="relative z-10 bg-[#1a1814]/60 border border-[#d9ca89]/20 p-4 rounded-lg mt-2">
          <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]">
            Session Summary
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {categories.map((cat) => {
              const count = countBy(cat.id);
              return (
                count > 0 && (
                  <div key={cat.id} className="text-gray-300">
                    {cat.icon} {cat.label}:{" "}
                    <span className="text-yellow-500 font-bold">{count}</span>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        :root {
          --blue: #3b82f6;
          --purple: #a855f7;
          --yellow: #eab308;
          --green: #22c55e;
          --red: #ef4444;
          --gray: #9ca3af;
        }
      `}</style>
    </div>
  );
};
