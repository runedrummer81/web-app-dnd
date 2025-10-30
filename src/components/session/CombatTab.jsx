import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InitiativeSetup from "./InitiativeSetup";
import { useCombatState } from "./CombatStateContext";

export const CombatTab = ({ sessionData }) => {
  const { startCombat } = useCombatState();
  const [showInitiativeSetup, setShowInitiativeSetup] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState(null);

  const encounters = sessionData?.encounters || [];

  const handleRunEncounter = (encounter) => {
    setSelectedEncounter(encounter);
    setShowInitiativeSetup(true);
  };

  // Simple mock encounter for testing
  const mockEncounter = {
    name: "Test Encounter",
    difficulty: "Medium",
    creatures: [
      {
        name: "Orc Warrior",
        hp: 30,
        ac: 13,
        dexModifier: 1,
        stats: {
          ac: 13,
          speed: "30 ft",
          abilities: {
            STR: 16,
            DEX: 12,
            CON: 16,
            INT: 7,
            WIS: 11,
            CHA: 10,
          },
          attacks: [
            {
              name: "Greataxe",
              toHit: 5,
              damage: "1d12+3",
              damageDice: 12,
              damageBonus: 3,
            },
          ],
        },
      },
      {
        name: "Orc Grunt",
        hp: 15,
        ac: 12,
        dexModifier: 0,
        stats: {
          ac: 12,
          speed: "30 ft",
          abilities: {
            STR: 14,
            DEX: 10,
            CON: 14,
            INT: 7,
            WIS: 11,
            CHA: 10,
          },
          attacks: [
            {
              name: "Club",
              toHit: 4,
              damage: "1d6+2",
              damageDice: 6,
              damageBonus: 2,
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Big Start Combat Button */}
      <motion.button
        onClick={() => {
          setSelectedEncounter(mockEncounter);
          setShowInitiativeSetup(true);
        }}
        className="relative w-full bg-gradient-to-br from-red-700 via-red-600 to-orange-600 p-8 overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          boxShadow:
            "0 0 40px rgba(239,68,68,0.6), inset 0 0 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-yellow-300" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-yellow-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-yellow-300" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-yellow-300" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Crossed swords icon */}
          <motion.svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M14.5 17.5L3 6L6 3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
          </motion.svg>

          <div className="text-center">
            <h2
              className="text-3xl font-bold uppercase tracking-[0.3em] text-white mb-2"
              style={{
                fontFamily: "EB Garamond, serif",
                textShadow:
                  "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(239,68,68,0.6)",
              }}
            >
              Start Combat
            </h2>
            <p
              className="text-yellow-200 text-sm uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Enter Battle Mode
            </p>
          </div>
        </div>
      </motion.button>

      {/* Prepared Encounters */}
      <div>
        <h3
          className="text-[#d9ca89] font-bold uppercase tracking-wider mb-4 text-lg"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 0 15px rgba(217,202,137,0.4)",
          }}
        >
          Prepared Encounters
        </h3>

        {encounters.length > 0 ? (
          <div className="space-y-3">
            {encounters.map((encounter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative border-2 border-[#BF883C]/30 bg-gradient-to-r from-[#1a1814] to-[#151612] p-4 group hover:border-[#d9ca89]/50 transition-all"
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4
                      className="text-[#d9ca89] font-bold text-lg mb-2"
                      style={{
                        fontFamily: "EB Garamond, serif",
                        textShadow: "0 0 10px rgba(217,202,137,0.3)",
                      }}
                    >
                      {encounter.name}
                    </h4>
                    <p
                      className="text-[#BF883C]/70 text-sm uppercase tracking-wider mb-3"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {encounter.difficulty} •{" "}
                      {encounter.creatures?.length || 0} Creatures
                    </p>
                  </div>

                  <motion.button
                    onClick={() => handleRunEncounter(encounter)}
                    className="bg-gradient-to-br from-red-700 to-red-600 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm border-2 border-yellow-400/30"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(239,68,68,0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    Run Encounter
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            No encounters prepared - Click Start Combat above to test
          </div>
        )}
      </div>

      {/* Initiative Setup Popup */}
      <AnimatePresence>
        {showInitiativeSetup && (
          <InitiativeSetup
            sessionData={sessionData} // needed for encounters + combatMaps
            onClose={() => {
              setShowInitiativeSetup(false);
              setSelectedEncounter(null);
            }}
            onStart={(selectedEncounter, playerData, selectedCombatMap) => {
              startCombat(selectedEncounter, playerData, selectedCombatMap);
              setShowInitiativeSetup(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
