import { useState, useEffect } from "react";
import { RouteManager } from "./RouteManager";
import { SessionNotes } from "./SessionNotes";
import { DiceRoller } from "./DiceRoller";
import { CombatTab } from "./CombatTab";
import { InitiativeTracker } from "./InitiativeTracker";
import { CombatHistory } from "./CombatHistory";
import { MapControlsTab } from "./MapControlsTab";
import { useMapSync } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";
import { motion, AnimatePresence } from "framer-motion";
import SpellBook from "./Spells";

export const DMPanel = ({
  sessionData,
  mapSetData,
  onMapSwitch,
  currentMapId,
  weather,
  onWeatherChange,
  quickNotes,
  setQuickNotes,
  onEndCombat,
  onRequestEndSessionConfirm,
}) => {
  const { mapState, updateMapState } = useMapSync();
  const { combatActive, isSetupMode, endCombat } = useCombatState();
  const [activeTab, setActiveTab] = useState("overview");
  const [notesOpen, setNotesOpen] = useState(true);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [routesOpen, setRoutesOpen] = useState(false);


  const [combatStarted, setCombatStarted] = useState(false);


  // Handle tab switching when entering/exiting combat or setup mode
  useEffect(() => {
    if (!combatActive) {
      // Combat ended → reset to overview
      setActiveTab("overview");
      setCombatStarted(false);
    } else {
      // Combat started → choose default tab based on setup mode
      if (isSetupMode) setActiveTab("mapcontrols");
      else setActiveTab("initiative");
    }
  }, [combatActive, isSetupMode]);
  // Normal state tabs (NO map controls)
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

  // Combat state tabs (WITH map controls)
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
      id: "spellbook",
      label: "Spellbook",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M20 22H6.5A2.5 2.5 0 0 1 4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H20v19z" />
          <path d="M6.5 3v14" />
        </svg>
      ),
    },
    {
      id: "mapcontrols",
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
    <div className="h-full bg-[var(--dark-muted-bg)] text-gray-100 flex flex-col relative overflow-hidden">
      {/* Header with Book Marker Tabs */}
      <div className={`relative flex-shrink-0`}>
        {/* Bookmark Tabs - Flag shaped */}
        <div className="flex justify-center gap-2 px-15 pt-2">
        {tabs.map((tab, index) => {
  // Disable initiative, spellbook, history if combat not started
  const isDisabled =
    !combatStarted &&
    ["initiative", "spellbook", "history"].includes(tab.id);

  return (
    <motion.button
  key={tab.id}
  onClick={() => !isDisabled && setActiveTab(tab.id)}
  className={`relative flex-1 py-4 transition-all duration-300 ${
    activeTab === tab.id
      ? combatActive
        ? "bg-gradient-to-b from-red-700 to-red-900"
        : "bg-[var(--primary)]"
      : "bg-[var(--secondary)]"
  }`}
  style={{
    clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
    boxShadow:
      activeTab === tab.id
        ? combatActive
          ? "0 4px 12px rgba(239,68,68,0.5), inset 0 -2px 8px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(191,136,60,0.4), inset 0 -2px 8px rgba(0,0,0,0.3)"
        : "0 2px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
    cursor: isDisabled ? "not-allowed" : "pointer",
  }}
  whileHover={isDisabled ? {} : { y: activeTab === tab.id ? 0 : -2 }}
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: isDisabled ? 0.3 : 1, y: 0 }} // ← apply disabled opacity here
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
  );
})}

          {/* END TAB - conditional */}
          <motion.button
  onClick={() => {
    if (combatActive) {
      // End combat
      endCombat();              // Reset combat state in context
      setCombatStarted(false);  // Reset local flag
      setActiveTab("overview"); // Switch to overview tab
      onEndCombat?.();          // Optional callback
    } else {
      // End session
      onRequestEndSessionConfirm();
    }
  }}
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
      <path d={combatActive ? "M10 17l5-5-5-5" : "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"} />
    </svg>
  </div>

  <span className="text-[8px] font-bold uppercase tracking-[0.15em] block text-center text-[#f8eac7]">
    {combatActive ? "End Combat" : "End"}
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
      <div className="flex-1 overflow-y-auto relative">
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
                  {/* <motion.button
                    onClick={() => {
                      endCombat();
                      setActiveTab("overview");
                      onEndCombat?.();
                    }}
                    className="w-full mt-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-red-500/50 text-red-400 font-bold uppercase tracking-wider hover:border-red-400 transition-all"
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                    }}
                    whileTap={{ scale: 0.99 }}
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    End Combat
                  </motion.button> */}
                </motion.div>
              )}

              {/* SPELLBOOK TAB */}
              {activeTab === "spellbook" && (
                <motion.div
                  key="spellbook"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SpellBook />
                </motion.div>
              )}

              {/* MAP CONTROLS TAB */}
              {activeTab === "mapcontrols" && (
                <motion.div
                  key="mapcontrols"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapControlsTab
  onStartCombat={() => {
    setActiveTab("initiative");
    setCombatStarted(true);
  }}
  weather={weather}
  onWeatherChange={onWeatherChange}
/>



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
                  {/* TRAVEL ROUTES */}
                  <section className="relative">
                    <button
                      onClick={() => setRoutesOpen(!routesOpen)}
                      className={`w-full p-4 transition-all duration-300 flex items-center justify-between group`}
                    >
                      <div className="text-left">
                        <h2
                          className={`text-base font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                            routesOpen
                              ? "text-[var(--primary)]"
                              : "text-[var(--secondary)]"
                          }`}
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
                        className="text-[#BF883C] transition-colors duration-300"
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
                          className="overflow-hidden "
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

                  <motion.div
                    className={`h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r ${"from-transparent via-[var(--secondary)] to-transparent"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  {/* ATMOSPHERE & WEATHER */}
                  <section className="relative">
                    <button
                      onClick={() => setWeatherOpen(!weatherOpen)}
                      className={`w-full p-4 transition-all duration-300 flex items-center justify-between group
      `}
                    >
                      <div className="text-left">
                        <h2
                          className={`text-base font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                            weatherOpen
                              ? "text-[var(--primary)]"
                              : "text-[var(--secondary)]"
                          }`}
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
                        className="text-[#BF883C] transition-colors duration-300"
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
                          className="overflow-hidden "
                        >
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                              {/* Day/Night Button */}
                              <motion.button
                                onClick={() => toggleWeather("timeOfDay")}
                                className={`p-4 border transition-all duration-300 border-[var(--secondary)] ${
                                  weather.timeOfDay === "night"
                                    ? " bg-blue-900/20"
                                    : " bg-yellow-500/20"
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

                              {/* Snow Button */}
                              <motion.button
                                onClick={() => toggleWeather("snow")}
                                className={`p-4 border transition-all duration-300 border-[var(--secondary)] ${
                                  weather.snow
                                    ? " bg-blue-100/20"
                                    : " bg-[#151612]/50"
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

                              {/* Aurora Button */}
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

                  <motion.div
                    className={`h-[2px] w-100 mt-2 mx-auto bg-gradient-to-r ${"from-transparent via-[var(--secondary)] to-transparent"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

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
                  className="flex flex-col gap-6 "
                >
                  <div className="flex gap-6 px-5">
                    {mapSetData ? (
                      <>
                        {/* WORLD MAP */}
                        <section className="relative flex-1">
                          <button
                            onClick={() => onMapSwitch("world")}
                            className={`w-full transition-all duration-300 flex items-center justify-between group `}
                          >
                            <div className="text-left">
                              <div
                                className={`transition-colors duration-300 ${
                                  currentMapId === "world"
                                    ? "text-[#d9ca89]"
                                    : "text-[var(--secondary)]"
                                }`}
                              >
                                <h2 className="font-bold uppercase ">
                                  {mapSetData.worldMap?.name || "World Map"}
                                </h2>
                                <img
                                  src={mapSetData.worldMap.imageUrl}
                                  alt={`Map of ${mapSetData.worldMap.imageUrl}`}
                                  className="h-auto"
                                />
                              </div>
                            </div>
                          </button>
                        </section>

                        {/* CITY MAPS */}
                        {mapSetData.cityMaps?.length > 0 && (
                          <>
                            {mapSetData.cityMaps.map((cityMap) => (
                              <section
                                key={cityMap.id}
                                className="relative flex-1"
                              >
                                <button
                                  onClick={() => onMapSwitch(cityMap.id)}
                                  className={`w-full transition-all duration-300 flex items-center justify-between group `}
                                >
                                  <div className="text-left">
                                    <div
                                      className={`transition-colors duration-300 ${
                                        currentMapId === cityMap.id
                                          ? "text-[#d9ca89]"
                                          : "text-[var(--secondary)]"
                                      }`}
                                    >
                                      <h2 className=" font-bold uppercase ">
                                        {cityMap.name}
                                      </h2>
                                      <img
                                        src={cityMap.imageUrl}
                                        alt={`Map of ${cityMap.name}`}
                                        className="h-auto"
                                      />
                                    </div>
                                  </div>
                                </button>
                              </section>
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
                  </div>
                </motion.div>
              )}

              {/* NOTES TAB */}
              {activeTab === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {/* SESSION NOTES */}
                  <section className="relative w-full">
                    <AnimatePresence>
                      {notesOpen && (
                        <motion.div
                          key="session-notes"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="w-full">
                            <SessionNotes
                              initialNotes={quickNotes}
                              onNotesChange={setQuickNotes}
                            />
                          </div>
                        </motion.div>
                      )}
                      <motion.div
                        key="dm-notes"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#bf883c] whitespace-pre-wrap px-4 pt-10"
                      >
                        {sessionData?.dmNotes || "No notes yet"}
                      </motion.div>
                    </AnimatePresence>
                  </section>
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
    </div>
  );
};
