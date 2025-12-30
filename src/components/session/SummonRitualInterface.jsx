// SummonRitualInterface.jsx - REDESIGNED with Dice Roller Aesthetic
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUMMON_TEMPLATES = {
  fey: [
    {
      name: "Sprite",
      imageUrl: "https://5e.tools/img/bestiary/MM/Sprite.webp",
    },
    { name: "Satyr", imageUrl: "https://5e.tools/img/bestiary/MM/Satyr.webp" },
    { name: "Dryad", imageUrl: "https://5e.tools/img/bestiary/MM/Dryad.webp" },
    {
      name: "Blink Dog",
      imageUrl: "https://5e.tools/img/bestiary/MM/Blink%20Dog.webp",
    },
  ],
  undead: [
    {
      name: "Skeleton",
      imageUrl: "https://5e.tools/img/bestiary/MM/Skeleton.webp",
    },
    {
      name: "Zombie",
      imageUrl: "https://5e.tools/img/bestiary/MM/Zombie.webp",
    },
    { name: "Ghoul", imageUrl: "https://5e.tools/img/bestiary/MM/Ghoul.webp" },
    { name: "Wight", imageUrl: "https://5e.tools/img/bestiary/MM/Wight.webp" },
  ],
  demons: [
    { name: "Manes", imageUrl: "https://5e.tools/img/bestiary/MM/Manes.webp" },
    {
      name: "Dretch",
      imageUrl: "https://5e.tools/img/bestiary/MM/Dretch.webp",
    },
    {
      name: "Quasit",
      imageUrl: "https://5e.tools/img/bestiary/MM/Quasit.webp",
    },
    {
      name: "Shadow Demon",
      imageUrl: "https://5e.tools/img/bestiary/MM/Shadow%20Demon.webp",
    },
  ],
  elementals: [
    {
      name: "Magmin",
      imageUrl: "https://5e.tools/img/bestiary/MM/Magmin.webp",
    },
    {
      name: "Steam Mephit",
      imageUrl: "https://5e.tools/img/bestiary/MM/Steam%20Mephit.webp",
    },
    { name: "Azer", imageUrl: "https://5e.tools/img/bestiary/MM/Azer.webp" },
    {
      name: "Gargoyle",
      imageUrl: "https://5e.tools/img/bestiary/MM/Gargoyle.webp",
    },
  ],
};

const TYPE_RUNES = {
  fey: "✦",
  undead: "☠",
  demons: "⚔",
  elementals: "◈",
};

export const SummonRitualInterface = ({ playerName, onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [placementMode, setPlacementMode] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);

  const handleTypeSelect = (type) => {
    setSelectedType(selectedType === type ? null : type);
    setSelectedCreature(null);
  };

  const handleCreatureSelect = (creature) => {
    setSelectedCreature(creature);
  };

  const handleSummon = () => {
    if (!selectedCreature) return;
    setPlacementMode(true);
    setPlacedCount(0);
    window.dispatchEvent(
      new CustomEvent("enterSummonPlacementMode", {
        detail: { quantity, creature: selectedCreature, playerName },
      })
    );
  };

  const handleCancelPlacement = () => {
    setPlacementMode(false);
    setPlacedCount(0);
    window.dispatchEvent(new CustomEvent("cancelSummonPlacement"));
  };

  useEffect(() => {
    const handlePlacementUpdate = (event) => {
      setPlacedCount(event.detail.placedCount);
    };

    const handlePlacementComplete = () => {
      setPlacementMode(false);
      setPlacedCount(0);
      setSelectedCreature(null);
      setSelectedType(null);
      setQuantity(1);
      onClose();
    };

    window.addEventListener("summonPlacementUpdate", handlePlacementUpdate);
    window.addEventListener("summonPlacementComplete", handlePlacementComplete);

    return () => {
      window.removeEventListener(
        "summonPlacementUpdate",
        handlePlacementUpdate
      );
      window.removeEventListener(
        "summonPlacementComplete",
        handlePlacementComplete
      );
    };
  }, [onClose]);

  return (
    <div className="relative p-4 ">
      {/* Back Arrow */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 group z-20 cursor-pointer"
        disabled={placementMode}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#BF883C"
          strokeWidth="2"
          className="group-hover:stroke-[#D9CA89] transition-colors"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-[#D9CA89] font-bold uppercase tracking-widest text-base mb-4"
        style={{ textShadow: "0 0 15px rgba(217, 202, 137, 0.7)" }}
      >
        ✦ Summon Creatures ✦
      </motion.h3>

      {placementMode ? (
        // PLACEMENT MODE ACTIVE
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="relative inline-block mb-4">
            {/* Pulsing Circle */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(217,202,137,0.4) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <p
              className="relative text-[#D9CA89] font-bold text-2xl"
              style={{
                textShadow: "0 0 20px rgba(217, 202, 137, 0.8)",
              }}
            >
              {placedCount} / {quantity}
            </p>
          </div>
          <p className="text-[#BF883C] text-sm mb-2 uppercase tracking-wide">
            Placing {selectedCreature.name}
          </p>
          <p className="text-blue-300 text-xs mb-6">
            Click on the map to place creatures
          </p>
          <button
            onClick={handleCancelPlacement}
            className="px-6 py-2 bg-red-900/60 border-2 border-red-600 text-red-300 font-bold uppercase tracking-wider transition-all"
            style={{
              filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter =
                "drop-shadow(0 0 20px rgba(239, 68, 68, 0.7))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter =
                "drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))";
            }}
          >
            Cancel
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Step 1: Glowing Type Orbs */}
          <div>
            <div className="flex justify-center gap-10 pt-2">
              {Object.keys(SUMMON_TEMPLATES).map((type) => {
                const isSelected = selectedType === type;
                return (
                  <motion.button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="relative flex flex-col items-center gap-2 cursor-pointer"
                  >
                    {/* Glowing Background Layer */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: isSelected ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
                        scale: isSelected ? [1, 1.2, 1] : [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        background:
                          "radial-gradient(circle, rgba(217,202,137,0.5) 0%, transparent 70%)",
                        filter: "blur(15px)",
                      }}
                    />

                    {/* Orb */}
                    <motion.div
                      className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "#D9CA89" : "#BF883C",
                        backgroundColor: isSelected
                          ? "rgba(217, 202, 137, 0.2)"
                          : "rgba(0, 0, 0, 0.6)",
                        boxShadow: isSelected
                          ? "0 0 25px rgba(217, 202, 137, 0.8), inset 0 0 15px rgba(217, 202, 137, 0.3)"
                          : "0 0 15px rgba(191, 136, 60, 0.5), inset 0 0 10px rgba(191, 136, 60, 0.2)",
                      }}
                    >
                      <span
                        className="text-3xl"
                        style={{
                          color: isSelected ? "#D9CA89" : "#BF883C",
                          filter: isSelected
                            ? "drop-shadow(0 0 8px rgba(217, 202, 137, 0.8))"
                            : "drop-shadow(0 0 5px rgba(191, 136, 60, 0.5))",
                        }}
                      >
                        {TYPE_RUNES[type]}
                      </span>
                    </motion.div>

                    {/* Label */}
                    <span
                      className="text-xs uppercase tracking-wider font-bold"
                      style={{
                        color: isSelected ? "#D9CA89" : "#BF883C",
                        textShadow: isSelected
                          ? "0 0 8px rgba(217, 202, 137, 0.6)"
                          : "none",
                      }}
                    >
                      {type}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Creature Selection */}
          <AnimatePresence mode="wait">
            {selectedType && (
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className=" p-3"
                  style={{
                    boxShadow:
                      "inset 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(191, 136, 60, 0.2)",
                  }}
                >
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {SUMMON_TEMPLATES[selectedType].map((creature) => {
                      const isSelected =
                        selectedCreature?.name === creature.name;
                      return (
                        <motion.button
                          key={creature.name}
                          onClick={() => handleCreatureSelect(creature)}
                          className="relative overflow-hidden aspect-square group cursor-pointer"
                          style={{
                            border: isSelected
                              ? "2px solid #D9CA89"
                              : "2px solid rgba(191, 136, 60, 0.3)",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            boxShadow: isSelected
                              ? "0 0 20px rgba(217, 202, 137, 0.5)"
                              : "none",
                          }}
                        >
                          <img
                            src={creature.imageUrl}
                            alt={creature.name}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-0 inset-x-0 p-1">
                            <p className="text-[#D9CA89] text-xs text-center font-bold uppercase tracking-tight leading-tight">
                              {creature.name}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Quantity & Summon */}
                  <AnimatePresence>
                    {selectedCreature && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2 pt-2 border-t border-[#BF883C]/20"
                      >
                        {/* Quantity */}
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-[#D9CA89] text-xs uppercase tracking-wide">
                            Qty:
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="w-7 h-7 border border-[#BF883C]/40 text-[#BF883C] font-bold transition-all"
                            style={{
                              boxShadow: "0 0 10px rgba(191, 136, 60, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#BF883C";
                              e.currentTarget.style.boxShadow =
                                "0 0 15px rgba(191, 136, 60, 0.6)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(191, 136, 60, 0.4)";
                              e.currentTarget.style.boxShadow =
                                "0 0 10px rgba(191, 136, 60, 0.3)";
                            }}
                          >
                            −
                          </button>
                          <span
                            className="text-[#D9CA89] font-bold text-2xl w-10 text-center"
                            style={{
                              textShadow: "0 0 15px rgba(217, 202, 137, 0.6)",
                            }}
                          >
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(Math.min(10, quantity + 1))
                            }
                            className="w-7 h-7 border border-[#BF883C]/40 text-[#BF883C] font-bold transition-all"
                            style={{
                              boxShadow: "0 0 10px rgba(191, 136, 60, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#BF883C";
                              e.currentTarget.style.boxShadow =
                                "0 0 15px rgba(191, 136, 60, 0.6)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(191, 136, 60, 0.4)";
                              e.currentTarget.style.boxShadow =
                                "0 0 10px rgba(191, 136, 60, 0.3)";
                            }}
                          >
                            +
                          </button>
                        </div>

                        {/* Summon Button */}
                        <button
                          onClick={handleSummon}
                          className="w-full py-2 border-2 border-[#BF883C] text-[#D9CA89] font-bold uppercase tracking-widest text-sm transition-all"
                          style={{
                            backgroundColor: "rgba(191, 136, 60, 0.2)",
                            boxShadow:
                              "0 0 20px rgba(191, 136, 60, 0.5), inset 0 1px 0 rgba(217, 202, 137, 0.2)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(191, 136, 60, 0.3)";
                            e.currentTarget.style.boxShadow =
                              "0 0 30px rgba(217, 202, 137, 0.8), inset 0 1px 0 rgba(217, 202, 137, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(191, 136, 60, 0.2)";
                            e.currentTarget.style.boxShadow =
                              "0 0 20px rgba(191, 136, 60, 0.5), inset 0 1px 0 rgba(217, 202, 137, 0.2)";
                          }}
                        >
                          ✦ Summon ✦
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
