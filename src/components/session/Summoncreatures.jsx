// SummonCreatures.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Summoned creature templates organized by type
const SUMMON_TEMPLATES = {
  fey: [
    {
      name: "Sprite",
      imageUrl: "https://5e.tools/img/bestiary/MM/Sprite.webp",
    },
    {
      name: "Satyr",
      imageUrl: "https://5e.tools/img/bestiary/MM/Satyr.webp",
    },
    {
      name: "Dryad",
      imageUrl: "https://5e.tools/img/bestiary/MM/Dryad.webp",
    },
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
    {
      name: "Ghoul",
      imageUrl: "https://5e.tools/img/bestiary/MM/Ghoul.webp",
    },
    {
      name: "Wight",
      imageUrl: "https://5e.tools/img/bestiary/MM/Wight.webp",
    },
  ],
  demons: [
    {
      name: "Manes",
      imageUrl: "https://5e.tools/img/bestiary/MM/Manes.webp",
    },
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
    {
      name: "Azer",
      imageUrl: "https://5e.tools/img/bestiary/MM/Azer.webp",
    },
    {
      name: "Gargoyle",
      imageUrl: "https://5e.tools/img/bestiary/MM/Gargoyle.webp",
    },
  ],
};

const TYPE_COLORS = {
  fey: "from-green-900/40 to-emerald-900/40 border-green-500",
  undead: "from-gray-900/40 to-slate-900/40 border-gray-500",
  demons: "from-red-900/40 to-orange-900/40 border-red-500",
  elementals: "from-blue-900/40 to-cyan-900/40 border-blue-500",
};

export const SummonCreatures = ({
  playerName,
  activeSummons,
  onDispelSingle,
  onDispelAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [currentCreatureIndex, setCurrentCreatureIndex] = useState(0);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [placementMode, setPlacementMode] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentCreatureIndex(0);
  };

  const handlePreviousCreature = () => {
    setCurrentCreatureIndex((prev) =>
      prev === 0 ? SUMMON_TEMPLATES[selectedType].length - 1 : prev - 1
    );
  };

  const handleNextCreature = () => {
    setCurrentCreatureIndex((prev) =>
      prev === SUMMON_TEMPLATES[selectedType].length - 1 ? 0 : prev + 1
    );
  };

  const handleChooseCreature = () => {
    setSelectedCreature(SUMMON_TEMPLATES[selectedType][currentCreatureIndex]);
  };

  const handleSpawn = () => {
    if (!selectedCreature) return;

    setPlacementMode(true);
    setPlacedCount(0);

    window.dispatchEvent(
      new CustomEvent("enterSummonPlacementMode", {
        detail: {
          quantity: quantity,
          creature: selectedCreature,
          playerName: playerName,
        },
      })
    );
  };

  const handleCancelPlacement = () => {
    setPlacementMode(false);
    setPlacedCount(0);
    window.dispatchEvent(new CustomEvent("cancelSummonPlacement"));
  };

  const handleReset = () => {
    setSelectedType(null);
    setCurrentCreatureIndex(0);
    setSelectedCreature(null);
    setQuantity(1);
  };

  // Listen for placement updates
  useEffect(() => {
    const handlePlacementUpdate = (event) => {
      setPlacedCount(event.detail.placedCount);
    };

    const handlePlacementComplete = () => {
      setPlacementMode(false);
      setPlacedCount(0);
      setSelectedCreature(null);
      setQuantity(1);
      setSelectedType(null);
      setIsExpanded(false);
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
  }, []);

  return (
    <div className="bg-purple-900/20 border-2 border-purple-500/50 p-4">
      {/* Placement Mode Banner */}
      {placementMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-purple-600/40 border-2 border-purple-400 rounded"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-bold text-lg uppercase tracking-wider">
                Placement Mode Active
              </p>
              <p className="text-purple-300 text-sm">
                Click on the map to place creatures ({placedCount}/{quantity})
              </p>
            </div>
            <motion.button
              onClick={handleCancelPlacement}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
        disabled={placementMode}
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h3 className="text-purple-300 font-bold uppercase tracking-wider text-lg">
              Summon Creatures
            </h3>
            <p className="text-purple-200/60 text-xs uppercase tracking-wider">
              Conjure visual tokens for {playerName}
            </p>
          </div>
        </div>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="text-purple-300"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M 6,9 L 12,15 L 18,9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
          />
        </motion.svg>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !placementMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4 space-y-4"
          >
            {/* Type Selection */}
            {!selectedType && (
              <div>
                <p className="text-purple-200 text-xs uppercase tracking-wider mb-3 font-bold">
                  Select Creature Type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(SUMMON_TEMPLATES).map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`p-4 border-2 bg-gradient-to-br ${TYPE_COLORS[type]} hover:opacity-90 transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-white font-bold uppercase text-sm">
                        {type}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Creature Carousel */}
            {selectedType && !selectedCreature && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider font-bold">
                    Select Creature ({selectedType})
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-purple-300 text-xs hover:text-purple-200"
                  >
                    Change Type
                  </button>
                </div>

                <div className="bg-black/40 border-2 border-purple-500/30 p-6 rounded">
                  {/* Carousel */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {/* Left Arrow */}
                    <motion.button
                      onClick={handlePreviousCreature}
                      className="w-12 h-12 flex items-center justify-center border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </motion.button>

                    {/* Creature Image */}
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-4 border-purple-500 overflow-hidden bg-black">
                        <img
                          src={
                            SUMMON_TEMPLATES[selectedType][currentCreatureIndex]
                              .imageUrl
                          }
                          alt={
                            SUMMON_TEMPLATES[selectedType][currentCreatureIndex]
                              .name
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <motion.button
                      onClick={handleNextCreature}
                      className="w-12 h-12 flex items-center justify-center border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Creature Name */}
                  <p className="text-center text-purple-200 font-bold text-xl mb-4">
                    {SUMMON_TEMPLATES[selectedType][currentCreatureIndex].name}
                  </p>

                  {/* Choose Button */}
                  <motion.button
                    onClick={handleChooseCreature}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider border-2 border-purple-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Choose
                  </motion.button>
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {selectedCreature && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-200 text-xs uppercase tracking-wider font-bold">
                    Quantity
                  </p>
                  <button
                    onClick={() => setSelectedCreature(null)}
                    className="text-purple-300 text-xs hover:text-purple-200"
                  >
                    Change Creature
                  </button>
                </div>

                <div className="bg-purple-900/40 border border-purple-500/50 p-4 rounded">
                  <p className="text-purple-200 font-bold text-base mb-4 text-center">
                    {selectedCreature.name}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-4">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 border-2 border-purple-500 text-purple-300 font-bold text-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        −
                      </motion.button>
                      <span className="text-4xl font-bold text-purple-300 min-w-[4ch] text-center">
                        {quantity}
                      </span>
                      <motion.button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-12 h-12 border-2 border-purple-500 text-purple-300 font-bold text-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSpawn}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider border-2 border-purple-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Place {quantity} {selectedCreature.name}
                    {quantity > 1 ? "s" : ""} on Map
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
