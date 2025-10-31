import { motion } from "framer-motion";
import { useMapSync, RunSessionContext } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";
import { useContext, useState, useEffect } from "react";
import ActionButton from "../ActionButton";

export const MapControlsTab = ({ onStartCombat }) => {  const { mapState, updateMapState } = useMapSync();
  const { isSetupMode, exitSetupMode, activeEncounter, playerCount } =
    useCombatState();
  const runSessionContext = useContext(RunSessionContext);
  const sessionData = runSessionContext?.sessionData;

  // Determine current map type
  const getCurrentMap = () => {
    if (mapState.currentMapId === "world") return { isCombat: false };
    const combatMap = sessionData?.combatMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    return { isCombat: !!combatMap };
  };

  const currentMap = getCurrentMap();

  const gridSettings = mapState.gridSettings || {
    visible: true,
    size: 60,
    color: "#d9ca89",
    opacity: 0.3,
  };

  useEffect(() => {
    if (mapState.gridSettings?.visible === false) {
      updateMapState({
        gridSettings: { ...mapState.gridSettings, visible: true },
      });
    }
  }, []); // run once on mount

  useEffect(() => {
    const current = mapState.gridSettings || {};
    if (!current.visible || !current.size) {
      updateMapState({
        gridSettings: {
          ...current,
          visible: true,
          size: 60, // medium default
        },
      });
    }
  }, []); // run once on mount
  

  const [recentColors, setRecentColors] = useState([]);

  // Initialize recentColors with the current color
  useEffect(() => {
    if (gridSettings.color && !recentColors.includes(gridSettings.color)) {
      setRecentColors((prev) => [gridSettings.color, ...prev].slice(0, 4));
    }
  }, []); // run once on mount

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
    const newColor = e.target.value;
    handleUpdateGrid({ ...gridSettings, color: newColor });

    setRecentColors((prev) => {
      const updated = [newColor, ...prev.filter((c) => c !== newColor)];
      return updated.slice(0, 4);
    });
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
    if (isSetupMode) exitSetupMode();
    if (onStartCombat) onStartCombat(); // this now works!
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
    <div className="px-8 space-y-5">
      {/* Setup Mode Banner */}
      {isSetupMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <ActionButton
            onClick={handleStartCombat}
            size="lg"
            label="Start Combat"
            color="var(--secondary)"
            bgColor="var(--primary)"
            textColor="var(--dark-muted-bg)"
            showLeftArrow
            showRightArrow
            showGlow={false}
            animate
            animationDelay={0.2}
          />
        </motion.div>
      )}

      {/* Grid Toggle */}
      <section>
        <h3 className="text-[var(--secondary)] uppercase mb-3 text-sm">
          Grid System
        </h3>

        <motion.button
          onClick={toggleGrid}
          className={`w-full px-6 py-4 font-medium transition-all ${
            gridSettings.visible
              ? "border-2 border-[var(--secondary)] bg-[var(--primary)] text-[var(--dark-muted-bg)]"
              : "border-2 border-[var(--secondary)] hover:border-[var(--primary)] text-[var(--secondary)]"
          }`}
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

      {/* Grid Settings */}
      {gridSettings.visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Grid Size */}
          <section>
            <h3 className="text-[var(--secondary)] uppercase mb-3 text-sm">
              Grid Size
            </h3>
            <div>
              <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row gap-2 items-center">
                  <motion.button
                    onClick={() => handleSizeChange(-5)}
                    className="bg-[var(--secondary)] px-3 py-2 text-[var(--dark-muted-bg)] font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    -5
                  </motion.button>
                  <motion.button
                    onClick={() => handleSizeChange(-1)}
                    className="bg-[var(--secondary)] h-10 w-10 px-3 py-2 text-[var(--dark-muted-bg)] font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    -1
                  </motion.button>
                </div>

                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[var(--primary)]">
                    {gridSettings.size}
                  </span>
                  <p className="text-xs text-[var(--secondary)] mt-1 uppercase tracking-wider">
                    ≈ 5 feet per square
                  </p>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <motion.button
                    onClick={() => handleSizeChange(1)}
                    className="bg-[var(--secondary)] h-10 w-10 px-3 py-2 text-[var(--dark-muted-bg)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +1
                  </motion.button>
                  <motion.button
                    onClick={() => handleSizeChange(5)}
                    className="bg-[var(--secondary)] px-3 py-2 text-[var(--dark-muted-bg)] font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +5
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[40, 60, 80].map((size, i) => (
                  <motion.button
                    key={size}
                    onClick={() => handleUpdateGrid({ ...gridSettings, size })}
                    className={`px-3 py-2 uppercase font-medium text-sm ${
                      gridSettings.size === size
                        ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                        : "border-2 border-[var(--secondary)] text-[var(--secondary)]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {["Small", "Medium", "Large"][i]}
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          

          {/* Grid Opacity */}
          <section>
            <h3 className="text-[var(--secondary)] uppercase tracking-wider text-sm">
              Grid Opacity
            </h3>
            <div>
              <div className="text-center">
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
                className="w-full h-1 bg-[var(--secondary)]/30 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
            </div>
          </section>

          {/* Grid Color */}
          <section>
            <h3 className="text-[var(--secondary)] uppercase mb-3 text-sm">
              Grid Color
            </h3>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-3 mb-3">
                <input
                  type="color"
                  value={gridSettings.color}
                  onChange={handleColorChange}
                  className="w-22 h-22 cursor-pointer border-2 border-[var(--primary)] p-1 appearance-none"
                />
                <div className="flex-1 flex items-center">
                  <span
                    className="uppercase tracking-wider text-sm"
                    style={{ color: gridSettings.color }}
                  >
                    {gridSettings.color}
                  </span>
                </div>
              </div>

              {/* Color Palette */}
              <div className="flex flex-col gap-2">
                {/* Preset Colors */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: "#000000", title: "Black" },
                    { color: "#ffffff", title: "White" },
                    { color: "var(--primary)", title: "Primary" },
                    { color: "var(--secondary)", title: "Secondary" },
                  ].map(({ color, title }) => (
                    <motion.button
                      key={title}
                      onClick={() =>
                        handleUpdateGrid({ ...gridSettings, color })
                      }
                      className="w-10 h-10 border border-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                      style={{ backgroundColor: color }}
                      title={title}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>

                {/* Recently used colors */}
                <div className="grid grid-cols-4 gap-2">
                  {recentColors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() =>
                        handleUpdateGrid({ ...gridSettings, color })
                      }
                      className="w-10 h-10 border border-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      )}

      {/* Token Management */}
      <section className="border-t border-[var(--secondary)]/30 pt-6">
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
