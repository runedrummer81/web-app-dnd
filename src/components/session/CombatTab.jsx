import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InitiativeSetup from "./InitiativeSetup";
import { useCombatState } from "./CombatStateContext";
import ActionButton from "../ActionButton";
import { BossEncountersSection } from "./fortress/FortressEncounterButton";
import { FortressConfirmationModal } from "./fortress/FortressConfirmationModal";
import { useFortress } from "./fortress/FortressContext";

export const CombatTab = ({ sessionData }) => {
  const { startCombat } = useCombatState();
  const { startFortressEncounter } = useFortress();
  const [showInitiativeSetup, setShowInitiativeSetup] = useState(false);
  const [showFortressConfirm, setShowFortressConfirm] = useState(false);

  const handleBeginFortressEncounter = () => {
    // Close the confirmation modal
    setShowFortressConfirm(false);

    // Start the fortress encounter (shows choice overlay)
    startFortressEncounter();

    console.log("🏰 Fortress Encounter Started - Choice Phase Active");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Big Start Combat Button */}
      <motion.div className="w-fit mx-auto">
        <ActionButton
          label="SETUP COMBAT"
          onClick={() => {
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

      {/* TODO: Random Encounter button will go here */}

      <motion.div
        className={`h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Boss Encounters Section - Collapsible */}
      <BossEncountersSection onBossClick={() => setShowFortressConfirm(true)} />

      <motion.div
        className={`h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {/* Combat Maps Grid */}
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
            sessionData={sessionData}
            onClose={() => {
              setShowInitiativeSetup(false);
            }}
            onStart={(selectedEncounter, playerData, selectedCombatMap) => {
              startCombat(selectedEncounter, playerData, selectedCombatMap);
              setShowInitiativeSetup(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Fortress Confirmation Modal */}
      <FortressConfirmationModal
        isOpen={showFortressConfirm}
        onConfirm={handleBeginFortressEncounter}
        onCancel={() => setShowFortressConfirm(false)}
      />
    </div>
  );
};
