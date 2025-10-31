// InitiativeTracker.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCombatState } from "./CombatStateContext";
import { useMapSync } from "./MapSyncContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// Parse attack description to extract to-hit and damage info
const parseAttack = (description) => {
  const toHitMatch = description.match(/([+-]\d+)\s+to hit/);
  const toHit = toHitMatch ? parseInt(toHitMatch[1]) : 0;

  const damageMatch = description.match(/Hit:\s*\d+\s*\(([^)]+)\)\s*(\w+)/);
  const damageDice = damageMatch ? damageMatch[1] : null;
  const damageType = damageMatch ? damageMatch[2] : "damage";

  return { toHit, damageDice, damageType };
};

// Roll dice based on notation like "1d10 + 4"
const rollDice = (notation) => {
  if (!notation) return 0;

  const match = notation.match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/);
  if (!match) return 0;

  const numDice = parseInt(match[1]);
  const diceSize = parseInt(match[2]);
  const modifier = match[3] && match[4] ? parseInt(match[3] + match[4]) : 0;

  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSize) + 1;
  }

  return total + modifier;
};

export const InitiativeTracker = () => {
  const {
    initiativeOrder,
    currentTurnIndex,
    nextTurn,
    combatRound,
    updateCreatureHp,
    addToCombatLog,
  } = useCombatState();

  const { mapState } = useMapSync();

  const [creatures, setCreatures] = useState([]);
  const [hpChange, setHpChange] = useState(0);
  const [attackRoll, setAttackRoll] = useState(null);
  const [damageRoll, setDamageRoll] = useState(null);
  const [activeTab, setActiveTab] = useState("actions");
  const [selectedCreatureId, setSelectedCreatureId] = useState(null); // NEW: Track which creature is selected

  useEffect(() => {
    const fetchCreatures = async () => {
      const snapshot = await getDocs(collection(db, "Creatures"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCreatures(data);
    };
    fetchCreatures();
  }, []);

  // NEW: Listen for token clicks to select creatures
  useEffect(() => {
    const handleTokenClicked = (event) => {
      const clickedToken = event.detail.token;
      // Find the combatant by name
      const combatant = initiativeOrder.find(
        (c) => c.name === clickedToken.name
      );
      if (combatant && !combatant.isPlayer) {
        setSelectedCreatureId(combatant.id);
      }
    };

    window.addEventListener("tokenClicked", handleTokenClicked);
    return () => window.removeEventListener("tokenClicked", handleTokenClicked);
  }, [initiativeOrder]);

  // Get enriched data for any combatant
  const getEnrichedCombatantData = (combatant) => {
    if (!combatant) return null;

    if (!combatant.isPlayer) {
      const creatureData = creatures.find((c) => {
        return combatant.name.startsWith(c.name);
      });

      return {
        ...combatant,
        ...creatureData,

        id: combatant.id,
        currentHp: combatant.currentHp,
        isDead: combatant.isDead,
        initiative: combatant.initiative,
        name: combatant.name,
      };
    }

    return combatant;
  };

  // Get current turn combatant
  const currentCombatant = getEnrichedCombatantData(
    initiativeOrder[currentTurnIndex]
  );

  // Get selected creature (if any)
  const selectedCombatant = selectedCreatureId
    ? getEnrichedCombatantData(
        initiativeOrder.find((c) => c.id === selectedCreatureId)
      )
    : null;

  // The creature to display in the detail view
  const displayedCombatant = selectedCombatant || currentCombatant;

  if (!currentCombatant || initiativeOrder.length === 0) {
    return (
      <div className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider">
        No combatants in initiative order
      </div>
    );
  }

  const getCurrentHpForCombatant = (combatant) => {
    if (!combatant) return 0;
    return combatant.currentHp ?? combatant.hp ?? combatant.maxHp ?? 0;
  };

  const getDisplayHpForCombatant = (combatant) => {
    if (!combatant) return 0;
    return combatant.currentHp ?? combatant.hp ?? combatant.maxHp;
  };

  const handleAttackRoll = (action) => {
    const { toHit, damageDice, damageType } = parseAttack(action.description);
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const total = d20Roll + toHit;

    const rollResult = {
      name: action.name,
      d20: d20Roll,
      modifier: toHit,
      total,
      damageDice,
      damageType,
      isCrit: d20Roll === 20,
      isFail: d20Roll === 1,
    };

    setAttackRoll(rollResult);
    setDamageRoll(null);

    // NEW: Log the attack roll
    addToCombatLog({
      type: "attack-roll",
      attacker: displayedCombatant.name,
      attackName: action.name,
      d20: d20Roll,
      modifier: toHit,
      total: total,
      isCrit: d20Roll === 20,
      isFail: d20Roll === 1,
    });
  };

  const handleDamageRoll = () => {
    if (!attackRoll || !attackRoll.damageDice) return;

    let damage = rollDice(attackRoll.damageDice);

    if (attackRoll.isCrit) {
      damage = damage * 2;
    }

    const damageResult = {
      damage,
      type: attackRoll.damageType,
      isCrit: attackRoll.isCrit,
    };

    setDamageRoll(damageResult);

    // NEW: Log the damage roll
    addToCombatLog({
      type: "damage-roll",
      attacker: displayedCombatant.name,
      attackName: attackRoll.name,
      damage: damage,
      damageType: attackRoll.damageType,
      isCrit: attackRoll.isCrit,
    });
  };

  return (
    <div className="px-2">
      {/* Combat Round Display */}
      <motion.div className="relative flex flex-row justify-between items-center py-3 px-6">
        <h2 className="text-xl text-[var(--secondary)] uppercase">
          Round {combatRound}
        </h2>
        <motion.button
          onClick={() => {
            nextTurn();
            setAttackRoll(null);
            setDamageRoll(null);
            setHpChange(0);
            setSelectedCreatureId(null); // Clear selection on next turn
          }}
          className="text-[var(--primary)] font-black uppercase text-2xl hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next Turn →
        </motion.button>
      </motion.div>

      {/* Current/Selected Creature Display */}
      {displayedCombatant && (
        <motion.div
          key={displayedCombatant.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative border-2 overflow-hidden ${
            displayedCombatant.isDead
              ? "border-gray-600 opacity-60"
              : "border-[var(--primary)]"
          }`}
        >
          {/* Background Image */}
          {displayedCombatant.imageURL &&
            displayedCombatant.imageURL !== "/placeholder.png" && (
              <>
                <div
                  className="absolute top-0 right-0 h-full w-80 bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url('${displayedCombatant.imageURL}')`,
                    backgroundPosition: "center center",
                    opacity: displayedCombatant.isDead ? 0.05 : 0.6,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/100 to-transparent pointer-events-none" />
              </>
            )}

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center p-4 ">
              <div>
                <div className="flex items-center gap-3">
                  <h3
                    className={`text-2xl font-bold uppercase tracking-wider ${
                      displayedCombatant.isDead
                        ? "text-gray-500"
                        : "text-[var(--primary)]"
                    }`}
                  >
                    {displayedCombatant.name}
                  </h3>
                  {displayedCombatant.isDead && (
                    <span className="text-red-500 text-2xl">💀</span>
                  )}
                  {selectedCreatureId && (
                    <span className="text-xs bg-purple-600/30 border border-purple-500 text-purple-300 px-2 py-1 uppercase">
                      Viewing
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--secondary)]">
                  {displayedCombatant.isPlayer
                    ? "Player Character"
                    : displayedCombatant.type || "Creature"}
                  {displayedCombatant.isDead && " (Dead)"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--secondary)] uppercase">
                  Initiative
                </p>
                <p className="text-3xl font-bold text-yellow-200">
                  {displayedCombatant.initiative}
                </p>
              </div>
            </div>

            {/* PLAYER TURN MESSAGE */}
            {displayedCombatant.isPlayer && !selectedCreatureId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-900/40 border-b-2 border-blue-400 p-6"
              >
                <div className="flex items-center gap-3">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-300 font-bold text-xl uppercase tracking-wider">
                      Player's Turn
                    </p>
                    <p className="text-blue-200/80 text-base">
                      Waiting for player to complete their turn...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CREATURE CONTROLS */}
            {!displayedCombatant.isPlayer && (
              <div className="grid grid-cols-2 gap-6 p-4">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  {/* HP & Quick Stats */}
                  <div className="">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                          AC
                        </p>
                        <p className="text-3xl font-bold text-[var(--primary)]">
                          {displayedCombatant.ac}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                          HP
                        </p>
                        <p
                          className={`text-3xl font-bold ${
                            displayedCombatant.isDead
                              ? "text-red-500"
                              : "text-[var(--primary)]"
                          }`}
                        >
                          {getDisplayHpForCombatant(displayedCombatant)}/
                          {displayedCombatant.maxHp}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                          Speed
                        </p>
                        <p className="text-lg font-bold text-[var(--primary)]">
                          {displayedCombatant.speed}
                        </p>
                      </div>
                    </div>

                    {/* HP Adjustment - Available anytime for creatures */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => {
                          const currentHp =
                            getCurrentHpForCombatant(displayedCombatant);
                          const newHp = Math.max(0, currentHp - hpChange);
                          updateCreatureHp(displayedCombatant.id, newHp);
                          setHpChange(0);
                        }}
                        className="flex-1 py-2 text-[var(--combat)]  font-black text-xs uppercase "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Damage
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
                        className="no-arrows w-16 border-2 border-[var(--primary)] bg-black/50 text-[var(--primary)] text-center text-base font-bold outline-none py-2"
                      />

                      <motion.button
                        onClick={() => {
                          const currentHp =
                            getCurrentHpForCombatant(displayedCombatant);
                          const newHp = Math.min(
                            displayedCombatant.maxHp,
                            currentHp + hpChange
                          );
                          updateCreatureHp(displayedCombatant.id, newHp);
                          setHpChange(0);
                        }}
                        className="flex-1 py-2 text-green-600 font-black text-xs uppercase "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Heal
                      </motion.button>
                    </div>
                  </div>

                  {/* Stats/Traits Tabs */}
                  <div className="bg-black/40">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          setActiveTab(activeTab === "stats" ? null : "stats")
                        }
                        className={`flex-1 py-2 text-sm border-1 font-bold uppercase border-[var(--secondary)] ${
                          activeTab === "stats"
                            ? "bg-[var(--primary)] text-[var(--dark-muted-bg)] border-[var(--primary)]"
                            : "text-[var(--secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
                        }`}
                      >
                        Stats
                      </button>

                      {displayedCombatant.traits?.length > 0 && (
                        <button
                          onClick={() =>
                            setActiveTab(
                              activeTab === "traits" ? null : "traits"
                            )
                          }
                          className={`flex-1 py-2 text-sm border-1 font-bold uppercase border-[var(--secondary)] ${
                            activeTab === "traits"
                              ? "bg-[var(--primary)] text-[var(--dark-muted-bg)] border-[var(--primary)]"
                              : "text-[var(--secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
                          }`}
                        >
                          Traits
                        </button>
                      )}
                    </div>

                    <div className="p-3 max-h-60 overflow-y-auto">
                      {activeTab === "stats" && displayedCombatant.stats && (
                        <div className="grid grid-cols-3 gap-3">
                          {["str", "dex", "con", "int", "wis", "cha"].map(
                            (stat) => (
                              <div key={stat} className="text-center">
                                <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                                  {stat}
                                </p>
                                <p className="text-xl font-bold text-[var(--primary)]">
                                  {displayedCombatant.stats[stat]}
                                </p>
                                <p className="text-sm text-[var(--secondary)]">
                                  (
                                  {displayedCombatant.modifiers?.[
                                    `${stat}_mod`
                                  ] >= 0
                                    ? "+"
                                    : ""}
                                  {
                                    displayedCombatant.modifiers?.[
                                      `${stat}_mod`
                                    ]
                                  }
                                  )
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {activeTab === "traits" && displayedCombatant.traits && (
                        <div className="grid grid-cols-3 gap-3">
                          {displayedCombatant.traits.map((trait, idx) => (
                            <div key={idx} className="text-center">
                              <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                                {trait.name}
                              </p>
                              <p className="text-sm font-bold text-[var(--primary)]">
                                {trait.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roll Results */}
                  <AnimatePresence>
                    {(attackRoll || damageRoll) &&
                      !selectedCreatureId &&
                      !displayedCombatant.isDead && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-2"
                        >
                          {attackRoll && (
                            <div
                              className={`p-3 border-2 ${
                                attackRoll.isCrit
                                  ? "border-yellow-400 bg-yellow-900/40"
                                  : attackRoll.isFail
                                  ? "border-red-500 bg-red-900/40"
                                  : "border-[var(--primary)] bg-[var(--primary)]/10"
                              }`}
                            >
                              <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                                {attackRoll.name} - To Hit
                              </p>
                              <div className="flex items-center justify-between">
                                <p
                                  className={`text-4xl font-bold ${
                                    attackRoll.isCrit
                                      ? "text-yellow-400"
                                      : attackRoll.isFail
                                      ? "text-red-400"
                                      : "text-[var(--primary)]"
                                  }`}
                                >
                                  {attackRoll.total}
                                  {attackRoll.isCrit && " 🎯"}
                                  {attackRoll.isFail && " ✗"}
                                </p>
                                {!attackRoll.isFail &&
                                  attackRoll.damageDice && (
                                    <motion.button
                                      onClick={handleDamageRoll}
                                      className="px-3 py-2 bg-orange-700 hover:bg-orange-600 text-white font-bold text-sm uppercase border border-orange-500"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Roll Damage
                                    </motion.button>
                                  )}
                              </div>
                              <p className="text-xs text-[var(--secondary)] mt-1">
                                (d20: {attackRoll.d20} + {attackRoll.modifier})
                              </p>
                            </div>
                          )}

                          {damageRoll && (
                            <div className="p-3 border-2 border-orange-500 bg-orange-900/40">
                              <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                                Damage
                              </p>
                              <p className="text-5xl font-bold text-orange-400">
                                {damageRoll.damage}
                                {damageRoll.isCrit && " 💥"}
                              </p>
                              <p className="text-sm text-orange-300 capitalize mt-1">
                                {damageRoll.type}{" "}
                                {damageRoll.isCrit && "(Critical!)"}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>

                {/* RIGHT COLUMN - Actions */}
                <div className="">
                  <h4 className="text-[var(--secondary)] uppercase text-xs pb-2">
                    Actions
                  </h4>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {displayedCombatant.actions &&
                    displayedCombatant.actions.length > 0 ? (
                      displayedCombatant.actions.map((action, idx) => {
                        const { toHit, damageDice } = parseAttack(
                          action.description
                        );
                        const isAttack = toHit !== 0 || damageDice;

                        return (
                          <div key={idx} className="  transition">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-[var(--primary)] font-black uppercase text-base flex-1">
                                {action.name}
                              </p>
                              {isAttack &&
                                !selectedCreatureId &&
                                !displayedCombatant.isDead && (
                                  <motion.button
                                    onClick={() => handleAttackRoll(action)}
                                    className="px-3 py-1 bg-[var(--combat)] text-white text-xs font-bold uppercase "
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Attack
                                  </motion.button>
                                )}
                            </div>
                            <p className="text-[var(--secondary)] text-sm leading-relaxed">
                              {action.description}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[var(--secondary)] text-sm italic">
                        No actions available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Close Selection Button */}
            {selectedCreatureId && (
              <div className="p-4 border-t border-[var(--primary)]/30">
                <motion.button
                  onClick={() => setSelectedCreatureId(null)}
                  className="w-full p-3 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Current Turn
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Initiative Order List */}
      <motion.div className="px-6 py-4">
        <h3 className="text-base text-[var(--primary)] uppercase mb-3 font-bold">
          Initiative Order
        </h3>
        <div className="space-y-1">
          {initiativeOrder.map((combatant, index) => {
            const isCurrent = index === currentTurnIndex;
            const isSelected = combatant.id === selectedCreatureId;
            const displayHpForThisCombatant =
              combatant.currentHp ?? combatant.hp ?? combatant.maxHp;
            const healthPercent = combatant.maxHp
              ? (displayHpForThisCombatant / combatant.maxHp) * 100
              : 100;

            return (
              <motion.div
                key={combatant.id}
                onClick={() => {
                  if (!combatant.isPlayer) {
                    setSelectedCreatureId(combatant.id);
                  }
                }}
                className={`flex items-center justify-between p-2 border transition-all ${
                  combatant.isDead
                    ? "border-gray-700 bg-gray-900/40 opacity-60"
                    : isSelected
                    ? "border-purple-500 bg-purple-900/30 cursor-pointer"
                    : isCurrent
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 cursor-pointer"
                    : combatant.isPlayer
                    ? "border-[var(--secondary)]/20 bg-black/20"
                    : "border-[var(--secondary)]/20 bg-black/20 cursor-pointer hover:border-[var(--primary)]/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {combatant.isDead && (
                    <span className="text-red-500 text-xl">💀</span>
                  )}
                  <div
                    className={`text-lg font-bold w-8 text-center ${
                      combatant.isDead
                        ? "text-gray-600"
                        : isCurrent
                        ? "text-[var(--primary)] text-2xl"
                        : "text-[var(--secondary)]"
                    }`}
                  >
                    {combatant.initiative}
                  </div>
                  <p
                    className={`font-bold uppercase text-sm ${
                      combatant.isDead
                        ? "text-gray-600 line-through"
                        : isCurrent
                        ? "text-[var(--primary)] text-base"
                        : "text-[var(--secondary)]"
                    }`}
                  >
                    {combatant.name}
                  </p>
                  {combatant.isPlayer && (
                    <span className="text-xs bg-green-600/30 border border-green-500/50 text-green-400 px-2 py-0.5 uppercase">
                      PC
                    </span>
                  )}
                  {isSelected && !combatant.isDead && (
                    <span className="text-xs bg-purple-600/30 border border-purple-500 text-purple-300 px-2 py-0.5 uppercase">
                      Viewing
                    </span>
                  )}
                </div>

                {/* HP Bar */}
                {combatant.maxHp && (
                  <div className="w-24">
                    <div className="flex justify-between mb-1">
                      <span
                        className={`text-xs font-bold ${
                          combatant.isDead
                            ? "text-gray-600"
                            : "text-[var(--secondary)]"
                        }`}
                      >
                        {displayHpForThisCombatant}/{combatant.maxHp}
                      </span>
                    </div>
                    <div className="h-2 bg-black border border-[var(--primary)]/30 overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          combatant.isDead
                            ? "bg-gray-600"
                            : healthPercent > 50
                            ? "bg-green-600"
                            : healthPercent > 25
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        initial={{ width: "100%" }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
