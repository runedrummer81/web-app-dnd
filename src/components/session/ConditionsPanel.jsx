// ConditionsPanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ D&D 5e Conditions - Redesigned for your aesthetic
export const CONDITIONS = [
  {
    name: "Blinded",
    effects: [
      "Can't see and automatically fails ability checks requiring sight",
      "Attack rolls against have advantage",
      "Creature's attack rolls have disadvantage",
    ],
  },
  {
    name: "Charmed",
    effects: [
      "Can't attack the charmer or target them with harmful abilities",
      "Charmer has advantage on social ability checks with creature",
    ],
  },
  {
    name: "Deafened",
    effects: [
      "Can't hear and automatically fails ability checks requiring hearing",
    ],
  },
  {
    name: "Frightened",
    effects: [
      "Disadvantage on ability checks and attack rolls while source of fear is in sight",
      "Can't willingly move closer to source of fear",
    ],
  },
  {
    name: "Grappled",
    effects: [
      "Speed becomes 0, can't benefit from any bonus to speed",
      "Ends if grappler is incapacitated or creature is removed from reach",
    ],
  },
  {
    name: "Incapacitated",
    effects: ["Can't take actions or reactions"],
  },
  {
    name: "Invisible",
    effects: [
      "Impossible to see without magic or special sense",
      "Attack rolls against have disadvantage",
      "Creature's attack rolls have advantage",
    ],
  },
  {
    name: "Paralyzed",
    effects: [
      "Incapacitated, can't move or speak",
      "Automatically fails Strength and Dexterity saves",
      "Attack rolls against have advantage",
      "Any hit within 5 ft. is a critical hit",
    ],
  },
  {
    name: "Petrified",
    effects: [
      "Transformed into solid inanimate substance (stone)",
      "Incapacitated, can't move or speak, unaware of surroundings",
      "Automatically fails Strength and Dexterity saves",
      "Attack rolls against have advantage",
      "Resistance to all damage",
      "Immune to poison and disease",
    ],
  },
  {
    name: "Poisoned",
    effects: ["Disadvantage on attack rolls and ability checks"],
  },
  {
    name: "Prone",
    effects: [
      "Only movement option is to crawl unless stands up",
      "Disadvantage on attack rolls",
      "Attack rolls against have advantage if attacker within 5 ft., otherwise disadvantage",
    ],
  },
  {
    name: "Restrained",
    effects: [
      "Speed becomes 0, can't benefit from any bonus to speed",
      "Attack rolls against have advantage",
      "Creature's attack rolls have disadvantage",
      "Disadvantage on Dexterity saving throws",
    ],
  },
  {
    name: "Stunned",
    effects: [
      "Incapacitated, can't move, can speak only falteringly",
      "Automatically fails Strength and Dexterity saves",
      "Attack rolls against have advantage",
    ],
  },
  {
    name: "Unconscious",
    effects: [
      "Incapacitated, can't move or speak, unaware of surroundings",
      "Drops whatever holding and falls prone",
      "Automatically fails Strength and Dexterity saves",
      "Attack rolls against have advantage",
      "Any hit within 5 ft. is a critical hit",
    ],
  },
  {
    name: "Concentrating",
    effects: [
      "Maintaining concentration on a spell",
      "Taking damage requires Constitution save (DC = 10 or half damage)",
      "Ends if incapacitated or killed",
    ],
  },
];

export const ConditionsPanel = ({
  combatantId,
  conditions = [],
  onAddCondition,
  onRemoveCondition,
  isCompact = false,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState(null);

  if (isCompact) {
    // ✅ Compact view for initiative list - just show count
    return conditions.length > 0 ? (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-400 font-bold border border-red-500/50 px-2 py-0.5 uppercase">
          {conditions.length}{" "}
          {conditions.length === 1 ? "Condition" : "Conditions"}
        </span>
      </div>
    ) : null;
  }

  // ✅ Full view for main display
  return (
    <div className="space-y-2">
      {/* Active Conditions */}
      {conditions.length > 0 && (
        <div className="space-y-1">
          {conditions.map((condName) => {
            const condition = CONDITIONS.find((c) => c.name === condName);
            const isExpanded = expandedCondition === condName;

            return (
              <div
                key={condName}
                className="border border-red-500/30 bg-black/40 overflow-hidden hover:border-red-500/60 transition-colors"
              >
                {/* Condition Header */}
                <div className="flex items-center justify-between p-2">
                  <button
                    onClick={() =>
                      setExpandedCondition(isExpanded ? null : condName)
                    }
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
                      {condName}
                    </span>
                    <span className="text-xs text-[var(--secondary)] ml-auto">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>
                  <button
                    onClick={() => onRemoveCondition(combatantId, condName)}
                    className="ml-2 px-2 py-1 text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Condition Effects */}
                <AnimatePresence>
                  {isExpanded && condition && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3 pb-2 bg-black/80 border-t border-red-500/20"
                    >
                      <ul className="space-y-1">
                        {condition.effects.map((effect, idx) => (
                          <li
                            key={idx}
                            className="text-1xl text-[var(--secondary)] flex items-start gap-2"
                          >
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Condition Button */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="cursor-pointer w-full p-2 border border-[var(--secondary)]/30 hover:border-[var(--primary)] text-[var(--secondary)] hover:text-[var(--primary)] text-xs font-bold uppercase transition-colors"
        >
          + Add Condition
        </button>

        {/* Condition Selection Menu */}
        <AnimatePresence>
          {showAddMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 p-2 bg-black/95 border border-[var(--primary)] max-h-60 overflow-y-auto"
            >
              <div className="space-y-1">
                {CONDITIONS.map((condition) => {
                  const hasCondition = conditions.includes(condition.name);
                  return (
                    <button
                      key={condition.name}
                      onClick={() => {
                        if (!hasCondition) {
                          onAddCondition(combatantId, condition.name);
                          setShowAddMenu(false);
                        }
                      }}
                      disabled={hasCondition}
                      className={`w-full text-left px-2 py-1 text-xs uppercase border transition-colors ${
                        hasCondition
                          ? "border-gray-700 text-gray-600 cursor-not-allowed opacity-40"
                          : "border-[var(--secondary)]/30 text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                    >
                      {condition.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
