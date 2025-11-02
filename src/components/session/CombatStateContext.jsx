import { createContext, useContext, useState, useEffect } from "react";
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
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [combatRound, setCombatRound] = useState(1);
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [selectedCombatMap, setSelectedCombatMap] = useState(null);
  const [playerCount, setPlayerCount] = useState(4);
  const [gridSettings, setGridSettings] = useState({
    visible: false,
    color: "#d9ca89",
    opacity: 0.3,
    size: 40,
  });
  const [combatTransition, setCombatTransition] = useState({
    isVisible: false,
    type: null,
  });

  useEffect(() => {
    updateMapState({
      initiativeOrder,
      currentTurnIndex,
      combatRound,
    });
  }, [initiativeOrder, currentTurnIndex, combatRound]);
  useEffect(() => {
    updateMapState({
      combatTransition,
    });
  }, [combatTransition]);

  const startCombat = (encounter, playerData, combatMap) => {
    console.log("🎲 Starting combat with encounter:", encounter);

    // TRIGGER ENTER COMBAT TRANSITION
    setCombatTransition({ isVisible: true, type: "enter" });

    // Wait for transition to start before setting up combat
    setTimeout(() => {
      updateMapState({
        currentMapId: combatMap.id,
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
      encounter.creatures.forEach((creature, creatureTypeIndex) => {
        const creatureCount = parseInt(creature.count) || 1;
        console.log(`📊 Adding ${creatureCount}x ${creature.name}`);

        for (let i = 0; i < creatureCount; i++) {
          const initiativeRoll = Math.floor(Math.random() * 20) + 1;
          const initiative = initiativeRoll + (creature.dexModifier || 0);

          combatants.push({
            id: `creature-${creatureTypeIndex}-${i}`,
            name:
              creatureCount > 1 ? `${creature.name} ${i + 1}` : creature.name,
            initiative,
            isPlayer: false,
            hp: creature.hp,
            maxHp: creature.hp,
            ac: creature.ac,
            stats: creature.stats,
            imageURL: creature.imageURL,
          });
        }
      });

      console.log("📋 Total combatants created:", combatants.length);
      combatants.sort((a, b) => b.initiative - a.initiative);

      setInitiativeOrder(combatants);
      setCurrentTurnIndex(0);
      setCombatActive(true);
      setIsSetupMode(true);
      setActiveEncounter(encounter);
      setSelectedCombatMap(combatMap);
      setPlayerCount(playerData.length);

      // Auto-spawn tokens
      const mapHeight = combatMap.height || 2000;
      const mapWidth = combatMap.width || 2000;
      const centerY = mapHeight / 2;
      const centerX = mapWidth / 2;
      const tokens = [];

      // Player tokens
      const playerY = centerY - 150;
      const playerSpacing = 100;
      const playerStartX =
        centerX - ((playerData.length - 1) * playerSpacing) / 2;

      playerData.forEach((player, index) => {
        tokens.push({
          id: `token-player-${index}`,
          name: player.name,
          imageUrl: "https://via.placeholder.com/100?text=P",
          position: [playerY, playerStartX + index * playerSpacing],
          size: 60,
          isPlayer: true,
        });
      });

      // Creature tokens
      const totalCreatureCount = encounter.creatures.reduce((sum, c) => {
        return sum + (parseInt(c.count) || 1);
      }, 0);

      console.log("🐉 Total creature tokens to spawn:", totalCreatureCount);

      let creatureSpacing = 100;
      if (totalCreatureCount > 10) creatureSpacing = 80;
      if (totalCreatureCount > 15) creatureSpacing = 60;
      if (totalCreatureCount > 20) creatureSpacing = 50;

      const creatureY = centerY + 150;
      const creatureStartX =
        centerX - ((totalCreatureCount - 1) * creatureSpacing) / 2;

      let globalCreatureIndex = 0;
      encounter.creatures.forEach((creature, creatureTypeIndex) => {
        const creatureCount = parseInt(creature.count) || 1;

        for (let i = 0; i < creatureCount; i++) {
          tokens.push({
            id: `token-creature-${creatureTypeIndex}-${i}`,
            name:
              creatureCount > 1 ? `${creature.name} ${i + 1}` : creature.name,
            imageUrl:
              creature.imageURL || "https://via.placeholder.com/100?text=E",
            position: [
              creatureY,
              creatureStartX + globalCreatureIndex * creatureSpacing,
            ],
            size: 60,
            isPlayer: false,
            creatureData: creature,
          });
          globalCreatureIndex++;
        }
      });

      console.log("🎭 Total tokens created:", tokens.length);
      updateMapState({ tokens });
    }, 300); // Small delay for transition to start
  };

  const exitSetupMode = () => {
    setIsSetupMode(false);
  };

  const endCombat = () => {
    // TRIGGER EXIT COMBAT TRANSITION
    setCombatTransition({ isVisible: true, type: "exit" });

    // Wait for transition before actually ending combat
    setTimeout(() => {
      setCombatActive(false);
      setIsSetupMode(false);
      setInitiativeOrder([]);
      setCurrentTurnIndex(0);
      setActiveEncounter(null);
      setSelectedCombatMap(null);
      setPlayerCount(4);
      setGridSettings({ ...gridSettings, visible: false });

      updateMapState({ tokens: [] });

      setCombatLog((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "combat-end",
          message: "Combat ended",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 2200); // Wait for exit animation to complete
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
    let nextIndex = (currentTurnIndex + 1) % initiativeOrder.length;
    let attempts = 0;

    while (
      initiativeOrder[nextIndex]?.isDead &&
      attempts < initiativeOrder.length
    ) {
      nextIndex = (nextIndex + 1) % initiativeOrder.length;
      attempts++;
    }

    if (attempts >= initiativeOrder.length) {
      console.log("All combatants are dead!");
      return;
    }

    if (nextIndex === 0 || nextIndex < currentTurnIndex) {
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
      const logs = [];
      const updated = prev.map((c) => {
        if (c.id !== id) return c;

        const oldHp = c.currentHp ?? c.hp ?? c.maxHp;
        const clampedHp = Math.max(0, Math.min(newHp, c.maxHp));
        const diff = clampedHp - oldHp;

        if (diff < 0) {
          logs.push({
            type: "damage",
            target: c.name,
            damage: Math.abs(diff),
            message: `${c.name} took ${Math.abs(diff)} damage.`,
          });
        } else if (diff > 0) {
          logs.push({
            type: "healing",
            target: c.name,
            healing: diff,
            message: `${c.name} regained ${diff} HP.`,
          });
        }

        if (clampedHp === 0 && oldHp > 0) {
          const killer = initiativeOrder[currentTurnIndex];
          logs.push({
            type: "death",
            target: c.name,
            killer: killer?.name || "Unknown",
            message: `${c.name} has been slain by ${
              killer?.name || "Unknown"
            }!`,
          });
        }

        return { ...c, currentHp: clampedHp, isDead: clampedHp <= 0 };
      });

      if (logs.length > 0) {
        setCombatLog((prev) => [
          ...prev,
          ...logs.map((entry) => ({
            id: Date.now() + Math.random(),
            timestamp: new Date().toLocaleTimeString(),
            round: combatRound,
            ...entry,
          })),
        ]);
      }

      return updated;
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

    if (!hit) return { hit: false, attackRoll: totalAttack };

    const damageRoll = Math.floor(Math.random() * attack.damageDice) + 1;
    const totalDamage = damageRoll + (attack.damageBonus || 0);
    const currentHp = target.currentHp ?? target.hp ?? target.maxHp;

    updateCreatureHp(target.id, currentHp - totalDamage);

    return { hit: true, attackRoll: totalAttack, damage: totalDamage };
  };

  return (
    <CombatStateContext.Provider
      value={{
        combatActive,
        isSetupMode,
        initiativeOrder,
        currentTurnIndex,
        combatLog,
        combatRound,
        activeEncounter,
        selectedCombatMap,
        playerCount,
        gridSettings,
        combatTransition,
        startCombat,
        exitSetupMode,
        endCombat,
        nextTurn,
        updateCreatureHp,
        addToCombatLog,
        rollAttack,
        setGridSettings,        
        setCombatTransition,
      }}
    >
      {children}
    </CombatStateContext.Provider>
  );
};
