import { createContext, useContext, useState } from "react";
import { useMapSync } from "./MapSyncContext";

const CombatStateContext = createContext();

export const useCombatState = () => {
  const context = useContext(CombatStateContext);
  if (!context) {
    throw new Error("useCombatState must be used within CombatStateProvider");
  }
  return context;
};

export const CombatStateProvider = ({ children }) => {
  const { updateMapState } = useMapSync();

  const [combatActive, setCombatActive] = useState(false);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [combatRound, setCombatRound] = useState(1);
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [gridSettings, setGridSettings] = useState({
    visible: false,
    color: "#d9ca89",
    opacity: 0.3,
    size: 40,
  });

  const startCombat = (encounter, playerData, selectedCombatMap) => {
    updateMapState({
      currentMapId: selectedCombatMap.id,
      markers: [],
    });

    const combatants = [];

    // Add players
    playerData.forEach((player, index) => {
      combatants.push({
        id: `player-${index}`,
        name: player.name,
        initiative: player.initiative,
        isPlayer: true,
        hp: 100,
        maxHp: 100,
      });
    });

    // Add creatures with rolled initiatives
    encounter.creatures.forEach((creature, index) => {
      const initiativeRoll = Math.floor(Math.random() * 20) + 1;
      const initiative = initiativeRoll + (creature.dexModifier || 0);

      combatants.push({
        id: `creature-${index}`,
        name: `${creature.name} ${index + 1}`,
        initiative,
        isPlayer: false,
        hp: creature.hp,
        maxHp: creature.hp,
        ac: creature.ac,
        stats: creature.stats,
      });
    });

    combatants.sort((a, b) => b.initiative - a.initiative);

    setInitiativeOrder(combatants);
    setCurrentTurnIndex(0);
    setCombatActive(true);
    setActiveEncounter(encounter);
  };

  const endCombat = () => {
    setCombatActive(false);
    setInitiativeOrder([]);
    setCurrentTurnIndex(0);
    setActiveEncounter(null);
    setGridSettings({ ...gridSettings, visible: false });
    setCombatLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "combat-end",
        message: "Combat ended",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const addToCombatLog = (entry) => {
    setCombatLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        round: combatRound,
        ...entry,
      },
    ]);
  };

  const nextTurn = () => {
    const nextIndex = (currentTurnIndex + 1) % initiativeOrder.length;
    if (nextIndex === 0) {
      setCombatRound((prev) => prev + 1);
      addToCombatLog({
        type: "round-end",
        message: `Round ${combatRound} ended. Starting Round ${
          combatRound + 1
        }`,
      });
    }
    setCurrentTurnIndex(nextIndex);
  };

  const updateCreatureHp = (id, newHp) => {
    setInitiativeOrder((prev) => {
      // Clamp HP so it never goes below 0 or above maxHp
      const updated = prev.map((c) =>
        c.id === id
          ? { ...c, currentHp: Math.max(0, Math.min(newHp, c.maxHp)) }
          : c
      );

      // Remove any non-player combatant whose HP is now 0
      const filtered = updated.filter((c) => c.isPlayer || c.currentHp > 0);

      // If we removed something before the current index, adjust the turn index
      let adjustedIndex = currentTurnIndex;
      if (
        filtered.length < updated.length &&
        currentTurnIndex >= filtered.length
      ) {
        adjustedIndex = 0;
      }

      // Update both initiative order and turn index
      setCurrentTurnIndex(adjustedIndex);
      return filtered;
    });
  };

  const rollAttack = (attacker, attack, target) => {
    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const totalAttack = attackRoll + (attack.toHit || 0);
    const targetAC = target.ac ?? target.stats?.ac ?? 0;
    const hit = totalAttack >= targetAC;

    addToCombatLog({
      type: "attack",
      attacker: attacker.name,
      target: target.name,
      attackName: attack.name,
      roll: attackRoll,
      total: totalAttack,
      hit,
    });

    if (hit) {
      const damageRoll = Math.floor(Math.random() * attack.damageDice) + 1;
      const totalDamage = damageRoll + (attack.damageBonus || 0);

      updateCreatureHp(target.id, target.hp - totalDamage);

      addToCombatLog({
        type: "damage",
        attacker: attacker.name,
        target: target.name,
        damage: totalDamage,
      });

      return { hit: true, attackRoll: totalAttack, damage: totalDamage };
    }

    return { hit: false, attackRoll: totalAttack };
  };

  return (
    <CombatStateContext.Provider
      value={{
        combatActive,
        initiativeOrder,
        currentTurnIndex,
        combatLog,
        combatRound,
        activeEncounter,
        gridSettings,
        startCombat,
        endCombat,
        nextTurn,
        updateCreatureHp,
        addToCombatLog,
        rollAttack,
        setGridSettings,
      }}
    >
      {children}
    </CombatStateContext.Provider>
  );
};
