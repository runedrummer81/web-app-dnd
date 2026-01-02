import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFortress } from "./FortressContext";
import { useMapSync } from "../MapSyncContext";
import { FORTRESS_LEVELS } from "./data/sunblightFortressData";

export const FortressDMPanel = ({ onEndEncounter }) => {
  const [activeTab, setActiveTab] = useState("map-controls"); // Start on map-controls to show fog controls
  const { fortressState } = useFortress();

  // Fortress-specific tabs
  const fortressTabs = [
    {
      id: "current-room",
      label: "Current Room",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "map-controls",
      label: "Map Controls",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "fortress-info",
      label: "Fortress Info",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "notes",
      label: "Notes",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-full bg-[var(--dark-muted-bg)] text-gray-100 flex flex-col relative overflow-hidden">
      {/* Header with Book Marker Tabs */}
      <div className="relative flex-shrink-0">
        {/* Bookmark Tabs - Flag shaped */}
        <div className="flex justify-center gap-2 px-15 pt-2">
          {fortressTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-4 transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--secondary)]"
              }`}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
                boxShadow:
                  activeTab === tab.id
                    ? "0 4px 12px rgba(191,136,60,0.4), inset 0 -2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              whileHover={{ y: activeTab === tab.id ? 0 : -2 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Icon */}
              <div
                className={`mb-1 flex justify-center ${
                  activeTab === tab.id
                    ? "text-[var(--dark-muted-bg)]"
                    : "text-[var(--primary)] group-hover:text-[#d9ca89]"
                }`}
              >
                {tab.icon}
              </div>

              {/* Small label text */}
              <span
                className={`text-[8px] font-bold uppercase tracking-[0.15em] block text-center ${
                  activeTab === tab.id
                    ? "text-[var(--dark-muted-bg)]"
                    : "text-[var(--primary)] group-hover:text-[#d9ca89]"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          ))}

          {/* END TAB - Matches your existing END tab exactly */}
          <motion.button
            onClick={onEndEncounter}
            className="relative flex-1 py-4 transition-all duration-300 
              bg-gradient-to-b from-red-700 to-red-900 
              hover:from-red-600 hover:to-red-800 
              text-[#f8eac7] font-bold uppercase tracking-[0.15em]
              shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)]
              cursor-pointer"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
              boxShadow:
                "0 4px 12px rgba(239,68,68,0.5), inset 0 -2px 8px rgba(0,0,0,0.3)",
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-1 flex justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f8eac7"
                strokeWidth="2"
                className="drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]"
              >
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
            </div>

            <span className="text-[8px] font-bold uppercase tracking-[0.15em] block text-center text-[#f8eac7]">
              End
            </span>
          </motion.button>
        </div>

        {/* Active Tab Title with Glow */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-4 px-6"
        >
          <h1
            className="text-2xl lg:text-3xl font-bold uppercase tracking-[0.3em] text-center text-[#d9ca89]"
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow:
                "0 0 25px rgba(217,202,137,0.6), 0 0 50px rgba(217,202,137,0.3)",
            }}
          >
            {fortressTabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <motion.div
            className="h-[2px] w-48 mt-2 mx-auto bg-gradient-to-r from-transparent via-[#d9ca89] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {activeTab === "current-room" && (
            <motion.div
              key="current-room"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 space-y-6"
            >
              <CurrentRoomTab />
            </motion.div>
          )}

          {activeTab === "map-controls" && (
            <motion.div
              key="map-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 space-y-6"
            >
              <MapControlsTab />
            </motion.div>
          )}

          {activeTab === "fortress-info" && (
            <motion.div
              key="fortress-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 space-y-6"
            >
              <FortressInfoTab />
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6"
            >
              <NotesTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Current Room Tab
const CurrentRoomTab = () => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <h3
          className="text-2xl font-bold text-[#d9ca89] uppercase tracking-wider mb-2"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          X1: Entrance
        </h3>
        <p className="text-[#d9ca89]/80 text-sm italic mb-4">
          A ten-foot-high double door of featureless stone...
        </p>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 border border-[#BF883C] text-[#BF883C] hover:bg-[#BF883C]/20 text-sm uppercase cursor-pointer transition-all">
            Reveal Room
          </button>
          <button className="px-4 py-2 border border-[#BF883C] text-[#BF883C] hover:bg-[#BF883C]/20 text-sm uppercase cursor-pointer transition-all">
            Read Aloud
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="border-2 border-[#BF883C]/20 bg-black/10 p-3">
        <h4
          className="text-lg font-bold text-[#d9ca89] mb-2"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Features
        </h4>
        <ul className="text-[#d9ca89]/70 text-sm space-y-1">
          <li>• Stone double doors (barred from within)</li>
          <li>• Iron portcullis (lowered)</li>
          <li>• Arrow slit (three-quarters cover)</li>
        </ul>
      </div>

      {/* Special Mechanics */}
      <div className="border-2 border-yellow-600/30 bg-yellow-900/10 p-3">
        <h4
          className="text-lg font-bold text-yellow-400 mb-2"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          ⚠️ Special
        </h4>
        <p className="text-yellow-300/80 text-sm">
          Duergar in X6 watches invisibly. Loyal to Grandolpha - will secretly
          help party.
        </p>
      </div>
    </div>
  );
};

// Map Controls Tab - WITH FOG OF WAR CONTROLS
const MapControlsTab = () => {
  const [currentLevel, setCurrentLevel] = useState(FORTRESS_LEVELS.COMMAND);
  const { mapState, updateMapState } = useMapSync();

  const fogSettings = mapState.fogOfWar || {
    enabled: false,
    isDrawing: false,
    brushSize: 100,
  };

  const toggleFogEnabled = () => {
    updateMapState({
      fogOfWar: {
        ...fogSettings,
        enabled: !fogSettings.enabled,
        isDrawing: false, // Reset to pan mode when toggling
      },
    });
  };

  const toggleFogDrawMode = () => {
    updateMapState({
      fogOfWar: {
        ...fogSettings,
        isDrawing: !fogSettings.isDrawing,
      },
    });
  };

  const setBrushSize = (size) => {
    updateMapState({
      fogOfWar: {
        ...fogSettings,
        brushSize: size,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Level Switcher */}
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <h3
          className="text-lg font-bold text-[#d9ca89] uppercase mb-3"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Fortress Level
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              level: FORTRESS_LEVELS.ICE_GATE,
              label: "Ice Gate",
              sub: "(Top)",
            },
            {
              level: FORTRESS_LEVELS.COMMAND,
              label: "Command",
              sub: "(Middle)",
            },
            { level: FORTRESS_LEVELS.FORGE, label: "Forge", sub: "(Bottom)" },
          ].map(({ level, label, sub }) => (
            <button
              key={level}
              onClick={() => setCurrentLevel(level)}
              className={`py-3 px-2 border-2 transition-all text-sm uppercase cursor-pointer ${
                currentLevel === level
                  ? "border-[#d9ca89] bg-[#d9ca89]/20 text-[#d9ca89]"
                  : "border-[#BF883C]/30 text-[#BF883C] hover:border-[#BF883C]"
              }`}
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              {label}
              <br />
              <span className="text-xs">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Fog of War Controls */}
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-bold text-[#d9ca89] uppercase"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Fog of War
          </h3>
          <button
            onClick={toggleFogEnabled}
            className={`px-4 py-2 border-2 transition-all text-sm uppercase cursor-pointer ${
              fogSettings.enabled
                ? "border-green-500 bg-green-900/30 text-green-400"
                : "border-gray-500 bg-gray-900/30 text-gray-400"
            }`}
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {fogSettings.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {fogSettings.enabled && (
          <div className="space-y-4 border-t-2 border-[#BF883C]/20 pt-4 mt-4">
            {/* Mode Toggle */}
            <div className="bg-black/40 border-2 border-[#BF883C]/30 p-4">
              <h4
                className="text-sm font-bold text-[#d9ca89] mb-3 uppercase"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                Current Mode
              </h4>
              <button
                onClick={toggleFogDrawMode}
                className={`w-full py-3 px-4 border-2 transition-all uppercase font-bold tracking-wider cursor-pointer ${
                  fogSettings.isDrawing
                    ? "border-yellow-500 bg-yellow-900/30 text-yellow-400"
                    : "border-blue-500 bg-blue-900/30 text-blue-400"
                }`}
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {fogSettings.isDrawing ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 19l7-7 3 3-7 7-3-3z" />
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    </svg>
                    🎨 Fog Reveal Mode
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3" />
                    </svg>
                    🗺️ Pan Mode
                  </div>
                )}
              </button>
              <p
                className="text-xs text-[#BF883C]/70 mt-2 text-center"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {fogSettings.isDrawing
                  ? "Click & drag on map to reveal areas"
                  : "Click & drag to pan the map"}
              </p>
            </div>

            {/* Brush Size */}
            {fogSettings.isDrawing && (
              <div className="bg-black/40 border-2 border-[#BF883C]/30 p-4">
                <h4
                  className="text-sm font-bold text-[#d9ca89] mb-3 uppercase flex items-center justify-between"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  <span>Brush Size</span>
                  <span className="text-[#BF883C]">
                    {fogSettings.brushSize}px
                  </span>
                </h4>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={fogSettings.brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#BF883C]/30 rounded-lg appearance-none cursor-pointer accent-[#d9ca89]"
                />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[50, 100, 150].map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`py-2 px-3 text-xs uppercase font-bold transition-all cursor-pointer ${
                        fogSettings.brushSize === size
                          ? "bg-[#d9ca89] text-[var(--dark-muted-bg)]"
                          : "border-2 border-[#BF883C] text-[#BF883C] hover:bg-[#BF883C]/20"
                      }`}
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      {["Small", "Medium", "Large"][i]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Fortress Info Tab
const FortressInfoTab = () => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <h3
          className="text-xl font-bold text-[#d9ca89] uppercase mb-3"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Mission Objectives
        </h3>
        <ul
          className="space-y-2 text-[#d9ca89]/80"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          <li>🎯 Confront Xardorok Sunblight</li>
          <li>🎯 Prevent further dragon attacks</li>
          <li>🎯 Investigate the fortress</li>
        </ul>
      </div>

      <div className="border-2 border-[#BF883C]/30 bg-black/20 p-4">
        <h3
          className="text-xl font-bold text-[#d9ca89] uppercase mb-3"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Key NPCs
        </h3>
        <ul
          className="space-y-2 text-[#d9ca89]/80 text-sm"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          <li>
            <strong>Xardorok Sunblight:</strong> Duergar leader, forge master
          </li>
          <li>
            <strong>Grandolpha Muzgardt:</strong> Secret ally in fortress
          </li>
        </ul>
      </div>
    </div>
  );
};

// Notes Tab
const NotesTab = () => {
  const [notes, setNotes] = useState("");

  return (
    <div className="h-full flex flex-col">
      <h3
        className="text-lg font-bold text-[#d9ca89] uppercase mb-3"
        style={{ fontFamily: "EB Garamond, serif" }}
      >
        Fortress Notes
      </h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="flex-1 bg-black/40 border-2 border-[#BF883C]/30 text-[#d9ca89] p-3 resize-none focus:outline-none focus:border-[#BF883C]"
        placeholder="Take notes about the fortress encounter..."
        style={{ fontFamily: "EB Garamond, serif" }}
      />
    </div>
  );
};
