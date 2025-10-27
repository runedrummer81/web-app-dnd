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
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border-2 border-[#BF883C]/30 bg-gradient-to-br from-[#1a1814] to-[#151612] p-4 text-center">
          <p
            className="text-xs text-[#BF883C]/70 uppercase tracking-wider mb-2"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Current Round
          </p>
          <p
            className="text-3xl font-bold text-red-400"
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow: "0 0 15px rgba(239,68,68,0.4)",
            }}
          >
            {combatRound}
          </p>
        </div>

        <div className="border-2 border-[#BF883C]/30 bg-gradient-to-br from-[#1a1814] to-[#151612] p-4 text-center">
          <p
            className="text-xs text-[#BF883C]/70 uppercase tracking-wider mb-2"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Total Actions
          </p>
          <p
            className="text-3xl font-bold text-[#d9ca89]"
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow: "0 0 15px rgba(217,202,137,0.4)",
            }}
          >
            {combatLog.length}
          </p>
        </div>
      </div>

      {/* Combat Log */}
      <div>
        <h3
          className="text-lg font-bold text-[#d9ca89] uppercase tracking-wider mb-3"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 0 10px rgba(217,202,137,0.3)",
          }}
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
              className="relative border-2 border-[#BF883C]/20 bg-[#151612]/50 p-3 hover:border-[#BF883C]/40 transition-all"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#d9ca89]/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#d9ca89]/30" />

              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getLogIcon(entry.type)}
                </span>

                <div className="flex-1">
                  {entry.type === "attack" && (
                    <p
                      className={`text-sm ${getLogColor(entry.type, entry)}`}
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      <span className="font-bold">{entry.attacker}</span>{" "}
                      attacks <span className="font-bold">{entry.target}</span>{" "}
                      with{" "}
                      <span className="text-[#d9ca89]">{entry.attackName}</span>{" "}
                      → Rolled <span className="font-bold">{entry.roll}</span>{" "}
                      (+mod = {entry.total}) → {entry.hit ? "✓ HIT" : "✗ MISS"}
                    </p>
                  )}

                  {entry.type === "damage" && (
                    <p
                      className={`text-sm ${getLogColor(entry.type, entry)}`}
                      style={{ fontFamily: "EB Garamond, serif" }}
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
                    style={{ fontFamily: "EB Garamond, serif" }}
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
