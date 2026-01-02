import { motion } from "framer-motion";
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
        "The fortress of Sunblight is an imposing structure carved into the mountainside. Its dark walls of worked stone rise hundreds of feet, crowned with battlements of ice. Smoke belches from chimneys, and the sound of hammering echoes across the valley.",
      part2:
        "From high above comes a loud grinding noise as large sheets of ice break off the fortress walls and tumble down the mountainside. Suddenly, great doors of ice previously hidden under snow stand open more than three hundred feet above you, and from between them flies a huge dragon made of dark ice. Its eyes glow with a bright golden light as it lets out a terrible roar, hurls itself into the air, and glides away from the fortress, then turns and heads north toward Ten-Towns.",
      prompt: "The dragon's roar still echoes in your ears. What do you do?",
    },
    danish: {
      part1:
        "Sunblight-fæstningen er en imponerende struktur hugget ind i bjergsiden. Dens mørke vægge af bearbejdet sten rejser sig hundredvis af fødder, kronet med brystværn af is. Røg vælter ud af skorstene, og lyden af hamring genlyder over dalen.",
      part2:
        "Fra højt oppe kommer en høj, malende lyd, mens store isplader bryder løs fra fæstningens vægge og tumler ned ad bjergsiden. Pludselig står store isdøre, tidligere skjult under sne, åbne mere end tre hundrede fod over jer, og fra mellem dem flyver en kæmpe drage lavet af mørk is. Dens øjne lyser med et klart gyldent lys, mens den udstøder et forfærdeligt brøl, kaster sig ud i luften og glider væk fra fæstningen, hvorefter den drejer og fortsætter nordpå mod Ten-Towns.",
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
                className="px-4 py-2 border-2 border-[#BF883C]/50 bg-black/40 text-[#BF883C] hover:bg-black/60 hover:border-[#d9ca89] hover:text-[#d9ca89] transition-all duration-300 text-sm uppercase tracking-wider cursor-pointer"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {language === "english"
                  ? "Switch to Danish"
                  : "Switch to English"}
              </button>
            </div>

            {/* Read-aloud text in two columns */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="border-2 border-[#BF883C]/30 bg-black/50 p-6">
                <p
                  className="text-lg text-[#d9ca89] leading-relaxed"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {text.part1}
                </p>
              </div>

              {/* Right Column */}
              <div className="border-2 border-[#BF883C]/30 bg-black/50 p-6">
                <p
                  className="text-lg text-[#d9ca89] leading-relaxed mb-4"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {text.part2}
                </p>
                <p
                  className="text-xl text-[#d9ca89] font-bold italic mt-6"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  {text.prompt}
                </p>
              </div>
            </div>

            {/* Reveal Button */}
            <div className="flex justify-center mt-8">
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
