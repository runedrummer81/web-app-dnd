import { useState } from "react";
import { RouteManager } from "./RouteManager";
import { SessionNotes } from "./SessionNotes";
import { DiceRoller } from "./DiceRoller";
import { CombatTab } from "./CombatTab";
import { InitiativeTracker } from "./InitiativeTracker";
import { CombatHistory } from "./CombatHistory";
import { useMapSync } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ConfirmEndSessionModal } from "./ConfirmEndSessionModal";

export const DMPanel = ({
  sessionData,
  mapSetData,
  onMapSwitch,
  currentMapId,
  weather,
  onWeatherChange,
  isPlayerWindowOpen,
  onEndSessionClick,
}) => {
  const { mapState, updateMapState } = useMapSync();
  const { combatActive, endCombat } = useCombatState();
  const [activeTab, setActiveTab] = useState("overview");
  const [notesOpen, setNotesOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [routesOpen, setRoutesOpen] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [quickNotes, setQuickNotes] = useState(sessionData?.sessionNotes || []);

  const handleEndSession = async () => {
    try {
      await updateDoc(doc(db, "Sessions", sessionData.id), {
        sessionNotes: quickNotes, // save the current notes
      });
      console.log("Session notes saved!");
      // Optionally close the DM panel or do other cleanup
      setShowEndSessionConfirm(false);
    } catch (err) {
      console.error("Error saving session notes:", err);
    }
  };

  // Normal state tabs
  const normalTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "maps",
      label: "Maps",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: "encounters",
      label: "Encounters",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: "combat",
      label: "Combat",
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
  ];

  // Combat state tabs
  const combatTabs = [
    {
      id: "initiative",
      label: "Initiative",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "history",
      label: "History",
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

  const tabs = combatActive ? combatTabs : normalTabs;

  // When entering combat, switch to initiative tab
  if (combatActive && activeTab !== "initiative" && activeTab !== "history") {
    setActiveTab("initiative");
  }

  const toggleWeather = (type) => {
    if (type === "timeOfDay") {
      onWeatherChange({
        ...weather,
        timeOfDay: weather.timeOfDay === "day" ? "night" : "day",
        aurora: weather.timeOfDay === "day" ? weather.aurora : false,
      });
    } else {
      onWeatherChange({
        ...weather,
        [type]: !weather[type],
      });
    }
  };

  const activeWeatherCount = [
    weather.timeOfDay === "night",
    weather.snow,
    weather.aurora,
  ].filter(Boolean).length;

  return (
    <div className="h-full bg-[#151612] text-gray-100 flex flex-col relative overflow-hidden z-1">
      {/* Header with Book Marker Tabs */}
      <div
        className={`relative flex-shrink-0 ${isPlayerWindowOpen ? "" : "pt-6"}`}
      >
        {/* Bookmark Tabs - Flag shaped */}
        <div className="flex gap-1 px-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-3 py-4 transition-all duration-300 group ${
                activeTab === tab.id
                  ? combatActive
                    ? "bg-gradient-to-b from-red-700 to-red-900"
                    : "bg-gradient-to-b from-[#BF883C] to-[#8b6429]"
                  : "bg-gradient-to-b from-[#3d3426] to-[#2a2419] hover:from-[#4a3f2d] hover:to-[#342d1f]"
              }`}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
                boxShadow:
                  activeTab === tab.id
                    ? combatActive
                      ? "0 4px 12px rgba(239,68,68,0.5), inset 0 -2px 8px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(191,136,60,0.4), inset 0 -2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
              }}
              whileHover={{ y: activeTab === tab.id ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Icon */}
              <div
                className={`mb-1 flex justify-center ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-[#BF883C] group-hover:text-[#d9ca89]"
                }`}
              >
                {tab.icon}
              </div>

              {/* Small label text */}
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.15em] block text-center ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-[#BF883C] group-hover:text-[#d9ca89]"
                }`}
                style={{
                  fontFamily: "EB Garamond, serif",
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          ))}
          {/* END SESSION TAB */}
          <div className="relative" style={{ marginBottom: "-40px" }}>
            {/* Gold border layer */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#c8a85b] to-[#8c6b2e]"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)",
                transform: "scale(1.03)",
                zIndex: 0,
              }}
            />

            <motion.button
              onClick={onEndSessionClick}
              className="cursor-pointer relative flex flex-col items-center justify-center px-5 py-7 w-full
       bg-gradient-to-b from-[#3c0000] via-[#2a0000] to-[#1a0000]
       text-[#f8eac7] font-bold uppercase tracking-[0.25em]
       shadow-[inset_0_2px_6px_rgba(255,255,255,0.1),0_4px_15px_rgba(0,0,0,0.8)]
       transition-colors duration-300
       hover:from-[#7a0000] hover:via-[#4b0000] hover:to-[#2a0000]"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)",
                fontFamily: "EB Garamond, serif",
                letterSpacing: "0.25em",
                textShadow:
                  "0 0 6px rgba(0,0,0,0.9), 0 0 12px rgba(191,136,60,0.2), 0 0 20px rgba(0,0,0,0.7)",
                zIndex: 1,
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-fabric.png')] opacity-30 pointer-events-none" />
              <div className="relative flex flex-col items-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f8eac7"
                  strokeWidth="2"
                  className="mb-1 drop-shadow-[0_0_4px_rgba(191,136,60,0.4)]"
                >
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span
                  className="text-sm tracking-[0.3em]"
                  style={{
                    fontFamily: "Cinzel Decorative, EB Garamond, serif",
                  }}
                >
                  End
                </span>
              </div>
            </motion.button>
          </div>
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
            className={`text-2xl lg:text-3xl font-bold uppercase tracking-[0.3em] text-center ${
              combatActive ? "text-red-400" : "text-[#d9ca89]"
            }`}
            style={{
              fontFamily: "EB Garamond, serif",
              textShadow: combatActive
                ? "0 0 25px rgba(239,68,68,0.6), 0 0 50px rgba(239,68,68,0.3)"
                : "0 0 25px rgba(217,202,137,0.6), 0 0 50px rgba(217,202,137,0.3)",
            }}
          >
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <motion.div
            className={`h-[2px] w-48 mt-2 mx-auto bg-gradient-to-r ${
              combatActive
                ? "from-transparent via-red-500 to-transparent"
                : "from-transparent via-[#d9ca89] to-transparent"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 relative">
        <AnimatePresence mode="wait">
          {/* COMBAT STATE TABS */}
          {combatActive ? (
            <>
              {/* INITIATIVE TAB */}
              {activeTab === "initiative" && (
                <motion.div
                  key="initiative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <InitiativeTracker />

                  {/* END COMBAT BUTTON */}
                  <motion.button
                    onClick={endCombat}
                    className="w-full mt-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-red-500/50 text-red-400 font-bold uppercase tracking-wider hover:border-red-400 transition-all"
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                    }}
                    whileTap={{ scale: 0.99 }}
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    End Combat
                  </motion.button>
                </motion.div>
              )}

              {/* HISTORY TAB */}
              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CombatHistory />
                </motion.div>
              )}
            </>
          ) : (
            <>
              {/* NORMAL STATE TABS */}
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* SESSION NOTES */}
                  <section className="relative border border-[#BF883C]/30 bg-[#151612]/50">
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />

                    <button
                      onClick={() => setNotesOpen(!notesOpen)}
                      className="w-full p-4 hover:bg-[#1a1814]/50 transition-all duration-300 flex items-center justify-between group"
                    >
                      <h2
                        className="text-base font-bold text-[#d9ca89] uppercase tracking-[0.2em]"
                        style={{
                          fontFamily: "EB Garamond, serif",
                          textShadow: "0 0 12px rgba(217,202,137,0.4)",
                        }}
                      >
                        Session Notes
                      </h2>

                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="text-[#BF883C]"
                        animate={{ rotate: notesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M 5,7 L 10,12 L 15,7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="square"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {notesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-[#BF883C]/20"
                        >
                          <div className="p-4">
                            <SessionNotes
                              initialNotes={quickNotes}
                              onNotesChange={setQuickNotes} // <-- now DMPanel always knows current notes
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  {/* TRAVEL ROUTES */}
                  <section className="relative border border-[#BF883C]/30 bg-[#151612]/50">
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />

                    <button
                      onClick={() => setRoutesOpen(!routesOpen)}
                      className="w-full p-4 hover:bg-[#1a1814]/50 transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <h2
                          className="text-base font-bold text-[#d9ca89] uppercase tracking-[0.2em]"
                          style={{
                            fontFamily: "EB Garamond, serif",
                            textShadow: "0 0 12px rgba(217,202,137,0.4)",
                          }}
                        >
                          Travel Routes
                        </h2>
                        {mapState.route.waypoints.length > 0 && (
                          <p className="text-xs text-[#BF883C]/70 uppercase tracking-wider mt-1">
                            {mapState.route.waypoints.length} waypoints
                          </p>
                        )}
                      </div>

                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="text-[#BF883C]"
                        animate={{ rotate: routesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M 5,7 L 10,12 L 15,7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="square"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {routesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-[#BF883C]/20"
                        >
                          <div className="p-4">
                            <RouteManager
                              route={mapState.route}
                              onRouteChange={(newRoute) =>
                                updateMapState({ route: newRoute })
                              }
                              weather={weather}
                              onToggleRouteVisibility={() => {
                                updateMapState({
                                  route: {
                                    ...mapState.route,
                                    visibleToPlayers:
                                      !mapState.route.visibleToPlayers,
                                  },
                                });
                              }}
                              routeSettingMode={mapState.routeSettingMode}
                              onToggleRouteSettingMode={() => {
                                updateMapState({
                                  routeSettingMode: !mapState.routeSettingMode,
                                });
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  {/* ATMOSPHERE & WEATHER */}
                  <section className="relative border border-[#BF883C]/30 bg-[#151612]/50">
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#d9ca89]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />

                    <button
                      onClick={() => setWeatherOpen(!weatherOpen)}
                      className="w-full p-4 hover:bg-[#1a1814]/50 transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <h2
                          className="text-base font-bold text-[#d9ca89] uppercase tracking-[0.2em]"
                          style={{
                            fontFamily: "EB Garamond, serif",
                            textShadow: "0 0 12px rgba(217,202,137,0.4)",
                          }}
                        >
                          Atmosphere & Weather
                        </h2>
                        {activeWeatherCount > 0 && (
                          <p className="text-xs text-[#BF883C]/70 uppercase tracking-wider mt-1">
                            {activeWeatherCount} effect
                            {activeWeatherCount > 1 ? "s" : ""} active
                          </p>
                        )}
                      </div>

                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="text-[#BF883C]"
                        animate={{ rotate: weatherOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M 5,7 L 10,12 L 15,7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="square"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {weatherOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-[#BF883C]/20"
                        >
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                              <motion.button
                                onClick={() => toggleWeather("timeOfDay")}
                                className={`p-4 border transition-all duration-300 ${
                                  weather.timeOfDay === "night"
                                    ? "border-blue-500 bg-blue-900/20"
                                    : "border-yellow-400 bg-yellow-500/20"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div
                                  className="text-sm font-bold uppercase tracking-wider"
                                  style={{
                                    fontFamily: "EB Garamond, serif",
                                    color:
                                      weather.timeOfDay === "night"
                                        ? "#93c5fd"
                                        : "#fef08a",
                                  }}
                                >
                                  {weather.timeOfDay === "night"
                                    ? "Night"
                                    : "Day"}
                                </div>
                              </motion.button>

                              <motion.button
                                onClick={() => toggleWeather("snow")}
                                className={`p-4 border transition-all duration-300 ${
                                  weather.snow
                                    ? "border-white bg-blue-100/20"
                                    : "border-[#BF883C]/30 bg-[#151612]/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div
                                  className="text-sm font-bold uppercase tracking-wider"
                                  style={{
                                    fontFamily: "EB Garamond, serif",
                                    color: weather.snow ? "#f0f9ff" : "#BF883C",
                                  }}
                                >
                                  Snow {weather.snow ? "On" : "Off"}
                                </div>
                              </motion.button>

                              <motion.button
                                onClick={() => toggleWeather("aurora")}
                                disabled={weather.timeOfDay === "day"}
                                className={`p-4 border transition-all duration-300 col-span-2 ${
                                  weather.timeOfDay === "day"
                                    ? "border-gray-700 bg-gray-800/20 opacity-50 cursor-not-allowed"
                                    : weather.aurora
                                    ? "border-purple-400 bg-purple-500/20"
                                    : "border-[#BF883C]/30 bg-[#151612]/50"
                                }`}
                                whileHover={
                                  weather.timeOfDay !== "day"
                                    ? { scale: 1.02 }
                                    : {}
                                }
                                whileTap={
                                  weather.timeOfDay !== "day"
                                    ? { scale: 0.98 }
                                    : {}
                                }
                              >
                                <div
                                  className="text-sm font-bold uppercase tracking-wider"
                                  style={{
                                    fontFamily: "EB Garamond, serif",
                                    color:
                                      weather.timeOfDay === "day"
                                        ? "#6b7280"
                                        : weather.aurora
                                        ? "#c4b5fd"
                                        : "#BF883C",
                                  }}
                                >
                                  {weather.timeOfDay === "day"
                                    ? "Aurora (Night Only)"
                                    : weather.aurora
                                    ? "Aurora On"
                                    : "Aurora Off"}
                                </div>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  {/* DICE ROLLER */}
                  <DiceRoller />
                </motion.div>
              )}

              {/* MAPS TAB */}
              {activeTab === "maps" && (
                <motion.div
                  key="maps"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {mapSetData ? (
                    <>
                      <motion.button
                        onClick={() => onMapSwitch("world")}
                        className={`relative w-full text-left p-4 border transition-all duration-300 ${
                          currentMapId === "world"
                            ? "border-[#d9ca89] bg-[#BF883C]/10"
                            : "border-[#BF883C]/30 bg-[#151612]/50 hover:border-[#BF883C]/60"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentMapId === "world" && (
                          <>
                            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#d9ca89]" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#d9ca89]" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />
                          </>
                        )}

                        <p
                          className={`font-bold uppercase tracking-[0.15em] ${
                            currentMapId === "world"
                              ? "text-[#d9ca89]"
                              : "text-[#BF883C]"
                          }`}
                          style={{
                            fontFamily: "EB Garamond, serif",
                            textShadow:
                              currentMapId === "world"
                                ? "0 0 10px rgba(217,202,137,0.4)"
                                : "none",
                          }}
                        >
                          {mapSetData.worldMap?.name || "World Map"}
                        </p>
                      </motion.button>

                      {mapSetData.cityMaps?.length > 0 && (
                        <>
                          <div className="h-px bg-gradient-to-r from-transparent via-[#BF883C]/30 to-transparent my-4" />
                          {mapSetData.cityMaps.map((cityMap) => (
                            <motion.button
                              key={cityMap.id}
                              onClick={() => onMapSwitch(cityMap.id)}
                              className={`relative w-full text-left p-4 border transition-all duration-300 ${
                                currentMapId === cityMap.id
                                  ? "border-[#d9ca89] bg-[#BF883C]/10"
                                  : "border-[#BF883C]/30 bg-[#151612]/50 hover:border-[#BF883C]/60"
                              }`}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {currentMapId === cityMap.id && (
                                <>
                                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#d9ca89]" />
                                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#d9ca89]" />
                                  <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#d9ca89]" />
                                  <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#d9ca89]" />
                                </>
                              )}

                              <p
                                className={`font-bold uppercase tracking-[0.15em] ${
                                  currentMapId === cityMap.id
                                    ? "text-[#d9ca89]"
                                    : "text-[#BF883C]"
                                }`}
                                style={{
                                  fontFamily: "EB Garamond, serif",
                                  textShadow:
                                    currentMapId === cityMap.id
                                      ? "0 0 10px rgba(217,202,137,0.4)"
                                      : "none",
                                }}
                              >
                                {cityMap.name}
                              </p>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <p
                      className="text-[#BF883C]/50 text-center py-8 uppercase tracking-wider"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      No maps available
                    </p>
                  )}
                </motion.div>
              )}

              {/* ENCOUNTERS TAB */}
              {activeTab === "encounters" && (
                <motion.div
                  key="encounters"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {sessionData?.encounters?.length > 0 ? (
                    sessionData.encounters.map((encounter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative p-4 border border-[#BF883C]/30 bg-[#151612]/50 hover:border-[#BF883C]/60 cursor-pointer transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <p
                          className="font-bold text-[#d9ca89] uppercase tracking-[0.15em]"
                          style={{
                            fontFamily: "EB Garamond, serif",
                            textShadow: "0 0 8px rgba(217,202,137,0.3)",
                          }}
                        >
                          {encounter.name}
                        </p>
                        <p className="text-sm text-[#BF883C]/70 mt-1 uppercase tracking-wider">
                          {encounter.difficulty || "Medium"}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p
                      className="text-[#BF883C]/50 text-center py-8 uppercase tracking-wider"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      No encounters prepared
                    </p>
                  )}
                </motion.div>
              )}

              {/* COMBAT TAB */}
              {activeTab === "combat" && (
                <motion.div
                  key="combat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CombatTab sessionData={sessionData} />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
      <ConfirmEndSessionModal
        show={showEndSessionConfirm}
        onCancel={() => setShowEndSessionConfirm(false)}
        onConfirm={async () => {
          try {
            // Save session notes
            await updateDoc(doc(db, "Sessions", sessionData.id), {
              sessionNotes: quickNotes,
            });

            setShowEndSessionConfirm(false);
            console.log("Session ended and notes saved!");
          } catch (err) {
            console.error("Error ending session:", err);
          }
        }}
      />
    </div>
  );
};
