// ActiveSummonsPanel.jsx - STREAMLINED & COLLAPSED BY DEFAULT
// Compact, space-efficient design
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const ActiveSummonsPanel = ({
  activeSummons,
  onDispelSingle,
  onDispelAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group summons by summoner
  const summonsBySummoner = activeSummons.reduce((acc, summon) => {
    if (!acc[summon.summonedBy]) {
      acc[summon.summonedBy] = [];
    }
    acc[summon.summonedBy].push(summon);
    return acc;
  }, {});

  const summonerNames = Object.keys(summonsBySummoner);
  const totalSummons = activeSummons.length;

  if (summonerNames.length === 0) return null;

  return (
    <div className="px-6 pb-3">
      <div
        className="bg-black/60 border border-[#BF883C]/40"
        style={{
          boxShadow: "inset 0 1px 0 rgba(191, 136, 60, 0.2)",
        }}
      >
        {/* Collapsed Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3 py-2 flex items-center justify-between group transition-all"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(191, 136, 60, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div className="flex items-center gap-3">
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-[#BF883C]"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M 9,6 L 15,12 L 9,18"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="square"
              />
            </motion.svg>
            <span className="text-[#BF883C] font-bold text-xs uppercase tracking-wider group-hover:text-[#D9CA89] transition-colors">
              Active Summons
            </span>
            <span className="text-[#D9CA89]/60 text-xs">
              ({totalSummons} creature{totalSummons !== 1 ? "s" : ""})
            </span>
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[#BF883C]/20"
            >
              <div className="p-3 space-y-3">
                {summonerNames.map((summonerName) => {
                  const summons = summonsBySummoner[summonerName];
                  return (
                    <div key={summonerName} className="space-y-1">
                      {/* Summoner Header */}
                      <div
                        className="flex items-center justify-between bg-black/40 border border-[#BF883C]/20 px-2 py-1"
                        style={{
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <span className="text-[#D9CA89] font-bold text-xs uppercase tracking-wide">
                          {summonerName} ({summons.length})
                        </span>
                        <button
                          onClick={() => onDispelAll(summonerName)}
                          className="px-2 py-0.5 bg-black/60 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wide transition-all"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgb(185, 28, 28)";
                            e.currentTarget.style.boxShadow =
                              "0 0 10px rgba(185, 28, 28, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(185, 28, 28, 0.6)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Dispel All
                        </button>
                      </div>

                      {/* Individual Summons - Compact List */}
                      <div className="pl-3 space-y-0.5">
                        {summons.map((summon) => (
                          <div
                            key={summon.id}
                            className="flex items-center justify-between bg-black/20 px-2 py-0.5 border-l-2 border-[#BF883C]/20"
                          >
                            <span className="text-[#D9CA89]/70 text-xs">
                              {summon.name}
                            </span>
                            <button
                              onClick={() => onDispelSingle(summon.id)}
                              className="px-1.5 py-0.5 text-red-400/80 text-xs font-bold uppercase tracking-wide transition-colors hover:text-red-400"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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
