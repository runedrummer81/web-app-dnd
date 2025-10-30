// InitiativeTracker.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCombatState } from "./CombatStateContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const InitiativeTracker = () => {
  const {
    initiativeOrder,
    setInitiativeOrder,
    currentTurnIndex,
    nextTurn,
    combatRound,
    updateCreatureHp,
  } = useCombatState();

  const [creatures, setCreatures] = useState([]);
  const [hpChange, setHpChange] = useState(0);

  useEffect(() => {
    const fetchCreatures = async () => {
      const snapshot = await getDocs(collection(db, "Creatures"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        maxHp: doc.data().maxHp || 0,
        currentHp: doc.data().currentHp ?? doc.data().maxHp ?? 0,
        initiative: doc.data().initiative || 0,
        stats: doc.data().stats || {},
        isPlayer: doc.data().isPlayer || false,
        imageURL: doc.data().imageURL || "/placeholder.png",
      }));
  
      setCreatures(data);
  
      // only initialize order if it's empty (avoid overwriting)
      setInitiativeOrder((prev) => {
        if (prev.length > 0) return prev;
        return [...data].sort((a, b) => b.initiative - a.initiative);
      });
    };
  
    fetchCreatures();
  }, [setInitiativeOrder]);
  

  const enrichedInitiativeOrder = initiativeOrder.map((combatant) => {
    const creatureData = creatures.find((c) => c.id === combatant.id);
    return {
      ...combatant,
      imageURL: creatureData?.imageURL || "/placeholder.png",
    };
  });

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

  const currentCombatant = enrichedInitiativeOrder[currentTurnIndex];
  const currentHp =
    currentCombatant.currentHp ??
    currentCombatant.hp ??
    currentCombatant.maxHp ??
    0;
  const displayHp =
    currentCombatant.currentHp ?? currentCombatant.hp ?? currentCombatant.maxHp;

  console.log("Current combatant:", currentCombatant);
  console.log("Image URL:", currentCombatant.imageURL);

  return (
    <div className="px-2 ">
      {/* Combat Round Display */}
      <motion.div className="relative flex flex-row justify-between items-center py-3 p-6">
        <h2 className="text-1xl text-[var(--secondary)] uppercase">
          Round {combatRound}
        </h2>
        <motion.button
          onClick={nextTurn}
          className=" text-[var(--primary)] font-black uppercase text-2xl "
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next Turn
        </motion.button>
      </motion.div>

      {/* Current Turn */}
      <motion.div
        key={currentCombatant.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative border-2 border-[var(--primary)] p-5 overflow-hidden min-h-[200px]"
      >
        {/* Background Image */}
        {currentCombatant.imageURL && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${currentCombatant.imageURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px) brightness(0.4)",
            }}
          />
        )}

        <div className="relative z-10 flex flex-row">
          <div className="w-2/3 space-y-4">
            {/* Name and Type */}
            <div className="items-center">
              <h3
                className={`text-2xl font-bold uppercase tracking-wider ${
                  currentCombatant.isDead
                    ? "text-red-500 line-through"
                    : "text-[var(--primary)]"
                }`}
              >
                {currentCombatant.name}
              </h3>
              <p className="text-xs text-[var(--secondary)] uppercase tracking-wider">
                {currentCombatant.isPlayer ? "Player" : "Creature"}
              </p>
            </div>

            {/* HP Controls */}
            {currentCombatant.stats && !currentCombatant.isDead && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-4xl font-black text-[var(--primary)]">
                  {displayHp} / {currentCombatant.maxHp}
                </span>
                <div className="flex items-center w-fit">
                  <motion.button
                    onClick={() => {
                      const newHp = Math.max(0, currentHp - hpChange);
                      updateCreatureHp(currentCombatant.id, newHp);
                      setHpChange(0);
                    }}
                    className="px-3 py-1 text-[var(--primary)] text-2xl uppercase"
                  >
                    −
                  </motion.button>
                  <input
                    type="number"
                    value={hpChange === 0 ? "" : hpChange}
                    min={0}
                    placeholder="0"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setHpChange(isNaN(value) ? 0 : value);
                    }}
                    className="w-20 border-2 border-[var(--primary)] text-center text-sm font-bold uppercase outline-none px-3 py-1 appearance-none"
                  />
                  <motion.button
                    onClick={() => {
                      const newHp = Math.min(
                        currentCombatant.maxHp,
                        currentHp + hpChange
                      );
                      updateCreatureHp(currentCombatant.id, newHp);
                      setHpChange(0);
                    }}
                    className="px-3 py-1 text-[var(--primary)] text-2xl uppercase"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            )}

            {/* Stats */}
            {currentCombatant.stats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-x-10 text-[var(--secondary)] text-lg uppercase">
                  {Object.entries(currentCombatant.stats).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Creature Image and Initiative */}
          <div className="w-1/3">
            <div className="text-right">
              <p className="text-4xl font-bold text-yellow-200">
                {currentCombatant.initiative}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Initiative Order List */}
      <motion.div className="p-6">
        <div className="space-y-2">
          <h3 className="text-md text-[var(--secondary)] uppercase">
            Initiative Order
          </h3>

          {initiativeOrder.map((combatant, index) => {
            const isCurrent = index === currentTurnIndex;
            const displayHpForThisCombatant =
              combatant.currentHp ?? combatant.hp ?? combatant.maxHp;
            const healthPercent = combatant.maxHp
              ? (displayHpForThisCombatant / combatant.maxHp) * 100
              : 100;

            return (
              <motion.div
                key={combatant.id}
                className={`relative border-2 p-3 transition-all ${
                  isCurrent
                    ? "border-[var(--primary)] bg-[var(--primary)]"
                    : "border-[var(--secondary)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center  gap-2">
                          <div
                            className={`flex items-center justify-center text-1xl ${
                              isCurrent
                                ? "text-black text-3xl"
                                : "text-[#d9ca89] text-1xl"
                            }`}
                          >
                            {combatant.initiative}
                          </div>
                          <p
                            className={`font-bold uppercase tracking-wider ${
                              combatant.isDead
                                ? "text-red-500 line-through"
                                : isCurrent
                                ? "text-[var(--dark-muted-bg)] text-2xl"
                                : "text-[var(--secondary)] text-sm"
                            }`}
                          >
                            {combatant.name}
                          </p>
                          {combatant.isPlayer && (
                            <span className="text-xs bg-green-600/30 border border-green-500/50 text-green-400 px-2 py-0.5 uppercase tracking-wider">
                              Player
                            </span>
                          )}
                        </div>
                        {/* Creature Health Bar */}
                        {combatant.maxHp && (
                          <div className="w-30">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-[var(--secondary)] uppercase tracking-wider">
                                HP
                              </span>
                              <span className="text-xs font-bold text-[var(--secondary)]">
                                {displayHpForThisCombatant}/{combatant.maxHp}
                              </span>
                            </div>
                            <div className="h-2 bg-[var(--dark-muted-bg)] border-1 border-[var(--primary)] overflow-hidden">
                              <motion.div
                                className={`h-full  ${
                                  combatant.isDead
                                    ? "bg-gray-600"
                                    : healthPercent > 50
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
                        )}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
