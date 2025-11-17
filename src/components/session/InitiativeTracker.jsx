// InitiativeTracker.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCombatState } from "./CombatStateContext";
import { useMapSync } from "./MapSyncContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// ✅ Parse ALL damage instances from an attack description
const parseAttack = (description) => {
  const toHitMatch = description.match(/([+-]\d+)\s+to hit/);
  const toHit = toHitMatch ? parseInt(toHitMatch[1]) : 0;

  // Find ALL damage patterns: "7 (1d6 + 4) slashing damage plus 3 (1d6) cold damage"
  const damagePattern = /(\d+)\s*\(([^)]+)\)\s*(\w+)\s*damage/g;
  const damages = [];
  let match;

  while ((match = damagePattern.exec(description)) !== null) {
    damages.push({
      average: parseInt(match[1]),
      dice: match[2].trim(),
      type: match[3],
    });
  }

  return { toHit, damages };
};

// ✅ NEW: Parse saving throw info (DC and type)
const parseSavingThrow = (description) => {
  // Match patterns like "DC 13 Constitution" or "DC 15 Dexterity"
  const dcMatch = description.match(/DC\s+(\d+)\s+(\w+)\s+saving throw/i);
  if (dcMatch) {
    return {
      dc: parseInt(dcMatch[1]),
      type: dcMatch[2], // e.g., "Constitution", "Dexterity"
    };
  }
  return null;
};

// ✅ Check if action requires a saving throw (not an attack roll)
const isSavingThrowAction = (description) => {
  const hasSavingThrow = /saving throw|DC \d+/i.test(description);
  const hasAttackRoll = /to hit/i.test(description);
  return hasSavingThrow && !hasAttackRoll;
};

// ✅ Roll dice and return detailed results
const rollDice = (notation) => {
  if (!notation) return { total: 0, rolls: [], modifier: 0 };

  const match = notation.match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/);
  if (!match) {
    const flatNum = parseInt(notation);
    if (!isNaN(flatNum)) {
      return { total: flatNum, rolls: [], modifier: flatNum };
    }
    return { total: 0, rolls: [], modifier: 0 };
  }

  const numDice = parseInt(match[1]);
  const diceSize = parseInt(match[2]);
  const modifier = match[3] && match[4] ? parseInt(match[3] + match[4]) : 0;

  const rolls = [];
  let total = 0;

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * diceSize) + 1;
    rolls.push(roll);
    total += roll;
  }

  return {
    total: total + modifier,
    rolls,
    modifier,
    diceSize,
    numDice,
  };
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
  const [damageRolls, setDamageRolls] = useState(null);
  const [activeTab, setActiveTab] = useState("actions");
  const [selectedCreatureId, setSelectedCreatureId] = useState(null);
  const [expandedActionId, setExpandedActionId] = useState(null);
  const [expandedTraitId, setExpandedTraitId] = useState(null);
  const [savingThrowResult, setSavingThrowResult] = useState(null);

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

  useEffect(() => {
    const handleTokenClicked = (event) => {
      const clickedToken = event.detail.token;
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

  const getEnrichedCombatantData = (combatant) => {
    if (!combatant) return null;

    if (!combatant.isPlayer) {
      const creatureData = creatures.find((c) => {
        if (c.name === combatant.name) return true;
        if (combatant.name.startsWith(c.name)) return true;
        if (c.name.toLowerCase() === combatant.name.toLowerCase()) return true;
        return false;
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

  const currentCombatant = getEnrichedCombatantData(
    initiativeOrder[currentTurnIndex]
  );

  const selectedCombatant = selectedCreatureId
    ? getEnrichedCombatantData(
        initiativeOrder.find((c) => c.id === selectedCreatureId)
      )
    : null;

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

  // ✅ Handle attack roll (for normal attacks with "to hit")
  const handleAttackRoll = (action) => {
    const { toHit, damages } = parseAttack(action.description);
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const total = d20Roll + toHit;

    const rollResult = {
      name: action.name,
      d20: d20Roll,
      modifier: toHit,
      total,
      damages,
      isCrit: d20Roll === 20,
      isFail: d20Roll === 1,
      isSavingThrow: false,
    };

    setAttackRoll(rollResult);
    setDamageRolls(null);

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

  // ✅ NEW: Handle saving throw action (no attack roll, just damage + DC)
  const handleSavingThrowAction = (action) => {
    const { damages } = parseAttack(action.description);
    const savingThrowInfo = parseSavingThrow(action.description);

    const rollResult = {
      name: action.name,
      damages,
      isSavingThrow: true,
      savingThrowDC: savingThrowInfo?.dc || null,
      savingThrowType: savingThrowInfo?.type || "unknown",
    };

    setAttackRoll(rollResult);
    setDamageRolls(null);

    addToCombatLog({
      type: "saving-throw-action",
      attacker: displayedCombatant.name,
      actionName: action.name,
      dc: savingThrowInfo?.dc,
      saveType: savingThrowInfo?.type,
    });
  };

  // ✅ Handle damage roll
  const handleDamageRoll = () => {
    if (!attackRoll || !attackRoll.damages || attackRoll.damages.length === 0)
      return;

    const rolledDamages = attackRoll.damages.map((dmg) => {
      const rollResult = rollDice(dmg.dice);

      let finalTotal = rollResult.total;
      let critRolls = [];

      // Only double on crit if it's an attack (not a saving throw)
      if (attackRoll.isCrit && !attackRoll.isSavingThrow) {
        const critResult = rollDice(dmg.dice);
        critRolls = critResult.rolls;
        finalTotal = rollResult.total + critResult.total;
      }

      return {
        type: dmg.type,
        ...rollResult,
        critRolls,
        isCrit: attackRoll.isCrit && !attackRoll.isSavingThrow,
        finalTotal,
      };
    });

    setDamageRolls(rolledDamages);

    const totalDamage = rolledDamages.reduce((sum, d) => sum + d.finalTotal, 0);

    addToCombatLog({
      type: "damage-roll",
      attacker: displayedCombatant.name,
      attackName: attackRoll.name,
      damage: totalDamage,
      damageBreakdown: rolledDamages.map((d) => ({
        amount: d.finalTotal,
        type: d.type,
      })),
      isCrit: attackRoll.isCrit && !attackRoll.isSavingThrow,
    });
  };

  // ✅ Handle stat-based saving throw
  const handleSavingThrow = (stat) => {
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const modifier = displayedCombatant.modifiers?.[`${stat}_save`] || 0;
    const total = d20Roll + modifier;

    const result = {
      stat: stat.toUpperCase(),
      d20: d20Roll,
      modifier,
      total,
      isCrit: d20Roll === 20,
      isFail: d20Roll === 1,
    };

    setSavingThrowResult(result);

    addToCombatLog({
      type: "saving-throw",
      creature: displayedCombatant.name,
      stat: stat.toUpperCase(),
      d20: d20Roll,
      modifier,
      total,
      isCrit: d20Roll === 20,
      isFail: d20Roll === 1,
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
            setDamageRolls(null);
            setHpChange(0);
            setSelectedCreatureId(null);
            setExpandedActionId(null);
            setExpandedTraitId(null);
            setSavingThrowResult(null);
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
          style={{ minHeight: "600px" }}
        >
          {/* Background Image - Fixed */}
          {displayedCombatant.imageURL &&
            displayedCombatant.imageURL !== "/placeholder.png" && (
              <>
                <div
                  className="absolute top-0 right-0 w-80 bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url('${displayedCombatant.imageURL}')`,
                    backgroundPosition: "center center",
                    opacity: displayedCombatant.isDead ? 0.05 : 0.6,
                    height: "100%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/100 to-transparent pointer-events-none" />
              </>
            )}

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
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
                  <div>
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

                    {/* HP Adjustment */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => {
                          const currentHp =
                            getCurrentHpForCombatant(displayedCombatant);
                          const newHp = Math.max(0, currentHp - hpChange);
                          updateCreatureHp(displayedCombatant.id, newHp);
                          setHpChange(0);
                        }}
                        className="flex-1 py-2 text-[var(--combat)] font-black text-xs uppercase"
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
                        className="flex-1 py-2 text-green-600 font-black text-xs uppercase"
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
                      {/* Stats with Clickable Saving Throws */}
                      {activeTab === "stats" && displayedCombatant.stats && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-3">
                            {["str", "dex", "con", "int", "wis", "cha"].map(
                              (stat) => (
                                <motion.button
                                  key={stat}
                                  onClick={() => handleSavingThrow(stat)}
                                  className="text-center border border-[var(--secondary)]/30 p-2 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
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
                                </motion.button>
                              )
                            )}
                          </div>

                          {/* Saving Throw Result */}
                          <AnimatePresence>
                            {savingThrowResult && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-3 border-2 ${
                                  savingThrowResult.isCrit
                                    ? "border-yellow-400 bg-yellow-900/40"
                                    : savingThrowResult.isFail
                                    ? "border-red-500 bg-red-900/40"
                                    : "border-[var(--primary)] bg-[var(--primary)]/10"
                                }`}
                              >
                                <p className="text-xs text-[var(--secondary)] uppercase mb-1">
                                  {savingThrowResult.stat} Saving Throw
                                </p>
                                <p
                                  className={`text-3xl font-bold ${
                                    savingThrowResult.isCrit
                                      ? "text-yellow-400"
                                      : savingThrowResult.isFail
                                      ? "text-red-400"
                                      : "text-[var(--primary)]"
                                  }`}
                                >
                                  {savingThrowResult.total}
                                  {savingThrowResult.isCrit && " ✓"}
                                  {savingThrowResult.isFail && " ✗"}
                                </p>
                                <p className="text-xs text-[var(--secondary)] mt-1">
                                  (d20: {savingThrowResult.d20}{" "}
                                  {savingThrowResult.modifier >= 0 ? "+" : ""}
                                  {savingThrowResult.modifier})
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Collapsible Traits */}
                      {activeTab === "traits" && displayedCombatant.traits && (
                        <div className="space-y-2">
                          {displayedCombatant.traits.map((trait, idx) => (
                            <motion.div
                              key={idx}
                              className="border border-[var(--secondary)]/30 hover:border-[var(--primary)] transition"
                            >
                              <button
                                onClick={() =>
                                  setExpandedTraitId(
                                    expandedTraitId === idx ? null : idx
                                  )
                                }
                                className="w-full p-2 text-left flex justify-between items-center"
                              >
                                <p className="text-sm font-bold text-[var(--primary)] uppercase">
                                  {trait.name}
                                </p>
                                <span className="text-[var(--secondary)]">
                                  {expandedTraitId === idx ? "▲" : "▼"}
                                </span>
                              </button>
                              <AnimatePresence>
                                {expandedTraitId === idx && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-2 pb-2"
                                  >
                                    <p className="text-xs text-[var(--secondary)]">
                                      {trait.description}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roll Results */}
                  <AnimatePresence>
                    {(attackRoll || damageRolls) &&
                      !selectedCreatureId &&
                      !displayedCombatant.isDead && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-2"
                        >
                          {/* ✅ Attack Roll (for normal attacks) */}
                          {attackRoll && !attackRoll.isSavingThrow && (
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
                                  attackRoll.damages?.length > 0 && (
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

                          {/* ✅ NEW: Saving Throw Action Display */}
                          {attackRoll && attackRoll.isSavingThrow && (
                            <div className="p-3 border-2 border-blue-500 bg-blue-900/40">
                              <p className="text-xs text-blue-300 uppercase mb-2">
                                {attackRoll.name}
                              </p>
                              <div className="mb-3">
                                <p className="text-sm text-blue-200 font-bold mb-1">
                                  🎲 Player Must Roll Saving Throw
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-3xl font-bold text-blue-300">
                                    DC {attackRoll.savingThrowDC}
                                  </p>
                                  <p className="text-lg text-blue-200 uppercase">
                                    {attackRoll.savingThrowType}
                                  </p>
                                </div>
                              </div>
                              {attackRoll.damages?.length > 0 && (
                                <motion.button
                                  onClick={handleDamageRoll}
                                  className="w-full px-3 py-2 bg-orange-700 hover:bg-orange-600 text-white font-bold text-sm uppercase border border-orange-500"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Roll Damage
                                </motion.button>
                              )}
                            </div>
                          )}

                          {/* Consolidated Damage Display */}
                          {damageRolls && (
                            <div className="p-4 border-2 border-orange-500 bg-orange-900/40">
                              {/* Total Damage - Prominent */}
                              <div className="mb-3 pb-3 border-b-2 border-yellow-400">
                                <p className="text-xs text-yellow-300 uppercase mb-1">
                                  Total Damage
                                  {attackRoll?.isSavingThrow && (
                                    <span className="ml-2 text-blue-300">
                                      (On Failed Save)
                                    </span>
                                  )}
                                </p>
                                <p className="text-6xl font-bold text-yellow-400">
                                  {damageRolls.reduce(
                                    (sum, d) => sum + d.finalTotal,
                                    0
                                  )}
                                  {damageRolls[0]?.isCrit && " 💥"}
                                </p>
                              </div>

                              {/* Damage Breakdown */}
                              <div className="space-y-2">
                                {damageRolls.map((dmg, idx) => (
                                  <div key={idx}>
                                    <p className="text-sm text-orange-300 capitalize font-bold">
                                      {dmg.type}: {dmg.finalTotal}
                                    </p>
                                    <p className="text-xs text-orange-200/60">
                                      (
                                      {dmg.rolls.length > 0 && (
                                        <>
                                          {dmg.numDice}d{dmg.diceSize}:{" "}
                                          {dmg.rolls.join(" + ")}
                                        </>
                                      )}
                                      {dmg.modifier !== 0 && (
                                        <>
                                          {" "}
                                          {dmg.modifier > 0 ? "+" : ""}
                                          {dmg.modifier}
                                        </>
                                      )}
                                      {dmg.isCrit &&
                                        dmg.critRolls.length > 0 && (
                                          <>
                                            {" + "}
                                            {dmg.numDice}d{dmg.diceSize}:{" "}
                                            {dmg.critRolls.join(" + ")}
                                          </>
                                        )}
                                      )
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>

                {/* RIGHT COLUMN - Actions */}
                <div>
                  <h4 className="text-[var(--secondary)] uppercase text-xs pb-2">
                    Actions
                  </h4>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {displayedCombatant.actions &&
                    displayedCombatant.actions.length > 0 ? (
                      displayedCombatant.actions.map((action, idx) => {
                        const { toHit, damages } = parseAttack(
                          action.description
                        );
                        const isAttack = toHit !== 0 || damages.length > 0;
                        const isSavingThrow = isSavingThrowAction(
                          action.description
                        );
                        const isExpanded = expandedActionId === idx;

                        return (
                          <div
                            key={idx}
                            className="border border-[var(--secondary)]/30 hover:border-[var(--primary)] transition"
                          >
                            {/* Action Header */}
                            <div className="flex items-start justify-between gap-2 p-2">
                              <button
                                onClick={() =>
                                  setExpandedActionId(isExpanded ? null : idx)
                                }
                                className="flex-1 text-left"
                              >
                                <p className="text-[var(--primary)] font-black uppercase text-base flex items-center gap-2">
                                  {action.name}
                                  {isSavingThrow && (
                                    <span className="text-xs bg-blue-600/30 border border-blue-500 text-blue-300 px-2 py-0.5 uppercase">
                                      Save
                                    </span>
                                  )}
                                  <span className="text-xs text-[var(--secondary)]">
                                    {isExpanded ? "▲" : "▼"}
                                  </span>
                                </p>
                              </button>
                              {/* ✅ Button for all actions that can deal damage */}
                              {isAttack &&
                                !selectedCreatureId &&
                                !displayedCombatant.isDead && (
                                  <motion.button
                                    onClick={() =>
                                      isSavingThrow
                                        ? handleSavingThrowAction(action)
                                        : handleAttackRoll(action)
                                    }
                                    className="px-3 py-1 bg-[var(--combat)] text-white text-xs font-bold uppercase"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {isSavingThrow ? "Use" : "Attack"}
                                  </motion.button>
                                )}
                            </div>

                            {/* Collapsible Description */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-2 pb-2"
                                >
                                  <p className="text-[var(--secondary)] text-xs leading-relaxed">
                                    {action.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
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

      {/* Initiative Order List - keeping your existing code */}
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
