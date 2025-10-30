import { motion } from "framer-motion";
import { useCombatState } from "./CombatStateContext";

export const CombatHistory = () => {
  const { combatLog, combatRound } = useCombatState();

  if (combatLog.length === 0) {
    return (
      <div
        className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
        style={{ fontFamily: "EB Garamond, serif" }}
      >
        No combat history yet
      </div>
    );
  }

  const getLogIcon = (type) => {
    switch (type) {
      case "combat-start":
        return "⚔️";
      case "attack":
        return "🎯";
      case "damage":
        return "💥";
      case "round-end":
        return "🔄";
      case "combat-end":
        return "🏁";
      default:
        return "•";
    }
  };

  const getLogColor = (type, entry) => {
    switch (type) {
      case "combat-start":
        return "text-yellow-400";
      case "attack":
        return entry.hit ? "text-green-400" : "text-red-400";
      case "damage":
        return "text-orange-400";
      case "round-end":
        return "text-blue-400";
      case "combat-end":
        return "text-purple-400";
      default:
        return "text-[#d9ca89]";
    }
  };

  return (
    <div className="space-y-4 px-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className=" p-4 text-center">
          <p
            className="text-xs text-[var(--secondary)] uppercase  mb-2"
          >
            Current Round
          </p>
          <p
            className="text-3xl font-bold text-[var(--primary)]"
          >
            {combatRound}
          </p>
        </div>

        <div className=" p-4 text-center">
          <p
            className="text-xs text-[var(--secondary)] uppercase mb-2"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Total Actions
          </p>
          <p
            className="text-3xl font-bold text-[var(--primary)]"
          >
            {combatLog.length}
          </p>
        </div>
      </div>

      {/* Combat Log */}
      <div>
        <h3
          className="text-lg font-bold text-[var(--secondary)] uppercase  mb-3"
        >
          Combat Log
        </h3>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {[...combatLog].reverse().map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative  p-3 transition-all"
            >

              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getLogIcon(entry.type)}
                </span>

                <div className="flex-1">
                  {entry.type === "attack" && (
                    <p
                      className={`text-sm ${getLogColor(entry.type, entry)}`}
                    >
                      <span className="font-bold">{entry.attacker}</span>{" "}
                      attacks <span className="font-bold">{entry.target}</span>{" "}
                      with{" "}
                      <span className="text-[#d9ca89]">{entry.attackName}</span>{" "}
                      → Rolled <span className="font-bold">{entry.roll}</span>{" "}
                      (+mod = {entry.total}) → {entry.hit ? "✓ HIT" : "✗ MISS"}
                    </p>
                  )}
                  {entry.type === "healing" && (
                    <p
                      className="text-sm text-green-400"
                    >
                      <span className="font-bold">{entry.target}</span> regains{" "}
                      <span className="font-bold">{entry.healing}</span> HP.
                    </p>
                  )}

                  {entry.type === "death" && (
                    <p
                      className="text-sm text-red-500 font-bold"
                    >
                      {entry.message}
                    </p>
                  )}

                  {entry.type === "damage" && (
                    <p
                      className={`text-sm ${getLogColor(entry.type, entry)}`}
                    >
                      <span className="font-bold">{entry.target}</span> takes{" "}
                      <span className="font-bold text-orange-400">
                        {entry.damage}
                      </span>{" "}
                      damage from{" "}
                      <span className="font-bold">{entry.attacker}</span>
                    </p>
                  )}

                  {entry.type === "round-end" && (
                    <p
                      className={`text-sm ${getLogColor(entry.type, entry)}`}
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {entry.message}
                    </p>
                  )}

                  {(entry.type === "combat-start" ||
                    entry.type === "combat-end") && (
                    <p
                      className={`text-sm font-bold ${getLogColor(
                        entry.type,
                        entry
                      )}`}
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {entry.message}
                    </p>
                  )}

                  <p
                    className="text-[10px] text-[#BF883C]/50 mt-1 uppercase tracking-wider"
                  >
                    {entry.timestamp} {entry.round && `• Round ${entry.round}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
