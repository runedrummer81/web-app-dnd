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

  const { days, hours, distance } = calculateTravelTime();

  return (
    <div className="space-y-4">
      {/* Route Setting Button */}
      <div className="flex gap-4">
        <motion.button
          onClick={onToggleRouteSettingMode}
          className={`relative w-2/3 p-4 font-bold uppercase tracking-wider transition-all duration-300 overflow-hidden ${
            routeSettingMode
              ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
              : "border border-[var(--secondary)}  text-[var(--secondary)]"
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

        {/* Visibility Toggle */}
        <motion.button
          onClick={() => onToggleRouteVisibility()}
          className={`w-1/3 p-3 font-bold uppercase tracking-wider text-sm transition-all ${
            route.visibleToPlayers
              ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
              : "border border-[var(--secondary)}  text-[var(--secondary)]"
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex flex-col text-sm items-center justify-center gap-2">
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
      </div>

      {/* Route Status */}
      {route.waypoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative "
        >
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
              <h3 className="text-[var(--primary)] font-bold uppercase tracking-wider text-sm">
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
          <div className="grid grid-cols-2">
            {[
              {
                label: "Distance",
                value: `${distance} mi`,
                color: "#d9ca89",
              },
              {
                label: "Travel",
                value: `${days}d ${hours}h`,
                color: "#d9ca89",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-[#151612]/50  p-3 group transition-all"
              >
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
        </motion.div>
      )}

      {/* Travel Method */}
      <div>
        <label className="block text-[#d9ca89] font-bold mb-2 text-sm uppercase tracking-wider">
          Travel Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "foot", label: "On Foot", speed: "18 mi/day" },
            { id: "dogsled", label: "Dogsled", speed: "30 mi/day" },
          ].map((method) => (
            <motion.button
              key={method.id}
              onClick={() => setTravelMethod(method.id)}
              className={`relative p-4 transition-all duration-300  
                ${
                  travelMethod === method.id
                    ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                    : "border border-[var(--secondary)}  text-[var(--secondary)]"
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
    </div>
  );
};
