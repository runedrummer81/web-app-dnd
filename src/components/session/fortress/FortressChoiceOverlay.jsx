import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFortress } from "./FortressContext";

export const FortressChoiceOverlay = ({ onChoiceSelect, isDMView = false }) => {
  const { fortressState, revealChoices } = useFortress();
  const [language, setLanguage] = useState("english"); // "english" or "danish"

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
          <PlayerChoiceContent
            onChoiceSelect={onChoiceSelect}
            isRevealed={fortressState.isRevealed}
          />
        </div>
      )}

      {/* DM View - Normal orientation */}
      {isDMView && (
        <div className="w-full h-full">
          <DMChoiceContent
            onChoiceSelect={onChoiceSelect}
            isRevealed={fortressState.isRevealed}
            onReveal={revealChoices}
            language={language}
            onLanguageToggle={() =>
              setLanguage((prev) => (prev === "english" ? "danish" : "english"))
            }
          />
        </div>
      )}
    </div>
  );
};

// Player View - Simple atmospheric title until revealed
const PlayerChoiceContent = ({ onChoiceSelect, isRevealed }) => {
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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12">
        {!isRevealed ? (
          // Before reveal - just title
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
        ) : (
          // After reveal - show choices
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <ChoiceButtons onChoiceSelect={onChoiceSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

// DM View - Read-aloud text, language toggle, and reveal button
const DMChoiceContent = ({
  onChoiceSelect,
  isRevealed,
  onReveal,
  language,
  onLanguageToggle,
}) => {
  const readAloudText = {
    english: {
      part1:
        "The climb carries you above the clouds, where the wind howls unchecked and the world feels raw and exposed. Ahead, the mountain wall rises sheer and merciless. Carved directly into the stone is a fortress. Sunblight is not a place of banners or beauty. It is gray rock gouged into shape, its walls bristling with narrow arrow slits where dim lights flicker like watchful eyes. From deep within the mountain comes the echo of hammer on anvil, a slow, tireless rhythm that vibrates through the stone beneath your boots. A narrow staircase clings to the cliff face, barely five feet wide, its steps glazed with ice. One misstep would send a body tumbling into the white abyss below. As you begin your ascent, the mountain shudders.",
      part2:
        "A deafening grind rolls down from above as great slabs of ice shear loose from the fortress walls and smash against the slopes. Snow pours down like an avalanche. Then, far overhead, something moves. Massive doors of ice tear open high in the fortress face. From the darkness between them erupts a dragon. Its body is forged of jagged black crystal and dark ice, veins of golden light pulsing beneath its surface like a corrupted heart. Its eyes blaze as it lets out a roar that sounds less like a beast and more like a weapon being unleashed. With a thunderous beat of its wings, the construct lifts into the air. Frost and stone rain from its frame as it circles once, distant and uncaring, before turning north. Toward Ten-Towns.",
      prompt: "The dragon's roar still echoes in your ears. What do you do?",
    },
    danish: {
      part1:
        "Som I bestiger bjerget, og stille og roligt når højere op end I nogensinde har været, så ser i det. Foran jer rejser bjergvæggen sig. Indhugget direkte i klippen ligger en kæmpe fæstning. Den er ikke prydet med faner eller lignende, men bestående af grå sten som er tvunget i form, og dens mure er gennembrudt af små pilleskår, hvor I lige kan skimte svage lys flakke. En smal trappe klamrer sig til klippevæggen, hvert trin er dækkes af is. Et forkert skridt og man forsvinder i den hvide afgrund nedenfor. Idet I begynder opstigningen og langsomt nærmer jer skælver bjerget under jer.",
      part2:
        "Øverst oppe ser I et par enorme isplader flå sig løs fra fæstningens mure som knuses mod bjergsiden. Sne styrter ned omkring jer, og pludselig ser I massive porte, belagt med is, stå åben. Ud fra dem bryder en drage frem. Dens krop er smedet af et sort metal, og under dens rustning ser I et pulserende gyldent lys. Som et slags fordærvet hjerte. Dens øjne ligner flammer, og dens brøl lyder ikke naturligt, men derimod mere mekanisk. Med et tordnende slag med vingerne sætter den i luften, den skal lige flyve op i en vis højde, før I ser den vender sig mod nord, og nu har retning direkte mod Ten-Towns.",
      prompt: "Dragens brøl genlyder stadig i jeres ører. Hvad gør I?",
    },
  };

  const text = readAloudText[language];

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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12">
        {!isRevealed ? (
          // Before reveal - Read-aloud text and reveal button
          <div className="max-w-6xl w-full space-y-8">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] text-center mb-8"
              style={{
                fontFamily: "EB Garamond, serif",
                textShadow:
                  "0 0 40px rgba(217,202,137,1), 0 0 80px rgba(217,202,137,0.6)",
              }}
            >
              As you Approach The Fortress...
            </motion.h1>

            {/* Language Toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onLanguageToggle}
                className="px-4 py-2  bg-black/40 text-[#BF883C] hover:bg-black/60 hover:border-[#d9ca89] hover:text-[#d9ca89] transition-all duration-300 text-sm uppercase tracking-wider cursor-pointer"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {language === "english" ? "DA" : "EN"}
              </button>
            </div>

            {/* Read-aloud text in two columns */}
            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-2 gap-8"
              >
                {/* Left Column */}
                <div className="p-6">
                  <p
                    className="text-lg text-[#d9ca89] leading-relaxed"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    {text.part1}
                  </p>
                </div>

                {/* Right Column */}
                <div className="p-6">
                  <p
                    className="text-lg text-[#d9ca89] leading-relaxed"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    {text.part2}
                  </p>
                </div>

                {/* Center text below both columns */}
                <p
                  className="col-span-2 text-center text-xl text-[#d9ca89] font-bold italic"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {text.prompt}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Reveal Button */}
            <div className="flex justify-center mt-20">
              <button
                onClick={onReveal}
                className="group relative px-12 py-5 border-4 border-[#BF883C] bg-black/60 hover:bg-black/40 hover:border-[#d9ca89] transition-all duration-300 cursor-pointer"
                style={{
                  boxShadow: "0 0 40px rgba(191,136,60,0.5)",
                }}
              >
                <span
                  className="text-3xl font-bold text-[#d9ca89] uppercase tracking-[0.3em] group-hover:text-[#f4e8d0] transition-colors"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "0 0 20px rgba(217,202,137,0.8)",
                  }}
                >
                  Reveal Options
                </span>
              </button>
            </div>
          </div>
        ) : (
          // After reveal - show choices side by side
          <div className="flex gap-8 w-full max-w-5xl">
            <ChoiceButtons onChoiceSelect={onChoiceSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

// Shared choice buttons component
const ChoiceButtons = ({ onChoiceSelect }) => {
  return (
    <>
      {/* Storm the Fortress - Active */}
      <motion.button
        onClick={() => onChoiceSelect("fortress")}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="group relative flex-1 p-8 border-4 border-[#BF883C] bg-black/60 hover:bg-black/40 hover:border-[#d9ca89] transition-all duration-300 cursor-pointer"
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
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative flex-1 p-8 border-4 border-gray-700/50 bg-black/80 cursor-not-allowed opacity-50"
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
    </>
  );
};
