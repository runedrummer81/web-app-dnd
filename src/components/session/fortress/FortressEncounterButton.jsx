import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const BossEncountersSection = ({ onBossClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Array of boss encounters - easy to add more in the future
  const bossEncounters = [
    {
      id: "sunblight-fortress",
      name: "Sunblight Fortress",
      subtitle: "Assault on Xardorok's Domain",
      imageUrl:
        "https://5e.tools/img/adventure/IDRotF/152-03-002.xardorok.webp",
    },
    // Add future bosses here:
    // {
    //   id: "future-boss-2",
    //   name: "Future Boss 2",
    //   subtitle: "Description here",
    //   imageUrl: "url-here",
    // }
  ];

  return (
    <section className="relative border-2 border-[#BF883C]/30 bg-black/20 overflow-hidden transition-all duration-300 hover:border-[#BF883C]">
      {/* Subtle background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(217,202,137,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group relative cursor-pointer"
      >
        <div className="relative z-10 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Arrow indicator - larger */}
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="text-[#BF883C] transition-colors duration-300 group-hover:text-[#d9ca89]"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M 8,6 L 16,12 L 8,18"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>

            <div className="text-left">
              {/* Title - larger and more prominent */}
              <h3
                className={`text-xl font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${
                  isExpanded
                    ? "text-[#d9ca89]"
                    : "text-[#BF883C] group-hover:text-[#d9ca89]"
                }`}
                style={{
                  fontFamily: "EB Garamond, serif",
                }}
              >
                Boss Encounters
              </h3>

              {/* Subtitle hint - only when collapsed */}
              {!isExpanded && (
                <p className="text-xs text-[#BF883C]/60 uppercase tracking-wider mt-1">
                  Epic story battles
                </p>
              )}
            </div>
          </div>

          {/* Count badge - styled like a notification */}
          {!isExpanded && bossEncounters.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="border border-[#BF883C]/40 bg-black/40 px-3 py-1">
                <span className="text-sm text-[#d9ca89] font-bold">
                  {bossEncounters.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Divider line when expanded */}
        {isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#BF883C]/30 to-transparent" />
        )}
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {bossEncounters.map((boss) => (
                <BossEncounterButton
                  key={boss.id}
                  name={boss.name}
                  subtitle={boss.subtitle}
                  imageUrl={boss.imageUrl}
                  onClick={() => onBossClick(boss.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Individual Boss Button Component
const BossEncounterButton = ({ name, subtitle, imageUrl, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full group overflow-hidden border-2 border-[#BF883C]/30 bg-black/40 transition-all duration-300 hover:border-[#d9ca89] cursor-pointer"
    >
      {/* Background Image - top 20% of the image stretched across full button */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "100% 500%", // Shows top 20% of image
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient overlay to blend image */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

      {/* Glow effect on hover only */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at top, rgba(217,202,137,0.15) 0%, transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Title */}
        <h4
          className="text-xl font-bold text-[#d9ca89] uppercase tracking-[0.25em] mb-1 group-hover:text-[#f4e8d0] transition-colors duration-300"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {name}
        </h4>

        {/* Subtitle */}
        <p
          className="text-sm text-[#BF883C] uppercase tracking-[0.2em] group-hover:text-[#d9ca89] transition-colors duration-300"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom border accent - only visible on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9ca89] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
