import { useState } from "react";

export const SessionNotes = ({ initialNotes = [], onNotesChange }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("story");

  const categories = [
    { id: "story", label: "Story Moment", icon: "📖", color: "blue" },
    { id: "npc", label: "NPC", icon: "🎭", color: "purple" },
    { id: "loot", label: "Loot/Item", icon: "💎", color: "yellow" },
    { id: "quest", label: "Quest", icon: "📜", color: "green" },
    { id: "combat", label: "Combat", icon: "⚔️", color: "red" },
    { id: "other", label: "Other", icon: "📌", color: "gray" },
  ];

  const addNote = () => {
    if (!newNoteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: newNoteText,
      category: selectedCategory,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setNewNoteText("");

    if (onNotesChange) onNotesChange(updatedNotes); // <-- notify parent
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (onNotesChange) onNotesChange(updatedNotes); // <-- notify parent
  };

  const getCategoryConfig = (categoryId) => {
    return categories.find((c) => c.id === categoryId) || categories[5];
  };

  const getNotesByCategory = (categoryId) => {
    return notes.filter((note) => note.category === categoryId);
  };

  return (
    <div className="space-y-4">
      {/* Quick Capture */}
      <div className="bg-gray-800 border-2 border-yellow-600/30 rounded p-4">
        <h3 className="text-yellow-600 font-semibold mb-3 text-sm">
          ✍️ Quick Note
        </h3>

        {/* Category Selection */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2 rounded text-xs transition-all ${
                selectedCategory === cat.id
                  ? "bg-yellow-600 text-black font-semibold"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Note Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNote()}
            placeholder="Type note and press Enter..."
            className="flex-1 bg-gray-700 text-gray-100 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <button
            onClick={addNote}
            className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 rounded font-semibold text-sm transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-yellow-600 font-semibold text-sm">
              Session Log ({notes.length} notes)
            </h3>
            <button
              onClick={() => setNotes([])}
              className="text-red-500 hover:text-red-400 text-xs"
            >
              Clear All
            </button>
          </div>

          {notes.map((note) => {
            const catConfig = getCategoryConfig(note.category);
            return (
              <div
                key={note.id}
                className="bg-gray-800 border-l-4 p-3 rounded-r group hover:bg-gray-750 transition-all"
                style={{ borderLeftColor: `var(--${catConfig.color})` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{catConfig.icon}</span>
                      <span className="text-xs font-semibold text-yellow-600">
                        {catConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {note.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{note.text}</p>
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
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded text-center">
          <p className="text-gray-500 text-sm">
            No notes yet. Start capturing moments from your session!
          </p>
        </div>
      )}

      {/* Category Summary */}
      {notes.length > 0 && (
        <div className="bg-gray-800/50 border border-yellow-600/20 p-3 rounded">
          <p className="text-xs text-gray-400 mb-2 font-semibold">
            📊 Session Summary:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {categories.map((cat) => {
              const count = getNotesByCategory(cat.id).length;
              if (count === 0) return null;
              return (
                <div key={cat.id} className="text-gray-300">
                  {cat.icon} {cat.label}:{" "}
                  <span className="text-yellow-500 font-semibold">{count}</span>
                </div>
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
          --gray: #6b7280;
        }
      `}</style>
    </div>
  );
};
