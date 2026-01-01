import { motion } from "framer-motion";

export const FortressChoiceOverlay = ({ onChoiceSelect, isDMView = false }) => {
  return (
    <div className="fixed inset-0 bg-black z-[9999]">
      {/* Player View - Rotated 90° counter-clockwise */}
      {!isDMView && (
        <div
          className="absolute inset-0"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
            width: "100vh",
            height: "100vw",
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: "-50vh",
            marginTop: "-50vw",
          }}
        >
          <ChoiceContent onChoiceSelect={onChoiceSelect} />
        </div>
      )}

      {/* DM View - Normal orientation */}
      {isDMView && (
        <div className="w-full h-full">
          <ChoiceContent onChoiceSelect={onChoiceSelect} />
        </div>
      )}
    </div>
  );
};

// Shared content component
const ChoiceContent = ({ onChoiceSelect }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://5e.tools/img/adventure/IDRotF/147-03-000.chapter-splash.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] text-center"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow:
              "0 0 40px rgba(217,202,137,1), 0 0 80px rgba(217,202,137,0.6)",
          }}
        >
          As you Approach
          <br />
          The Fortress...
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl text-[#d9ca89]/90 text-center max-w-4xl leading-relaxed"
          style={{
            fontFamily: "EB Garamond, serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          As the massive gates open, Xardorok's weapon of destruction soars
          toward Ten-Towns. Your choice will determine the fate of thousands.
        </motion.p>

        {/* Choice Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-2xl mt-12">
          {/* Storm the Fortress - Active */}
          <motion.button
            onClick={() => onChoiceSelect("fortress")}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="group relative w-full p-8 border-4 border-[#BF883C] bg-black/60 hover:bg-black/40 hover:border-[#d9ca89] transition-all duration-300 cursor-pointer"
            style={{
              boxShadow: "0 0 30px rgba(191,136,60,0.4)",
            }}
          >
            <h2
              className="text-4xl font-bold text-[#d9ca89] uppercase tracking-[0.25em] mb-3 group-hover:text-[#f4e8d0] transition-colors"
              style={{
                fontFamily: "EB Garamond, serif",
                textShadow: "0 0 20px rgba(217,202,137,0.8)",
              }}
            >
              Storm the Fortress
            </h2>
            <p
              className="text-xl text-[#BF883C] group-hover:text-[#d9ca89] transition-colors"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Infiltrate the duergar stronghold and confront Xardorok Sunblight
            </p>

            {/* Hover glow effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(217,202,137,0.1) 0%, transparent 70%)",
              }}
            />
          </motion.button>

          {/* Chase the Dragon - Disabled */}
          <motion.button
            disabled
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="relative w-full p-8 border-4 border-gray-700/50 bg-black/80 cursor-not-allowed opacity-50"
          >
            <h2
              className="text-4xl font-bold text-gray-500 uppercase tracking-[0.25em] mb-3"
              style={{
                fontFamily: "EB Garamond, serif",
              }}
            >
              Chase the Dragon
            </h2>
            <p
              className="text-xl text-gray-600"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Race to save Ten-Towns from annihilation
            </p>
            <p
              className="text-sm text-gray-500 italic mt-3"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              (Coming in future update)
            </p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
