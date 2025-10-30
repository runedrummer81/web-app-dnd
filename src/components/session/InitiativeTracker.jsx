import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCombatState } from "./CombatStateContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const InitiativeTracker = () => {
  const {
    initiativeOrder,
    setInitiativeOrder,
    currentTurnIndex,
    nextTurn,
    combatRound,
    updateCreatureHp,
  } = useCombatState();

  const storage = getStorage();

  const [creatureImages, setCreatureImages] = useState({});
  const [creatures, setCreatures] = useState([]);
  const [hpChange, setHpChange] = useState(0);

  // Fetch creature images and data from Firebase
  useEffect(() => {
    async function fetchCreatureData() {
      const snapshot = await getDocs(collection(db, "Creatures"));
      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const d = doc.data();
          let imageURL = "/placeholder.png";

          if (d.imageURL) {
            try {
              imageURL = await getDownloadURL(ref(storage, d.imageURL));
            } catch (err) {
              console.error("Failed to load image for", d.name, err);
            }
          }

          return {
            id: doc.id,
            name: d.name,
            maxHp: d.maxHp || 0,
            currentHp: d.currentHp ?? d.maxHp ?? 0,
            initiative: d.initiative || 0,
            stats: d.stats || {},
            isPlayer: d.isPlayer || false,
            imageURL,
          };
        })
      );

      setCreatures(data);

      if (setInitiativeOrder) {
        const sorted = [...data].sort((a, b) => b.initiative - a.initiative);
        setInitiativeOrder(sorted);
      }
    }

    fetchCreatureData();
  }, [setInitiativeOrder]);

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
  const currentHp =
    currentCombatant.currentHp ??
    currentCombatant.hp ??
    currentCombatant.maxHp ??
    0;
  const displayHp =
    currentCombatant.currentHp ?? currentCombatant.hp ?? currentCombatant.maxHp;

  return (
    <div className="px-2">
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
        className="relative border-2 border-[var(--primary)] bg-[var(--combat)] p-5"
      >
        <div className="flex flex-row">
          <div className="w-2/3 space-y-4">
            {/* Name and Type */}
            <div className="items-center">
              <h3 className="text-2xl font-bold text-[var(--primary)] uppercase tracking-wider">
                {currentCombatant.name}
              </h3>
              <p className="text-xs text-[var(--dark-muted-bg)] uppercase tracking-wider">
                {currentCombatant.isPlayer ? "Player" : "Creature"}
              </p>
            </div>

            {/* HP Controls */}
            {currentCombatant.stats && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-4xl font-black text-[var(--primary)]">
                  {displayHp} / {currentCombatant.maxHp}
                </span>

                <div className="flex items-centeroverflow-hidden w-fit">
                  <motion.button
                    onClick={() => {
                      updateCreatureHp(
                        currentCombatant.id,
                        currentHp - hpChange
                      );
                      setHpChange(0);
                    }}
                    className="px-3 py-1 text-[var(--primary)] uppercase"
                  >
                    -
                  </motion.button>

                  <input
                    type="number"
                    value={hpChange === 0 ? "" : hpChange} // show empty if 0 so typing replaces it
                    min={0}
                    placeholder="0"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setHpChange(isNaN(value) ? 0 : value);
                    }}
                    className="w-20 border-2 border-[var(--primary)]  text-center text-sm font-bold uppercase outline-none px-3 py-1
             appearance-none
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-moz-number-spin-button]:appearance-none"
                  />

                  <motion.button
                    onClick={() => {
                      updateCreatureHp(
                        currentCombatant.id,
                        currentHp + hpChange
                      );
                      setHpChange(0);
                    }}
                    className="px-3 py-1 text-white uppercase"
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
                <div className="grid grid-cols-3 gap-x-10 text-[var(--dark-muted-bg)] text-lg uppercase">
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

      <motion.div className="p-6">
        {/* Initiative Order List */}
        <div className="space-y-2">
          <h3 className="text-md text-[var(--secondary)] uppercase ">
            Initiative Order
          </h3>

          {initiativeOrder.map((combatant, index) => {
            const isCurrent = index === currentTurnIndex;

            // Compute each creature's HP
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
                {isCurrent && (
                  <>
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rotate-45" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={` flex items-center justify-center text-1xl${
                            isCurrent
                              ? " text-black text-3xl"
                              : " text-[#d9ca89] text-1xl"
                          }`}
                        >
                          {combatant.initiative}
                        </div>
                        <p
                          className={`font-bold uppercase tracking-wider ${
                            isCurrent
                              ? "text-[var(--dark-muted-bg)] text-2xl"
                              : "text-[var(--secondary)] text-sm"
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
                              {displayHpForThisCombatant}/{combatant.maxHp}
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
      </motion.div>
    </div>
  );
};
