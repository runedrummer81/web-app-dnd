import { motion } from "framer-motion";
import { useMapSync, RunSessionContext } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";
import { useContext } from "react";

export const MapControlsTab = () => {
  const { mapState, updateMapState } = useMapSync();
  const { isSetupMode, exitSetupMode, activeEncounter, playerCount } =
    useCombatState();
  const runSessionContext = useContext(RunSessionContext);
  const sessionData = runSessionContext?.sessionData;

  // Get current map to check if it's a combat map
  const getCurrentMap = () => {
    if (mapState.currentMapId === "world") return { isCombat: false };

    const combatMap = sessionData?.combatMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (combatMap) return { isCombat: true };

    return { isCombat: false };
  };

  const currentMap = getCurrentMap();
  const gridSettings = mapState.gridSettings || {
    visible: false,
    size: 40,
    color: "#d9ca89",
    opacity: 0.3,
  };

  const handleUpdateGrid = (newGridSettings) => {
    updateMapState({ gridSettings: newGridSettings });
  };

  const handleSizeChange = (delta) => {
    const newSize = Math.max(20, Math.min(200, gridSettings.size + delta));
    handleUpdateGrid({ ...gridSettings, size: newSize });
  };

  const handleOpacityChange = (e) => {
    handleUpdateGrid({ ...gridSettings, opacity: parseFloat(e.target.value) });
  };

  const handleColorChange = (e) => {
    handleUpdateGrid({ ...gridSettings, color: e.target.value });
  };

  const toggleGrid = () => {
    handleUpdateGrid({ ...gridSettings, visible: !gridSettings.visible });
  };

  const handleRemoveToken = (tokenId) => {
    updateMapState({
      tokens: (mapState.tokens || []).filter((t) => t.id !== tokenId),
    });
  };

  const handleStartCombat = () => {
    if (isSetupMode) {
      exitSetupMode();
    }
  };

  if (!currentMap.isCombat) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--secondary)]">
        <div className="text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mx-auto mb-4 opacity-50"
          >
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="uppercase tracking-wider text-sm">
            Map controls only available on combat maps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Setup Mode Banner */}
      {isSetupMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/30 border-2 border-blue-500 p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-1">
                Setup Mode
              </p>
              <p className="text-blue-200/70 text-xs">
                Tokens have been placed. Adjust positions and grid as needed.
              </p>
            </div>
            <motion.button
              onClick={handleStartCombat}
              className="bg-gradient-to-r from-red-700 to-red-600 text-white border-2 border-yellow-400 px-6 py-3 font-bold uppercase tracking-wider"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(239,68,68,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Combat
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Grid Toggle */}
      <section>
        <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider mb-4 text-sm">
          Grid System
        </h3>

        <motion.button
          onClick={toggleGrid}
          className={`w-full px-6 py-4 rounded font-medium transition-all ${
            gridSettings.visible
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wider">
              {gridSettings.visible ? "Grid Enabled" : "Grid Disabled"}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {gridSettings.visible ? (
                <path d="M5 13l4 4L19 7" />
              ) : (
                <path d="M18 6L6 18M6 6l12 12" />
              )}
            </svg>
          </div>
        </motion.button>
      </section>

      {/* Grid Settings - Only show when enabled */}
      {gridSettings.visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Grid Size */}
          <section>
            <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider mb-3 text-sm">
              Grid Size
            </h3>
            <div className="bg-gray-800/50 p-4 rounded border border-[var(--secondary)]/30">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-[var(--primary)]">
                  {gridSettings.size}px
                </span>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  ≈ {Math.round(gridSettings.size / 20)} feet per square
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <motion.button
                  onClick={() => handleSizeChange(-5)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  -5
                </motion.button>
                <motion.button
                  onClick={() => handleSizeChange(-1)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  -1
                </motion.button>
                <motion.button
                  onClick={() => handleSizeChange(1)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  +1
                </motion.button>
                <motion.button
                  onClick={() => handleSizeChange(5)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  +5
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, size: 40 })
                  }
                  className={`px-3 py-2 rounded font-medium text-sm ${
                    gridSettings.size === 40
                      ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Small
                </motion.button>
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, size: 60 })
                  }
                  className={`px-3 py-2 rounded font-medium text-sm ${
                    gridSettings.size === 60
                      ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Medium
                </motion.button>
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, size: 80 })
                  }
                  className={`px-3 py-2 rounded font-medium text-sm ${
                    gridSettings.size === 80
                      ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Large
                </motion.button>
              </div>
            </div>
          </section>

          {/* Grid Opacity */}
          <section>
            <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider mb-3 text-sm">
              Grid Opacity
            </h3>
            <div className="bg-gray-800/50 p-4 rounded border border-[var(--secondary)]/30">
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {Math.round(gridSettings.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={gridSettings.opacity}
                onChange={handleOpacityChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
            </div>
          </section>

          {/* Grid Color */}
          <section>
            <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider mb-3 text-sm">
              Grid Color
            </h3>
            <div className="bg-gray-800/50 p-4 rounded border border-[var(--secondary)]/30">
              <div className="flex gap-3 mb-3">
                <input
                  type="color"
                  value={gridSettings.color}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded cursor-pointer border-2 border-gray-600"
                />
                <div className="flex-1 flex items-center">
                  <span className="text-[var(--secondary)] uppercase tracking-wider text-sm">
                    {gridSettings.color}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, color: "#d9ca89" })
                  }
                  className="w-full h-12 rounded border-2 border-gray-600 hover:border-[var(--primary)] transition-colors"
                  style={{ backgroundColor: "#d9ca89" }}
                  title="Gold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, color: "#ffffff" })
                  }
                  className="w-full h-12 rounded border-2 border-gray-600 hover:border-[var(--primary)] transition-colors"
                  style={{ backgroundColor: "#ffffff" }}
                  title="White"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, color: "#000000" })
                  }
                  className="w-full h-12 rounded border-2 border-gray-600 hover:border-[var(--primary)] transition-colors"
                  style={{ backgroundColor: "#000000" }}
                  title="Black"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.button
                  onClick={() =>
                    handleUpdateGrid({ ...gridSettings, color: "#ff0000" })
                  }
                  className="w-full h-12 rounded border-2 border-gray-600 hover:border-[var(--primary)] transition-colors"
                  style={{ backgroundColor: "#ff0000" }}
                  title="Red"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              </div>
            </div>
          </section>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded">
            <p className="text-blue-300 text-sm">
              💡 <span className="font-bold">Tip:</span> Adjust grid size to
              match your physical miniatures on the screen
            </p>
          </div>
        </motion.div>
      )}

      {/* Token Management */}
      <section className="border-t border-[var(--secondary)]/30 pt-6">
        <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider mb-3 text-sm">
          Active Tokens
        </h3>

        {/* Placed Tokens List */}
        <div className="mb-4 space-y-2 max-h-60 overflow-y-auto">
          {(mapState.tokens || []).map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between bg-gray-800/50 p-3 border border-[var(--secondary)]/30"
            >
              <div className="flex items-center gap-3">
                <img
                  src={token.imageUrl}
                  alt={token.name}
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    borderColor: token.isPlayer ? "#4ade80" : "#ef4444",
                  }}
                />
                <span className="text-[var(--secondary)]">{token.name}</span>
              </div>
              <button
                onClick={() => handleRemoveToken(token.id)}
                className="text-red-400 hover:text-red-300 transition"
              >
                ✕
              </button>
            </div>
          ))}
          {(!mapState.tokens || mapState.tokens.length === 0) && (
            <p className="text-[var(--secondary)]/60 italic text-center py-4">
              No tokens on map
            </p>
          )}
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded">
          <p className="text-blue-300 text-sm">
            ℹ️ <span className="font-bold">Note:</span> Tokens are automatically
            placed when combat starts. Drag them to reposition.
          </p>
        </div>
      </section>
    </div>
  );
};
