// SummonCreatures.jsx - UPDATED to work with external toggle button
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

export const SummonCreatures = ({ playerName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [currentCreatureIndex, setCurrentCreatureIndex] = useState(0);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [placementMode, setPlacementMode] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);

  // Listen for external toggle from the player turn banner button
  useEffect(() => {
    const handleToggle = () => {
      setIsExpanded((prev) => !prev);
    };

    const panelElement = document.getElementById("summon-creatures-panel");
    if (panelElement) {
      panelElement.addEventListener("toggleSummonPanel", handleToggle);
      return () => {
        panelElement.removeEventListener("toggleSummonPanel", handleToggle);
      };
    }
  }, []);

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
        detail: { quantity, creature: selectedCreature, playerName },
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

  // Update the data-expanded attribute when state changes
  useEffect(() => {
    const panelElement = document.getElementById("summon-creatures-panel");
    if (panelElement) {
      panelElement.setAttribute("data-expanded", isExpanded.toString());
    }
  }, [isExpanded]);

  return (
    <div
      id="summon-creatures-panel"
      data-expanded={isExpanded.toString()}
      className="bg-black/60 border border-[#BF883C]/40"
      style={{
        boxShadow: "inset 0 1px 0 rgba(191, 136, 60, 0.2)",
      }}
    >
      {/* Placement Mode Banner */}
      {placementMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#BF883C]/20 border-b-2 border-[#BF883C] px-3 py-2"
          style={{ boxShadow: "0 0 15px rgba(191, 136, 60, 0.3)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[#D9CA89] font-bold text-sm uppercase tracking-wider"
                style={{
                  textShadow: "0 0 8px rgba(217, 202, 137, 0.5)",
                }}
              >
                Placing: {selectedCreature.name} ({placedCount}/{quantity})
              </p>
              <p className="text-[#BF883C]/80 text-xs">
                Click map to place creatures
              </p>
            </div>
            <button
              onClick={handleCancelPlacement}
              className="px-3 py-1 bg-black/80 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wide transition-all"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgb(185, 28, 28)";
                e.currentTarget.style.boxShadow =
                  "0 0 10px rgba(185, 28, 28, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(185, 28, 28, 0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Expanded Content - NO TOGGLE BUTTON (controlled externally) */}
      <AnimatePresence>
        {isExpanded && !placementMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {/* Step 1: Type Selection OR Creature Carousel */}
              {!selectedCreature && (
                <div>
                  {!selectedType && (
                    <>
                      <p className="text-[#D9CA89]/80 text-xs uppercase tracking-wide mb-2">
                        Select Type
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.keys(SUMMON_TEMPLATES).map((type) => (
                          <button
                            key={type}
                            onClick={() => handleTypeSelect(type)}
                            className="py-2 border border-[#BF883C]/40 bg-black/40 text-[#D9CA89] font-bold uppercase text-xs tracking-wide transition-all"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#BF883C";
                              e.currentTarget.style.boxShadow =
                                "0 0 10px rgba(191, 136, 60, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(191, 136, 60, 0.4)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedType && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#D9CA89]/80 text-xs uppercase tracking-wide">
                          {selectedType}
                        </p>
                        <button
                          onClick={handleReset}
                          className="text-[#BF883C] text-xs uppercase tracking-wide hover:text-[#D9CA89] transition-colors"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={handlePreviousCreature}
                          className="w-8 h-8 flex items-center justify-center border border-[#BF883C]/40 text-[#BF883C] transition-all"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#BF883C";
                            e.currentTarget.style.boxShadow =
                              "0 0 10px rgba(191, 136, 60, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(191, 136, 60, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          ‹
                        </button>
                        <div className="flex-1 flex items-center gap-2">
                          <div
                            className="w-12 h-12 rounded-full border-2 border-[#BF883C] overflow-hidden bg-black"
                            style={{
                              boxShadow: "0 0 15px rgba(191, 136, 60, 0.4)",
                            }}
                          >
                            <img
                              src={
                                SUMMON_TEMPLATES[selectedType][
                                  currentCreatureIndex
                                ].imageUrl
                              }
                              alt={
                                SUMMON_TEMPLATES[selectedType][
                                  currentCreatureIndex
                                ].name
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[#D9CA89] font-bold text-sm uppercase tracking-wide flex-1">
                            {
                              SUMMON_TEMPLATES[selectedType][
                                currentCreatureIndex
                              ].name
                            }
                          </p>
                        </div>
                        <button
                          onClick={handleNextCreature}
                          className="w-8 h-8 flex items-center justify-center border border-[#BF883C]/40 text-[#BF883C] transition-all"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#BF883C";
                            e.currentTarget.style.boxShadow =
                              "0 0 10px rgba(191, 136, 60, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(191, 136, 60, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          ›
                        </button>
                      </div>
                      <button
                        onClick={handleChooseCreature}
                        className="w-full py-2 border border-[#BF883C] bg-[#BF883C]/20 text-[#D9CA89] font-bold uppercase text-xs tracking-widest transition-all"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(191, 136, 60, 0.3)";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(191, 136, 60, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(191, 136, 60, 0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Choose
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Quantity & Place */}
              {selectedCreature && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#D9CA89] font-bold text-sm uppercase tracking-wide">
                      {selectedCreature.name}
                    </p>
                    <button
                      onClick={() => setSelectedCreature(null)}
                      className="text-[#BF883C] text-xs uppercase tracking-wide hover:text-[#D9CA89] transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-[#BF883C]/40 text-[#BF883C] font-bold transition-all"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#BF883C";
                        e.currentTarget.style.boxShadow =
                          "0 0 10px rgba(191, 136, 60, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(191, 136, 60, 0.4)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-[#D9CA89]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-8 h-8 border border-[#BF883C]/40 text-[#BF883C] font-bold transition-all"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#BF883C";
                        e.currentTarget.style.boxShadow =
                          "0 0 10px rgba(191, 136, 60, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(191, 136, 60, 0.4)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleSpawn}
                    className="w-full py-2 border border-[#BF883C] bg-[#BF883C]/20 text-[#D9CA89] font-bold uppercase text-xs tracking-widest transition-all"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(191, 136, 60, 0.3)";
                      e.currentTarget.style.boxShadow =
                        "0 0 15px rgba(191, 136, 60, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(191, 136, 60, 0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Place on Map
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
