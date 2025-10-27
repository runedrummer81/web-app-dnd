import { createContext, useContext, useState } from "react";

const CombatStateContext = createContext();

export const useCombatState = () => {
  const context = useContext(CombatStateContext);
  if (!context) {
    throw new Error("useCombatState must be used within CombatStateProvider");
  }
  return context;
};

export const CombatStateProvider = ({ children }) => {
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
    size: 40, // pixels per grid square
  });

  const startCombat = (encounter, playerInitiatives) => {
    // Combine players and creatures
    const combatants = [
      ...playerInitiatives.map((init, index) => ({
        id: `player-${index}`,
        name: `Player ${index + 1}`,
        initiative: init,
        type: "player",
        isPlayer: true,
      })),
      ...encounter.creatures.map((creature, index) => ({
        id: `creature-${index}`,
        name: creature.name,
        initiative:
          Math.floor(Math.random() * 20) + 1 + (creature.dexModifier || 0),
        type: "creature",
        isPlayer: false,
        stats: creature,
        currentHp: creature.hp,
        maxHp: creature.hp,
      })),
    ];

    // Sort by initiative (highest first)
    combatants.sort((a, b) => b.initiative - a.initiative);

    setInitiativeOrder(combatants);
    setCurrentTurnIndex(0);
    setActiveEncounter(encounter);
    setCombatActive(true);
    setGridSettings({ ...gridSettings, visible: true });
    setCombatLog([
      {
        id: Date.now(),
        type: "combat-start",
        message: `Combat started: ${encounter.name}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const endCombat = () => {
    setCombatActive(false);
    setInitiativeOrder([]);
    setCurrentTurnIndex(0);
    setActiveEncounter(null);
    setGridSettings({ ...gridSettings, visible: false });
    setCombatLog([
      ...combatLog,
      {
        id: Date.now(),
        type: "combat-end",
        message: "Combat ended",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const nextTurn = () => {
    const nextIndex = (currentTurnIndex + 1) % initiativeOrder.length;
    if (nextIndex === 0) {
      setCombatRound(combatRound + 1);
      addToCombatLog({
        type: "round-end",
        message: `Round ${combatRound} ended. Starting Round ${
          combatRound + 1
        }`,
      });
    }
    setCurrentTurnIndex(nextIndex);
  };

  const updateCreatureHp = (creatureId, newHp) => {
    setInitiativeOrder((prev) =>
      prev.map((combatant) =>
        combatant.id === creatureId
          ? { ...combatant, currentHp: Math.max(0, newHp) }
          : combatant
      )
    );
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

  const rollAttack = (attacker, attack, target) => {
    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const totalAttack = attackRoll + (attack.toHit || 0);
    const hit = totalAttack >= target.stats?.ac;

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
      // Roll damage
      const damageRoll = Math.floor(Math.random() * attack.damageDice) + 1;
      const totalDamage = damageRoll + (attack.damageBonus || 0);

      updateCreatureHp(target.id, target.currentHp - totalDamage);

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
