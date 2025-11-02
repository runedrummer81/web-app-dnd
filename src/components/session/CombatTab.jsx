import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InitiativeSetup from "./InitiativeSetup";
import { useCombatState } from "./CombatStateContext";
import ActionButton from "../ActionButton";

export const CombatTab = ({ sessionData }) => {
  const { startCombat } = useCombatState();
  const [showInitiativeSetup, setShowInitiativeSetup] = useState(false);
  // const [selectedEncounter, setSelectedEncounter] = useState(null);

  // const encounters = sessionData?.encounters || [];

  // const handleRunEncounter = (encounter) => {
  //   setSelectedEncounter(encounter);
  //   setShowInitiativeSetup(true);
  // };

  // Simple mock encounter for testing
  // const mockEncounter = {
  //   name: "Test Encounter",
  //   difficulty: "Medium",
  //   creatures: [
  //     {
  //       name: "Orc Warrior",
  //       hp: 30,
  //       ac: 13,
  //       dexModifier: 1,
  //       stats: {
  //         ac: 13,
  //         speed: "30 ft",
  //         abilities: {
  //           STR: 16,
  //           DEX: 12,
  //           CON: 16,
  //           INT: 7,
  //           WIS: 11,
  //           CHA: 10,
  //         },
  //         attacks: [
  //           {
  //             name: "Greataxe",
  //             toHit: 5,
  //             damage: "1d12+3",
  //             damageDice: 12,
  //             damageBonus: 3,
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       name: "Orc Grunt",
  //       hp: 15,
  //       ac: 12,
  //       dexModifier: 0,
  //       stats: {
  //         ac: 12,
  //         speed: "30 ft",
  //         abilities: {
  //           STR: 14,
  //           DEX: 10,
  //           CON: 14,
  //           INT: 7,
  //           WIS: 11,
  //           CHA: 10,
  //         },
  //         attacks: [
  //           {
  //             name: "Club",
  //             toHit: 4,
  //             damage: "1d6+2",
  //             damageDice: 6,
  //             damageBonus: 2,
  //           },
  //         ],
  //       },
  //     },
  //   ],
  // };

  return (
    <div className="space-y-6 p-4">
      {/* Big Start Combat Button */}
      <motion.div className="w-fit mx-auto">
        <ActionButton
          label="SETUP COMBAT"
          onClick={() => {
            // setSelectedEncounter(mockEncounter);
            setShowInitiativeSetup(true);
          }}
          size="lg"
          color="var(--secondary)"
          bgColor="var(--primary)"
          textColor="var(--dark-muted-bg)"
          showLeftArrow={true}
          showRightArrow={true}
          showGlow={false}
          animate={true}
          animationDelay={0.2}
          className="w-fit"
        />
      </motion.div>

      <motion.div
        className={`h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r ${"from-transparent via-[var(--secondary)] to-transparent"}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <div className="grid grid-cols-3 gap-4">
        {sessionData.combatMaps.map((map, idx) => (
          <button
            key={idx}
            className="border-2 border-[var(--secondary)] p-2 flex items-center justify-center hover:border-[#d9ca89] transition-all"
          >
            {map.image ? (
              <img
                src={map.image}
                alt={map.title || `Map ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-[var(--secondary)] text-sm text-center">
                {map.title || `Map ${idx + 1}`}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Initiative Setup Popup */}
      <AnimatePresence>
        {showInitiativeSetup && (
          <InitiativeSetup
            sessionData={sessionData} // needed for encounters + combatMaps
            onClose={() => {
              setShowInitiativeSetup(false);
              // setSelectedEncounter(null);
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
