import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Get encounters and combat maps from session data
export default function InitiativeSetup({ sessionData, onStart, onClose }) {
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
    if (encounters.length > 0) {
      setSelectedEncounter((prev) => prev || encounters[0]);
    }
    if (combatMaps.length > 0) {
      setSelectedCombatMap((prev) => prev || combatMaps[0]);
    }
  }, [sessionData]);

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

          {/* Encounter-selection */}
          <h2 className="text-[var(--primary)] text-sm:2xl md:text-2xl uppercase tracking-widest text-left pb-2">
            Select Encounter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {encounters.map((encounter) => {
              const creatureImage = encounter.creatures?.[0]?.imageURL;
              const isSelected = selectedEncounter?.id === encounter.id;

              // Calculate total creature count
              const totalCreatures =
                encounter.creatures?.reduce(
                  (sum, c) => sum + (c.count || 1),
                  0
                ) || 0;

              return (
                <div
                  key={encounter.id}
                  onClick={() => setSelectedEncounter(encounter)}
                  className={`cursor-pointer border-2 p-4 transition-all transform hover:scale-103 hover:shadow-xl relative overflow-hidden ${
                    isSelected
                      ? "border-[#d9ca89] bg-[#2a261e]/50 animate-glow"
                      : "border-[#BF883C]/30 bg-[#1a1814]/40"
                  }`}
                >
                  {/* Creature Image on Right */}
                  {creatureImage && (
                    <div
                      className="absolute top-0 right-0 h-full w-1/2 bg-cover bg-center pointer-events-none"
                      style={{
                        backgroundImage: `url(${creatureImage})`,
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskSize: "cover",
                        WebkitMaskSize: "cover",
                      }}
                    ></div>
                  )}

                  {/* Encounter Info */}
                  <div className="relative z-10">
                    <p className="font-bold text-lg text-[var(--primary)]">
                      {encounter.name}
                    </p>
                    <p className="text-sm text-[var(--secondary)] mb-2">
                      Total: {totalCreatures} creature
                      {totalCreatures !== 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {encounter.creatures?.map((creature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-transparent text-[var(--secondary)] px-2 py-1 border border-[var(--primary)]"
                        >
                          {creature.name} × {creature.count || 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Combat Map Selection */}
          <div className="mb-6 mt-15">
            <h2 className="text-[var(--primary)] text-sm:2xl md:text-2xl uppercase tracking-widest text-left pb-2">
              Select Combat Map
            </h2>

            {combatMaps.length === 0 ? (
              <div className="p-4 border-2 border-red-500/30 bg-red-900/10">
                <p className="text-red-400 text-sm">
                  No combat maps available. Please add combat maps to your
                  session first.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {combatMaps.map((map) => {
                  const isSelected = selectedCombatMap?.id === map.id;

                  return (
                    <div
                      key={map.id}
                      onClick={() => setSelectedCombatMap(map)}
                      className={`cursor-pointer border-2 border-[var(--primary)]  overflow-hidden transition-all transform ${
                        isSelected
                          ? "border-[var(--primary)] shadow-xl scale-103 animate-glow"
                          : "border-[var(--secondary)] hover:scale-103"
                      } relative`}
                    >
                      {/* Map Image */}
                      <img
                        src={map.image}
                        alt={map.name}
                        className="w-full h-40 md:h-48 lg:h-56 object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Player Count */}
          <div className="mb-6 mt-15">
            <h2 className="text-[var(--primary)] text-sm:2xl md:text-2xl uppercase tracking-widest text-left pb-2">
              Number of Players
            </h2>
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
}
