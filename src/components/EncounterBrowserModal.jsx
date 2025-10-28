// EncounterBrowserModal.jsx - UPDATED for multi-select

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

export default function EncounterBrowserModal({
  isOpen,
  onClose,
  onConfirm,
  alreadySelectedEncounters = [],
}) {
  const [availableEncounters, setAvailableEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatureImages, setCreatureImages] = useState({});
  const [tempSelectedEncounters, setTempSelectedEncounters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch encounters from Firestore
  useEffect(() => {
    if (!isOpen) return;

    async function fetchEncounters() {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        const q = query(
          collection(db, "encounters"),
          where("ownerId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAvailableEncounters(data);
        
      } catch (err) {
        console.error("Error fetching encounters:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEncounters();
  }, [isOpen]);

  const filteredEncounters = availableEncounters.filter((enc) =>
  enc.name.toLowerCase().includes(searchQuery.toLowerCase())
);
// Når modal åbnes, marker allerede tilføjede encounters som valgte
useEffect(() => {
  if (isOpen) {
    setTempSelectedEncounters([...alreadySelectedEncounters]);
  } else {
    setTempSelectedEncounters([]);
  }
}, [isOpen, alreadySelectedEncounters]);

  // Fetch creature images when encounters are loaded
  useEffect(() => {
    async function fetchCreatureImages() {
      const creatureNames = new Set();
      availableEncounters.forEach((encounter) => {
        if (encounter.creatures) {
          encounter.creatures.forEach((creature) => {
            creatureNames.add(creature.name);
          });
        }
      });

      try {
        const creaturesSnapshot = await getDocs(collection(db, "Creatures"));
        const images = {};

        creaturesSnapshot.docs.forEach((doc) => {
          const creatureData = doc.data();
          const creatureName = doc.id;

          if (creatureNames.has(creatureName)) {
            images[creatureName] = creatureData.imageURL || null;
          }
        });

        setCreatureImages(images);
      } catch (err) {
        console.error("Error fetching creature images:", err);
      }
    }

    if (availableEncounters.length > 0) {
      fetchCreatureImages();
    }
  }, [availableEncounters]);

  // Check if encounter is already added to session
  const isEncounterAlreadyAdded = (encounterId) => {
    return alreadySelectedEncounters.some((e) => e.id === encounterId);
  };

 // Toggle encounter selection
const toggleEncounterSelection = (encounter) => {
  const isSelected = tempSelectedEncounters.find(e => e.id === encounter.id);
  if (isSelected) {
    setTempSelectedEncounters(
      tempSelectedEncounters.filter(e => e.id !== encounter.id)
    );
  } else {
    setTempSelectedEncounters([...tempSelectedEncounters, encounter]);
  }
};

// Confirm - send hele arrayet tilbage
const handleConfirm = () => {
  onConfirm(tempSelectedEncounters);
  handleClose();
};


  // Handle close
  const handleClose = () => {
    setTempSelectedEncounters([]);
    onClose();
  };

  // Check if there are changes compared to already selected
const hasSelectionChanged = () => {
  if (tempSelectedEncounters.length !== alreadySelectedEncounters.length) {
    return true; // forskelligt antal = ændring
  }

  const tempIds = tempSelectedEncounters.map((e) => e.id).sort();
  const alreadyIds = alreadySelectedEncounters.map((e) => e.id).sort();

  // Hvis bare ét ID ikke matcher → ændring
  for (let i = 0; i < tempIds.length; i++) {
    if (tempIds[i] !== alreadyIds[i]) {
      return true;
    }
  }

  return false;
};


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-10001 p-8"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1F1E1A] border-2 border-[var(--secondary)] shadow-[0_0_60px_rgba(191,136,60,0.4)] w-full max-w-3xl max-h-[75vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--secondary)]/30">
            <div className="flex justify-between items-center ">
              <h3 className="text-2xl uppercase tracking-widest font-semibold text-[var(--primary)] drop-shadow-[0_0_10px_rgba(191,136,60,0.5)]">
                Select Encounters
              </h3>
              
                <button
              onClick={handleClose}
              className="text-[var(--primary)] hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
              </div>
            

              <div className="flex justify-between w-full pr-10">
                <input
                type="text"
                placeholder="Search encounters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-3 w-100 bg-[#1C1B18] border border-[var(--secondary)]/40 rounded px-3 py-2 text-[var(--secondary)] placeholder-[var(--secondary)]/50 focus:outline-none focus:border-[var(--primary)]"
              />
              {tempSelectedEncounters.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[var(--secondary)] mt-1"
                >
                  {tempSelectedEncounters.length} encounter
                  {tempSelectedEncounters.length !== 1 ? "s" : ""} selected
                </motion.p>
              )}
                            
            <ActionButton
                              label="CREATE ENCOUNTER"
                              onClick={() => navigate("/encounters")}
                              color="var(--secondary)"
                              bgColor="#f0d382"
                              textColor="#1C1B18"
                              size="sm"
                              showGlow={false}
                              showLeftArrow={false}
                              showRightArrow={true}
                              animate={false}
                            className="mt-3 mr-3"/>
            
              </div>
              
            
          </div>

          {/* Encounter List */}
          <div className="flex-1 overflow-y-auto p-6"> {/*slettet min-h-[300px]*/}
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--secondary)] text-lg">
                  Loading encounters...
                </p>
              </div>
            ) : filteredEncounters.length > 0 ? (
              <div className="space-y-3">
                {filteredEncounters.map((enc, index) => {
                  const isAlreadyAdded = isEncounterAlreadyAdded(enc.id);
                  const isSelected = tempSelectedEncounters.find(
                    (e) => e.id === enc.id
                  );
                  {filteredEncounters.length === 0 && !loading && (
                    <div className="text-center text-[var(--secondary)]/60 mt-10">
                      No encounters match your search.
                    </div>
                  )}

                  
                  const firstCreature =
                    enc.creatures && enc.creatures.length > 0
                      ? enc.creatures[0]
                      : null;
                  const creatureImageUrl = firstCreature
                    ? creatureImages[firstCreature.name] ||
                      "https://via.placeholder.com/400x200?text=No+Image"
                    : "https://via.placeholder.com/400x200?text=No+Image";

                  return (
                    <motion.button
                      key={enc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() =>{
                        toggleEncounterSelection(enc);
                      }}
                      className={`w-full text-left relative overflow-hidden border-2 transition-all duration-300 group ${
                        isSelected
                          ? "border-[var(--primary)] shadow-[0_0_25px_rgba(191,136,60,0.5)]"
                          : "border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:shadow-[0_0_20px_rgba(191,136,60,0.3)]"
                      }`}
                      style={{ minHeight: "100px" }}
                    >
                      {/* Background image on the right side */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                        style={{
                          backgroundImage: `url(${creatureImageUrl})`,
                          backgroundPosition: "right center",
                          clipPath:
                            "polygon(40% 0, 100% 0, 100% 100%, 40% 100%)",
                        }}
                      />

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(31, 30, 26, 1) 0%, rgba(31, 30, 26, 0.95) 40%, rgba(31, 30, 26, 0.7) 70%, transparent 100%)",
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10 p-4">
                        <div className="flex justify-between items-start mb-2">
                           <p
                            className={`font-semibold text-lg ${
                              isAlreadyAdded
                                ? "text-[var(--secondary)]"
                                : "text-[var(--primary)] group-hover:drop-shadow-[0_0_8px_rgba(191,136,60,0.6)]"
                            }`}
                          >
                            {enc.name}
                          </p>
                          <div className="flex items-center gap-2">
                            {/* Selection checkmark */}
                            {isSelected 
                             && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-[var(--primary)] border-2 border-[#1C1B18] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(191,136,60,0.6)]"
                              >
                                <span className="text-[#1C1B18] text-sm font-bold">
                                  ✓
                                </span>
                              </motion.div>
                            )}
                            {/* Already added badge
                            {isAlreadyAdded && (
                              <span className="px-2 py-1 bg-green-600/80 text-white text-xs font-semibold uppercase">
                                Added
                              </span>
                            )} */} 
                          </div>
                        </div>
                        {enc.creatures && enc.creatures.length > 0 && (
                          <div className="text-[var(--secondary)] text-sm space-y-1">
                            {enc.creatures.map((creature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <span className="text-[var(--secondary)]/60">
                                  •
                                </span>
                                <span>
                                  {creature.name} × {creature.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[var(--secondary)] text-xl mb-2">
                  No encounters found
                </p>
                <p className="text-[var(--secondary)]/60 text-sm">
                  Create encounters first to add them to your session
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t border-[var(--secondary)]/30 bg-[#1C1B18]">
            <button
              onClick={handleClose}
              className="px-6 py-2 border-2 border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition uppercase tracking-wider"
            >
              Cancel
            </button>
            
             

            <button
              onClick={handleConfirm}
              disabled={!hasSelectionChanged()}
              className={`px-6 py-2 border-2 transition uppercase tracking-wider ${
                !hasSelectionChanged()
                  ? "border-[var(--secondary)]/30 text-[var(--secondary)]/30 cursor-not-allowed"
                  : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 shadow-[0_0_15px_rgba(191,136,60,0.3)]"
              }`}
            >
              Save
              {tempSelectedEncounters.length > 0
                ? `(${tempSelectedEncounters.length})`
                : " Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
