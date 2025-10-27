import { useState } from "react";
import { motion } from "framer-motion";

export const InitiativeSetup = ({ encounter, onClose, onStart }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerInitiatives, setPlayerInitiatives] = useState([0, 0, 0, 0]);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setPlayerInitiatives(Array(count).fill(0));
  };

  const handleInitiativeChange = (index, value) => {
    const newInits = [...playerInitiatives];
    newInits[index] = parseInt(value) || 0;
    setPlayerInitiatives(newInits);
  };

  const handleStart = () => {
    onStart(playerInitiatives);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#151612] border-4 border-[#BF883C] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        style={{
          boxShadow: "0 0 50px rgba(191,136,60,0.5)",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#d9ca89]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#d9ca89]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#d9ca89]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#d9ca89]" />

        <div className="p-8">
          {/* Title */}
          <h2
            className="text-3xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] text-center mb-2"
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow: "0 0 20px rgba(217,202,137,0.6)",
            }}
          >
            Initiative Setup
          </h2>
          <div className="h-[2px] w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#BF883C] to-transparent" />

          {/* Encounter Info */}
          {encounter && (
            <div className="mb-6 p-4 border-2 border-[#BF883C]/30 bg-[#1a1814]/50">
              <p
                className="text-[#d9ca89] font-bold text-lg mb-2"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {encounter.name}
              </p>
              <p
                className="text-[#BF883C]/70 text-sm uppercase tracking-wider"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {encounter.difficulty} • {encounter.creatures?.length || 0}{" "}
                Creatures
              </p>
            </div>
          )}

          {/* Player Count */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              How many players?
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                <motion.button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`p-4 font-bold text-lg transition-all ${
                    playerCount === count
                      ? "bg-gradient-to-br from-[#BF883C] to-[#8b6429] text-[#151612] border-2 border-[#d9ca89]"
                      : "bg-gradient-to-br from-[#3d3426] to-[#2a2419] text-[#BF883C] border-2 border-[#BF883C]/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {count}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Player Initiatives */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Enter Player Initiative Rolls
            </label>
            <div className="space-y-3">
              {playerInitiatives.map((init, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span
                    className="text-[#BF883C] font-bold w-24 uppercase tracking-wider text-sm"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    Player {index + 1}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={init}
                    onChange={(e) =>
                      handleInitiativeChange(index, e.target.value)
                    }
                    className="flex-1 bg-[#1a1814] border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 text-center text-xl font-bold focus:outline-none focus:border-[#d9ca89] transition-all"
                    style={{ fontFamily: "EB Garamond, serif" }}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 border-2 border-yellow-600/30 bg-yellow-900/10">
            <div className="flex items-start gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d9ca89"
                strokeWidth="2"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>
                <p
                  className="text-[#d9ca89] text-sm font-bold mb-1 uppercase tracking-wider"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  Note
                </p>
                <p
                  className="text-[#BF883C]/70 text-xs"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  Creature initiatives will be rolled automatically when combat
                  starts
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-[#3d3426] to-[#2a2419] text-[#BF883C] border-2 border-[#BF883C]/30 py-4 px-6 font-bold uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-red-700 to-red-600 text-white border-2 border-yellow-400 py-4 px-6 font-bold uppercase tracking-wider"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px rgba(239,68,68,0.6)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Start Combat
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
