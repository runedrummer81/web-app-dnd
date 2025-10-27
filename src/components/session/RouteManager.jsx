import { useState } from "react";
import { motion } from "framer-motion";

export const RouteManager = ({
  route,
  onRouteChange,
  weather,
  onToggleRouteVisibility,
  routeSettingMode,
  onToggleRouteSettingMode,
}) => {
  const [travelMethod, setTravelMethod] = useState("dogsled");
  const [terrainType, setTerrainType] = useState("tundra");

  const travelSpeeds = {
    foot: 18,
    dogsled: 30,
  };

  const terrainMultipliers = {
    road: 1.2,
    tundra: 1.0,
    mountains: 0.5,
    frozenLake: 0.9,
    forest: 0.7,
  };

  const calculateDistance = () => {
    if (!route.waypoints || route.waypoints.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const [x1, y1] = route.waypoints[i];
      const [x2, y2] = route.waypoints[i + 1];
      const segmentDistance = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
      );
      totalDistance += segmentDistance;
    }

    return Math.round(totalDistance * 0.1);
  };

  const calculateTravelTime = () => {
    const distance = calculateDistance();
    if (distance === 0) return { days: 0, hours: 0 };

    const baseSpeed = travelSpeeds[travelMethod];
    const adjustedSpeed = baseSpeed * terrainMultipliers[terrainType];

    let weatherMultiplier = 1.0;
    if (weather.snow) weatherMultiplier *= 0.8;
    if (weather.timeOfDay === "night") weatherMultiplier *= 0.7;

    const finalSpeed = adjustedSpeed * weatherMultiplier;
    const days = distance / finalSpeed;

    const fullDays = Math.floor(days);
    const remainingHours = Math.round((days - fullDays) * 8);

    return { days: fullDays, hours: remainingHours, distance };
  };

  const calculateRestStops = () => {
    const { days } = calculateTravelTime();
    return Math.max(0, days);
  };

  const calculateEncounterChance = () => {
    const { days } = calculateTravelTime();
    const baseChance = 0.25;
    const totalChance = Math.min(0.95, days * baseChance);
    return Math.round(totalChance * 100);
  };

  const calculateRations = () => {
    const { days } = calculateTravelTime();
    return Math.ceil(days * 1.5);
  };

  const { days, hours, distance } = calculateTravelTime();
  const restStops = calculateRestStops();
  const encounterChance = calculateEncounterChance();
  const rationsNeeded = calculateRations();

  return (
    <div className="space-y-4">
      {/* Route Setting Button */}
      <motion.button
        onClick={onToggleRouteSettingMode}
        className={`relative w-full p-4 font-bold uppercase tracking-wider transition-all duration-300 overflow-hidden ${
          routeSettingMode
            ? "bg-gradient-to-r from-green-700 to-green-600 text-white"
            : "bg-gradient-to-r from-[#3d3426] to-[#2a2419] text-[#d9ca89] border border-[#BF883C]/30"
        }`}
        style={{ fontFamily: "EB Garamond, serif" }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {routeSettingMode && (
          <motion.div
            className="absolute inset-0 bg-green-500/20"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center justify-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-sm">
            {routeSettingMode ? "Click Map to Place Waypoints" : "Set Route"}
          </span>
        </div>
      </motion.button>

      {/* Route Status */}
      {route.waypoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border-2 border-[#d9ca89]/30 bg-gradient-to-br from-[#1a1814] to-[#151612] p-4"
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#d9ca89]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#d9ca89]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#d9ca89]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#d9ca89]" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d9ca89"
                strokeWidth="2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </motion.svg>
              <h3
                className="text-[#d9ca89] font-bold uppercase tracking-wider text-sm"
                style={{
                  fontFamily: "EB Garamond, serif",
                  textShadow: "0 0 10px rgba(217,202,137,0.3)",
                }}
              >
                Active Route ({route.waypoints.length} points)
              </h3>
            </div>
            <motion.button
              onClick={() => onRouteChange({ ...route, waypoints: [] })}
              className="text-red-500/70 hover:text-red-400 text-xs font-bold uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Clear
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                icon: "📏",
                label: "Distance",
                value: `${distance} mi`,
                color: "#d9ca89",
              },
              {
                icon: "⏱️",
                label: "Travel",
                value: `${days}d ${hours}h`,
                color: "#d9ca89",
              },
              {
                icon: "🏕️",
                label: "Rest Stops",
                value: restStops,
                color: "#d9ca89",
              },
              {
                icon: "🍖",
                label: "Rations",
                value: rationsNeeded,
                color: "#d9ca89",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-[#151612]/50 border border-[#BF883C]/20 p-3 group hover:border-[#d9ca89]/40 transition-all"
              >
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#d9ca89]/20" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stat.icon}</span>
                  <span
                    className="text-[10px] uppercase tracking-wider text-[#BF883C]/70"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    {stat.label}
                  </span>
                </div>
                <div
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    color: stat.color,
                    textShadow: "0 0 10px rgba(217,202,137,0.3)",
                  }}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Encounter Chance Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs uppercase tracking-wider text-[#BF883C]/70"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                ⚔️ Encounter Chance
              </span>
              <span
                className="text-sm font-bold text-[#d9ca89]"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {encounterChance}%
              </span>
            </div>
            <div className="h-2 bg-[#151612] border border-[#BF883C]/20 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#BF883C] to-[#d9ca89]"
                initial={{ width: 0 }}
                animate={{ width: `${encounterChance}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  boxShadow: "0 0 10px rgba(217,202,137,0.5)",
                }}
              />
            </div>
          </div>

          {/* Visibility Toggle */}
          <motion.button
            onClick={() => onToggleRouteVisibility()}
            className={`w-full p-3 font-bold uppercase tracking-wider text-sm transition-all ${
              route.visibleToPlayers
                ? "bg-gradient-to-r from-green-700 to-green-600 text-white"
                : "bg-gradient-to-r from-[#3d3426] to-[#2a2419] text-[#BF883C] border border-[#BF883C]/30"
            }`}
            style={{ fontFamily: "EB Garamond, serif" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {route.visibleToPlayers ? (
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
              {route.visibleToPlayers
                ? "Visible to Players"
                : "Hidden from Players"}
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Travel Method */}
      <div>
        <label
          className="block text-[#d9ca89] font-bold mb-2 text-sm uppercase tracking-wider"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Travel Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "foot", icon: "🚶", label: "On Foot", speed: "18 mi/day" },
            { id: "dogsled", icon: "🐕", label: "Dogsled", speed: "30 mi/day" },
          ].map((method) => (
            <motion.button
              key={method.id}
              onClick={() => setTravelMethod(method.id)}
              className={`relative p-4 transition-all duration-300 ${
                travelMethod === method.id
                  ? "bg-gradient-to-br from-[#BF883C] to-[#8b6429] text-[#151612]"
                  : "bg-gradient-to-br from-[#3d3426] to-[#2a2419] text-[#BF883C] border border-[#BF883C]/30"
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow:
                  travelMethod === method.id
                    ? "0 0 20px rgba(191,136,60,0.3)"
                    : "none",
              }}
            >
              {travelMethod === method.id && (
                <>
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#151612]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#151612]" />
                </>
              )}
              <div className="text-2xl mb-2">{method.icon}</div>
              <div
                className="font-bold text-sm uppercase tracking-wider mb-1"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {method.label}
              </div>
              <div
                className="text-xs opacity-70"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {method.speed}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Terrain Type */}
      <div>
        <label
          className="block text-[#d9ca89] font-bold mb-2 text-sm uppercase tracking-wider"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Primary Terrain
        </label>
        <div className="relative">
          <select
            value={terrainType}
            onChange={(e) => setTerrainType(e.target.value)}
            className="w-full bg-gradient-to-r from-[#3d3426] to-[#2a2419] text-[#d9ca89] p-4 border border-[#BF883C]/30 focus:outline-none focus:border-[#d9ca89] transition-all appearance-none cursor-pointer font-bold uppercase tracking-wider text-sm"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            <option value="road">🛤️ Road (Fast)</option>
            <option value="tundra">❄️ Tundra (Normal)</option>
            <option value="mountains">⛰️ Mountains (Slow)</option>
            <option value="frozenLake">🧊 Frozen Lake (Risky)</option>
            <option value="forest">🌲 Forest (Slow)</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d9ca89"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Travel Tips */}
      {route.waypoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#1a1814]/50 border border-[#d9ca89]/20 p-4"
        >
          <div
            className="absolute top-0 left-0 w-3 h-3 bg-[#d9ca89]/20"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />

          <div className="flex items-start gap-2 mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d9ca89"
              strokeWidth="2"
              className="flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p
              className="font-bold text-[#d9ca89] text-xs uppercase tracking-wider"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              DM Tips
            </p>
          </div>
          <ul
            className="space-y-1.5 text-xs text-[#BF883C]/70 ml-6"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {days > 3 && (
              <li className="flex items-start gap-2">
                <span className="text-[#d9ca89]">•</span> Long journey: Consider
                Constitution saves
              </li>
            )}
            {weather.snow && (
              <li className="flex items-start gap-2">
                <span className="text-[#d9ca89]">•</span> Snow: Difficult
                terrain, double rations
              </li>
            )}
            {encounterChance > 50 && (
              <li className="flex items-start gap-2">
                <span className="text-[#d9ca89]">•</span> High encounter chance:
                Prepare random encounters
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  );
};
