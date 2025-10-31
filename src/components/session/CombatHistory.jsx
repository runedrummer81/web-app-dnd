import { motion } from "framer-motion";
import { useCombatState } from "./CombatStateContext";

export const CombatHistory = () => {
  const { combatLog, combatRound } = useCombatState();

  if (combatLog.length === 0) {
    return (
      <div className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider">
        No combat history yet
      </div>
    );
  }

  const getLogIcon = (type) => {
    switch (type) {
      case "combat-start":
        return "⚔️";
      case "attack-roll":
        return "🎲";
      case "damage-roll":
        return "💥";
      case "damage":
        return "🩸";
      case "healing":
        return "💚";
      case "death":
        return "💀";
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
      case "attack-roll":
        return entry.isCrit
          ? "text-yellow-400"
          : entry.isFail
          ? "text-red-400"
          : "text-blue-400";
      case "damage-roll":
        return entry.isCrit ? "text-yellow-400" : "text-orange-400";
      case "damage":
        return "text-red-400";
      case "healing":
        return "text-green-400";
      case "death":
        return "text-red-600";
      case "round-end":
        return "text-blue-400";
      case "combat-end":
        return "text-purple-400";
      default:
        return "text-[#d9ca89]";
    }
  };

  // Count statistics
  const totalDamage = combatLog
    .filter((e) => e.type === "damage")
    .reduce((sum, e) => sum + (e.damage || 0), 0);
  const totalHealing = combatLog
    .filter((e) => e.type === "healing")
    .reduce((sum, e) => sum + (e.healing || 0), 0);
  const totalKills = combatLog.filter((e) => e.type === "death").length;

  return (
    <div className="space-y-4 px-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 text-center border border-[var(--primary)]/30 bg-black/20">
          <p className="text-xs text-[var(--secondary)] uppercase mb-1">
            Round
          </p>
          <p className="text-2xl font-bold text-[var(--primary)]">
            {combatRound}
          </p>
        </div>

        <div className="p-3 text-center border border-orange-500/30 bg-orange-900/10">
          <p className="text-xs text-orange-400 uppercase mb-1">Damage</p>
          <p className="text-2xl font-bold text-orange-400">{totalDamage}</p>
        </div>

        <div className="p-3 text-center border border-green-500/30 bg-green-900/10">
          <p className="text-xs text-green-400 uppercase mb-1">Healing</p>
          <p className="text-2xl font-bold text-green-400">{totalHealing}</p>
        </div>

        <div className="p-3 text-center border border-red-500/30 bg-red-900/10">
          <p className="text-xs text-red-400 uppercase mb-1">Kills</p>
          <p className="text-2xl font-bold text-red-400">{totalKills}</p>
        </div>
      </div>

      {/* Combat Log */}
      <div>
        <h3 className="text-lg font-bold text-[var(--secondary)] uppercase mb-3">
          Combat Log
        </h3>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {[...combatLog].reverse().map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative border border-[var(--primary)]/20 bg-black/30 p-3 transition-all hover:border-[var(--primary)]/50"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getLogIcon(entry.type)}
                </span>

                <div className="flex-1">
                  {/* Attack Roll */}
                  {entry.type === "attack-roll" && (
                    <p className={`text-sm ${getLogColor(entry.type, entry)}`}>
                      <span className="font-bold">{entry.attacker}</span> rolls{" "}
                      <span className="text-[#d9ca89]">{entry.attackName}</span>{" "}
                      → <span className="font-bold text-lg">{entry.d20}</span> +{" "}
                      {entry.modifier} ={" "}
                      <span className="font-bold">{entry.total}</span>
                      {entry.isCrit && (
                        <span className="ml-2 text-yellow-400 font-bold">
                          ✨ CRITICAL HIT!
                        </span>
                      )}
                      {entry.isFail && (
                        <span className="ml-2 text-red-400 font-bold">
                          💔 CRITICAL MISS!
                        </span>
                      )}
                    </p>
                  )}

                  {/* Damage Roll */}
                  {entry.type === "damage-roll" && (
                    <p className={`text-sm ${getLogColor(entry.type, entry)}`}>
                      <span className="font-bold">{entry.attacker}</span> deals{" "}
                      <span className="font-bold text-orange-400 text-lg">
                        {entry.damage}
                      </span>{" "}
                      {entry.damageType} damage
                      {entry.isCrit && (
                        <span className="ml-2 text-yellow-400">
                          (Critical x2)
                        </span>
                      )}
                    </p>
                  )}

                  {/* Damage Taken */}
                  {entry.type === "damage" && (
                    <p className={`text-sm ${getLogColor(entry.type, entry)}`}>
                      <span className="font-bold">{entry.target}</span> takes{" "}
                      <span className="font-bold text-red-400">
                        {entry.damage}
                      </span>{" "}
                      damage
                    </p>
                  )}

                  {/* Healing */}
                  {entry.type === "healing" && (
                    <p className="text-sm text-green-400">
                      <span className="font-bold">{entry.target}</span> regains{" "}
                      <span className="font-bold">{entry.healing}</span> HP
                    </p>
                  )}

                  {/* Death */}
                  {entry.type === "death" && (
                    <p className="text-sm text-red-500 font-bold">
                      💀 <span className="font-bold">{entry.target}</span> has
                      been slain by{" "}
                      <span className="font-bold">{entry.killer}</span>!
                    </p>
                  )}

                  {/* Round End */}
                  {entry.type === "round-end" && (
                    <p className={`text-sm ${getLogColor(entry.type, entry)}`}>
                      {entry.message}
                    </p>
                  )}

                  {/* Combat Start/End */}
                  {(entry.type === "combat-start" ||
                    entry.type === "combat-end") && (
                    <p
                      className={`text-sm font-bold ${getLogColor(
                        entry.type,
                        entry
                      )}`}
                    >
                      {entry.message}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-[#BF883C]/50 mt-1 uppercase tracking-wider">
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
