import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCombatState } from "./CombatStateContext";

export const InitiativeTracker = () => {
  const {
    initiativeOrder,
    currentTurnIndex,
    nextTurn,
    combatRound,
    updateCreatureHp,
  } = useCombatState();

  const [expandedCreature, setExpandedCreature] = useState(null);

  if (initiativeOrder.length === 0) {
    return (
      <div
        className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
        style={{ fontFamily: "EB Garamond, serif" }}
      >
        No combatants in initiative order
      </div>
    );
  }

  const currentCombatant = initiativeOrder[currentTurnIndex];

  return (
    <div className="space-y-4">
      {/* Combat Round Display */}
      <motion.div
        className="relative text-center py-3 bg-gradient-to-r from-red-900/20 via-red-800/30 to-red-900/20 border-y-2 border-red-500/30"
        animate={{
          boxShadow: [
            "0 0 20px rgba(239,68,68,0.2)",
            "0 0 30px rgba(239,68,68,0.4)",
            "0 0 20px rgba(239,68,68,0.2)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <h2
          className="text-2xl font-bold text-red-400 uppercase tracking-[0.3em]"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 0 20px rgba(239,68,68,0.6)",
          }}
        >
          Round {combatRound}
        </h2>
      </motion.div>

      {/* Current Turn - Large Display */}
      <motion.div
        key={currentCombatant.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative border-4 border-yellow-400 bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-red-900/30 p-6"
        style={{
          boxShadow:
            "0 0 40px rgba(250,204,21,0.5), inset 0 0 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-yellow-300" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-yellow-300" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-yellow-300" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-yellow-300" />

        {/* Glowing banner */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-2 border-2 border-yellow-300">
          <motion.p
            className="text-xs font-bold uppercase tracking-[0.2em] text-white"
            style={{ fontFamily: "EB Garamond, serif" }}
            animate={{
              textShadow: [
                "0 0 10px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,1)",
                "0 0 10px rgba(255,255,255,0.8)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Current Turn
          </motion.p>
        </div>

        <div className="mt-2 space-y-4">
          {/* Name and Initiative */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentCombatant.isPlayer ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                >
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <div>
                <h3
                  className="text-2xl font-bold text-yellow-200 uppercase tracking-wider"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "0 0 15px rgba(253,224,71,0.6)",
                  }}
                >
                  {currentCombatant.name}
                </h3>
                <p
                  className="text-xs text-yellow-400/70 uppercase tracking-wider"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {currentCombatant.isPlayer ? "Player" : "Creature"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className="text-sm text-yellow-400/70 uppercase tracking-wider mb-1"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                Initiative
              </p>
              <p
                className="text-4xl font-bold text-yellow-200"
                style={{
                  fontFamily: "EB Garamond, serif",
                  textShadow: "0 0 20px rgba(253,224,71,0.8)",
                }}
              >
                {currentCombatant.initiative}
              </p>
            </div>
          </div>

          {/* Creature Health Bar (if not player) */}
          {!currentCombatant.isPlayer && currentCombatant.stats && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm text-yellow-400 uppercase tracking-wider"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  Health
                </span>
                <span
                  className="text-sm font-bold text-yellow-200"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {currentCombatant.currentHp} / {currentCombatant.maxHp}
                </span>
              </div>
              <div className="h-4 bg-black/50 border-2 border-yellow-600/30 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${
                      (currentCombatant.currentHp / currentCombatant.maxHp) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    boxShadow: "0 0 10px rgba(239,68,68,0.6)",
                  }}
                />
              </div>

              {/* Quick HP Adjustment */}
              <div className="flex gap-2 mt-3">
                <motion.button
                  onClick={() =>
                    updateCreatureHp(
                      currentCombatant.id,
                      currentCombatant.currentHp - 5
                    )
                  }
                  className="flex-1 bg-red-700/30 border border-red-500/50 text-red-400 py-2 px-3 text-sm font-bold uppercase tracking-wider"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(185,28,28,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  -5 HP
                </motion.button>
                <motion.button
                  onClick={() =>
                    updateCreatureHp(
                      currentCombatant.id,
                      currentCombatant.currentHp - 10
                    )
                  }
                  className="flex-1 bg-red-700/30 border border-red-500/50 text-red-400 py-2 px-3 text-sm font-bold uppercase tracking-wider"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(185,28,28,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  -10 HP
                </motion.button>
                <motion.button
                  onClick={() =>
                    updateCreatureHp(
                      currentCombatant.id,
                      currentCombatant.currentHp + 5
                    )
                  }
                  className="flex-1 bg-green-700/30 border border-green-500/50 text-green-400 py-2 px-3 text-sm font-bold uppercase tracking-wider"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(21,128,61,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  +5 HP
                </motion.button>
              </div>

              {/* Expand Stat Block Button */}
              <motion.button
                onClick={() =>
                  setExpandedCreature(
                    expandedCreature === currentCombatant.id
                      ? null
                      : currentCombatant.id
                  )
                }
                className="w-full mt-3 bg-gradient-to-r from-[#3d3426] to-[#2a2419] border-2 border-yellow-600/30 text-yellow-400 py-3 px-4 font-bold uppercase tracking-wider"
                whileHover={{ scale: 1.01, borderColor: "rgba(202,138,4,0.5)" }}
                whileTap={{ scale: 0.99 }}
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {expandedCreature === currentCombatant.id
                  ? "Hide Stat Block"
                  : "Show Stat Block"}
              </motion.button>

              {/* Expanded Stat Block */}
              <AnimatePresence>
                {expandedCreature === currentCombatant.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <CreatureStatBlock creature={currentCombatant} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Player Turn Message */}
          {currentCombatant.isPlayer && (
            <div className="text-center py-6 border-2 border-yellow-600/20 bg-black/20">
              <p
                className="text-yellow-400 text-sm uppercase tracking-wider"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                Players control their own turns
              </p>
              <p
                className="text-yellow-600/70 text-xs mt-2 uppercase tracking-wider"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                Click creatures to adjust their health
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Next Turn Button */}
      <motion.button
        onClick={nextTurn}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 font-bold uppercase tracking-[0.2em] text-lg border-2 border-yellow-400"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(251,146,60,0.6)",
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          fontFamily: "EB Garamond, serif",
          boxShadow: "0 0 20px rgba(251,146,60,0.4)",
        }}
      >
        Next Turn →
      </motion.button>

      {/* Initiative Order List */}
      <div className="space-y-2">
        <h3
          className="text-lg font-bold text-[#d9ca89] uppercase tracking-wider mb-3"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 0 10px rgba(217,202,137,0.3)",
          }}
        >
          Initiative Order
        </h3>

        {initiativeOrder.map((combatant, index) => {
          const isCurrent = index === currentTurnIndex;
          const healthPercent = combatant.maxHp
            ? (combatant.currentHp / combatant.maxHp) * 100
            : 100;

          return (
            <motion.div
              key={combatant.id}
              className={`relative border-2 p-3 transition-all ${
                isCurrent
                  ? "border-yellow-400 bg-yellow-900/20"
                  : "border-[#BF883C]/30 bg-[#151612]/50 hover:border-[#BF883C]/60"
              }`}
              whileHover={!isCurrent ? { x: 4 } : {}}
              style={{
                boxShadow: isCurrent ? "0 0 20px rgba(250,204,21,0.3)" : "none",
              }}
            >
              {isCurrent && (
                <>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rotate-45" />
                  <motion.div
                    className="absolute inset-0 border-2 border-yellow-400"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCurrent
                        ? "bg-yellow-400 text-black"
                        : "bg-[#BF883C]/30 text-[#d9ca89]"
                    }`}
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    {combatant.initiative}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-bold uppercase tracking-wider ${
                          isCurrent ? "text-yellow-200" : "text-[#d9ca89]"
                        }`}
                        style={{ fontFamily: "EB Garamond, serif" }}
                      >
                        {combatant.name}
                      </p>
                      {combatant.isPlayer && (
                        <span
                          className="text-xs bg-green-600/30 border border-green-500/50 text-green-400 px-2 py-0.5 uppercase tracking-wider"
                          style={{ fontFamily: "EB Garamond, serif" }}
                        >
                          Player
                        </span>
                      )}
                    </div>

                    {/* Creature Health Bar */}
                    {!combatant.isPlayer && combatant.maxHp && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-[10px] text-[#BF883C]/70 uppercase tracking-wider"
                            style={{ fontFamily: "EB Garamond, serif" }}
                          >
                            HP
                          </span>
                          <span
                            className="text-xs font-bold text-[#d9ca89]"
                            style={{ fontFamily: "EB Garamond, serif" }}
                          >
                            {combatant.currentHp}/{combatant.maxHp}
                          </span>
                        </div>
                        <div className="h-2 bg-black/50 border border-[#BF883C]/30 overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              healthPercent > 50
                                ? "bg-gradient-to-r from-green-600 to-green-500"
                                : healthPercent > 25
                                ? "bg-gradient-to-r from-yellow-600 to-yellow-500"
                                : "bg-gradient-to-r from-red-600 to-red-500"
                            }`}
                            initial={{ width: "100%" }}
                            animate={{ width: `${healthPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
