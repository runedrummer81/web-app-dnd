import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFortress } from "../FortressContext";
import { fortressRooms, FORTRESS_LEVELS } from "../data/sunblightFortressData";

export const CurrentRoomTab = () => {
  const { fortressState, setCurrentRoom } = useFortress();
  const [language, setLanguage] = useState("en");
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  // Get current room data
  const currentRoom =
    fortressRooms[fortressState.currentRoom] || fortressRooms["X1"];

  // Organize rooms by level
  const roomsByLevel = {
    [FORTRESS_LEVELS.ICE_GATE]: [],
    [FORTRESS_LEVELS.COMMAND]: [],
    [FORTRESS_LEVELS.FORGE]: [],
  };

  Object.values(fortressRooms).forEach((room) => {
    roomsByLevel[room.level].push(room);
  });

  const levelNames = {
    [FORTRESS_LEVELS.ICE_GATE]: "Ice Gate Level (Top)",
    [FORTRESS_LEVELS.COMMAND]: "Command Level (Middle)",
    [FORTRESS_LEVELS.FORGE]: "Forge Level (Bottom)",
  };

  return (
    <div className="space-y-4">
      {/* Room Selector Button */}
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-md font-bold text-[#d9ca89]/80 uppercase"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Players location
          </h3>
          <button
            onClick={() => setShowRoomSelector(!showRoomSelector)}
            className="px-3 py-1 border-2 border-[#BF883C] text-[#BF883C] hover:bg-[#BF883C]/20 text-xs uppercase cursor-pointer transition-all"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {showRoomSelector ? "Hide Selector" : "Change Room"}
          </button>
        </div>

        {/* Current Room Display */}
        <div>
          <h2
            className="text-2xl font-bold text-[#d9ca89] uppercase tracking-wider"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {currentRoom.id}: {currentRoom.name}
          </h2>
          <p className="text-[#BF883C] text-sm mt-1 uppercase">
            {levelNames[currentRoom.level]}
          </p>
        </div>

        {/* Room Selector Dropdown */}
        <AnimatePresence>
          {showRoomSelector && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-3"
            >
              <div className="max-h-96 overflow-y-auto">
                {/* Loop through each level */}
                {Object.entries(roomsByLevel).map(([level, rooms]) => (
                  <div key={level} className="mb-4 last:mb-0">
                    <h4
                      className="text-sm font-bold text-[#d9ca89] uppercase mb-2 pb-1 "
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {levelNames[level]}
                    </h4>
                    <div className="grid grid-cols-4 gap-1">
                      {rooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => {
                            setCurrentRoom(room.id);
                            setShowRoomSelector(false);
                          }}
                          className={`py-2 px-1 text-xs uppercase font-bold transition-all cursor-pointer ${
                            currentRoom.id === room.id
                              ? "bg-[#d9ca89] text-[var(--dark-muted-bg)]"
                              : "border border-[#BF883C]/30 text-[#BF883C] hover:bg-[#BF883C]/20"
                          }`}
                          style={{ fontFamily: "EB Garamond, serif" }}
                        >
                          {room.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Read-Aloud Description */}
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-lg font-bold text-[#d9ca89] uppercase"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Read Aloud
          </h3>
          <button
            onClick={() => setLanguage(language === "en" ? "da" : "en")}
            className="px-3 py-1 border-2 border-[#BF883C] text-[#BF883C] hover:bg-[#BF883C]/20 text-xs uppercase cursor-pointer transition-all"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {language === "en" ? "DK" : "EN"}
          </button>
        </div>
        <div>
          <p
            className="text-[#BF883C] text-md leading-relaxed"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {currentRoom.readAloud[language]}
          </p>
        </div>
      </div>

      {/* DM Only Section */}
      <div className="border-2 border-red-600/30 bg-black/80 p-4">
        <h3
          className="text-lg font-bold text-red-400 uppercase mb-3 flex items-center gap-2"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          DM Knowledge
        </h3>
        <div>
          <div
            className="text-red-300/90 text-md leading-relaxed prose prose-invert prose-sm max-w-none"
            style={{ fontFamily: "EB Garamond, serif" }}
            dangerouslySetInnerHTML={{
              __html: currentRoom.dmNotes[language]
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-red-400">$1</strong>'
                )
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      </div>

      {/* Enemies Section (if any) */}
      {currentRoom.enemies && currentRoom.enemies.length > 0 && (
        <div className="border-2 border-orange-600/30 bg-orange-900/10 p-4">
          <h3
            className="text-lg font-bold text-orange-400 uppercase mb-3"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            ⚔️ Enemies
          </h3>
          <ul className="space-y-1">
            {currentRoom.enemies.map((enemy, index) => (
              <li
                key={index}
                className="text-orange-300/90 text-sm"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                • {enemy}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loot Section (if any) */}
      {currentRoom.loot && currentRoom.loot.length > 0 && (
        <div className="border-2 border-yellow-600/30 bg-yellow-900/10 p-4">
          <h3
            className="text-lg font-bold text-yellow-400 uppercase mb-3"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Treasure & Loot
          </h3>
          <ul className="space-y-1">
            {currentRoom.loot.map((item, index) => (
              <li
                key={index}
                className="text-yellow-300/90 text-md"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
