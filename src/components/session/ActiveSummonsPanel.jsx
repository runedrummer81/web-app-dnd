// ActiveSummonsPanel.jsx
// Always-visible summon management panel
// Works on ANY turn - allows dispelling summons at any time
import { motion } from "framer-motion";

export const ActiveSummonsPanel = ({
  activeSummons,
  onDispelSingle,
  onDispelAll,
}) => {
  // Group summons by summoner
  const summonsBySummoner = activeSummons.reduce((acc, summon) => {
    if (!acc[summon.summonedBy]) {
      acc[summon.summonedBy] = [];
    }
    acc[summon.summonedBy].push(summon);
    return acc;
  }, {});

  const summonerNames = Object.keys(summonsBySummoner);

  if (summonerNames.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="px-6 pb-4"
    >
      <div className="bg-purple-900/20 border-2 border-purple-500/50 p-4">
        <h3 className="text-purple-300 font-bold uppercase tracking-wider text-sm mb-3">
          Active Summons - All Players
        </h3>

        <div className="space-y-4">
          {summonerNames.map((summonerName) => {
            const summons = summonsBySummoner[summonerName];
            return (
              <div key={summonerName} className="space-y-2">
                {/* Summoner Header */}
                <div className="flex items-center justify-between bg-purple-900/30 border border-purple-500/30 px-3 py-2 rounded">
                  <span className="text-purple-200 font-bold text-sm">
                    {summonerName} ({summons.length} summons)
                  </span>
                  <motion.button
                    onClick={() => onDispelAll(summonerName)}
                    className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-xs font-bold uppercase border border-red-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dispel All
                  </motion.button>
                </div>

                {/* Individual Summons */}
                <div className="space-y-1 pl-4">
                  {summons.map((summon) => (
                    <div
                      key={summon.id}
                      className="flex items-center justify-between bg-purple-900/20 border border-purple-500/20 px-2 py-1 rounded"
                    >
                      <span className="text-purple-200 text-xs">
                        {summon.name}
                      </span>
                      <motion.button
                        onClick={() => onDispelSingle(summon.id)}
                        className="px-2 py-0.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold uppercase border border-red-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Dispel
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
