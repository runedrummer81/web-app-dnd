import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const InitiativeSetup = ({ sessionData, onClose, onStart }) => {
  // Get encounters and combat maps from session data
  const encounters = sessionData?.encounters || [];
  const combatMaps = sessionData?.combatMaps || [];

  // State
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [selectedCombatMap, setSelectedCombatMap] = useState(null);
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState([
    { name: "Player 1", initiative: "" },
    { name: "Player 2", initiative: "" },
    { name: "Player 3", initiative: "" },
    { name: "Player 4", initiative: "" },
  ]);

  // Initialize with first encounter and map if available
  useEffect(() => {
    if (encounters.length > 0 && !selectedEncounter) {
      setSelectedEncounter(encounters[0]);
    }
    if (combatMaps.length > 0 && !selectedCombatMap) {
      setSelectedCombatMap(combatMaps[0]);
    }
  }, [encounters, combatMaps]);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    // Adjust players array
    const newPlayers = Array(count)
      .fill(null)
      .map((_, index) => {
        if (index < players.length) {
          return players[index];
        }
        return { name: `Player ${index + 1}`, initiative: "" };
      });
    setPlayers(newPlayers);
  };

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name };
    setPlayers(newPlayers);
  };

  const handleInitiativeChange = (index, value) => {
    // Only allow numbers
    const numValue = value.replace(/\D/g, "");
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], initiative: numValue };
    setPlayers(newPlayers);
  };

  const handleStart = () => {
    if (!selectedEncounter) {
      alert("Please select an encounter");
      return;
    }
    if (!selectedCombatMap) {
      alert("Please select a combat map");
      return;
    }

    // Validate all players have initiative
    const hasEmptyInitiative = players.some((p) => !p.initiative);
    if (hasEmptyInitiative) {
      alert("Please enter initiative for all players");
      return;
    }

    // Convert initiative strings to numbers
    const playerData = players.map((p) => ({
      name: p.name,
      initiative: parseInt(p.initiative, 10),
    }));

    onStart(selectedEncounter, playerData, selectedCombatMap);
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
        className="relative bg-[#151612] border-4 border-[#BF883C] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "0 0 50px rgba(191,136,60,0.5)",
        }}
      >
        <div className="p-8">
          {/* Title */}
          <h2
            className="text-3xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] text-center mb-2"
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow: "0 0 20px rgba(217,202,137,0.6)",
            }}
          >
            Combat Setup
          </h2>
          <div className="h-[2px] w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#BF883C] to-transparent" />

          {/* Encounter Selection */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Select Encounter
            </label>
            {encounters.length === 0 ? (
              <div className="p-4 border-2 border-red-500/30 bg-red-900/10">
                <p className="text-red-400 text-sm">
                  No encounters available. Please add encounters to your session
                  first.
                </p>
              </div>
            ) : (
              <select
                value={selectedEncounter?.id || ""}
                onChange={(e) => {
                  const encounter = encounters.find(
                    (enc) => enc.id === e.target.value
                  );
                  setSelectedEncounter(encounter);
                }}
                className="w-full bg-[#1a1814] border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 text-lg font-bold focus:outline-none focus:border-[#d9ca89] transition-all"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {encounters.map((encounter) => (
                  <option key={encounter.id} value={encounter.id}>
                    {encounter.name} - {encounter.difficulty} (
                    {encounter.creatures?.length || 0} creatures)
                  </option>
                ))}
              </select>
            )}

            {/* Encounter Info Display */}
            {selectedEncounter && (
              <div className="mt-3 p-4 border-2 border-[#BF883C]/30 bg-[#1a1814]/50">
                <p
                  className="text-[#d9ca89] font-bold text-lg mb-2"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {selectedEncounter.name}
                </p>
                <p
                  className="text-[#BF883C]/70 text-sm uppercase tracking-wider mb-2"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {selectedEncounter.difficulty} •{" "}
                  {selectedEncounter.creatures?.length || 0} Creatures
                </p>
                {selectedEncounter.creatures && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEncounter.creatures.map((creature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#BF883C]/20 text-[#d9ca89] px-2 py-1 border border-[#BF883C]/40"
                      >
                        {creature.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Combat Map Selection */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Select Combat Map
            </label>
            {combatMaps.length === 0 ? (
              <div className="p-4 border-2 border-red-500/30 bg-red-900/10">
                <p className="text-red-400 text-sm">
                  No combat maps available. Please add combat maps to your
                  session first.
                </p>
              </div>
            ) : (
              <select
                value={selectedCombatMap?.id || ""}
                onChange={(e) => {
                  const map = combatMaps.find((m) => m.id === e.target.value);
                  setSelectedCombatMap(map);
                }}
                className="w-full bg-[#1a1814] border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 text-lg font-bold focus:outline-none focus:border-[#d9ca89] transition-all"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {combatMaps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Player Count */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Number of Players
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((count) => (
                <motion.button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`flex-1 p-4 font-bold text-lg transition-all ${
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

          {/* Player Names and Initiatives */}
          <div className="mb-6">
            <label
              className="block text-[#d9ca89] font-bold mb-3 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Player Details
            </label>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerNameChange(index, e.target.value)
                      }
                      className="w-full bg-[#1a1814] border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 font-bold focus:outline-none focus:border-[#d9ca89] transition-all"
                      style={{ fontFamily: "EB Garamond, serif" }}
                      placeholder={`Player ${index + 1} Name`}
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={player.initiative}
                      onChange={(e) =>
                        handleInitiativeChange(index, e.target.value)
                      }
                      className="w-full bg-[#1a1814] border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 text-center text-xl font-bold focus:outline-none focus:border-[#d9ca89] transition-all"
                      style={{ fontFamily: "EB Garamond, serif" }}
                      placeholder="Init"
                    />
                  </div>
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
                  Creature initiatives will be rolled automatically using their
                  initiative modifiers. After starting combat, you will be able
                  to position tokens on the map.
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
              disabled={
                !selectedEncounter ||
                !selectedCombatMap ||
                encounters.length === 0 ||
                combatMaps.length === 0
              }
              className={`flex-1 border-2 py-4 px-6 font-bold uppercase tracking-wider ${
                !selectedEncounter ||
                !selectedCombatMap ||
                encounters.length === 0 ||
                combatMaps.length === 0
                  ? "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-700 to-red-600 text-white border-yellow-400"
              }`}
              whileHover={
                selectedEncounter && selectedCombatMap
                  ? {
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(239,68,68,0.6)",
                    }
                  : {}
              }
              whileTap={
                selectedEncounter && selectedCombatMap ? { scale: 0.98 } : {}
              }
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Enter Combat
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
