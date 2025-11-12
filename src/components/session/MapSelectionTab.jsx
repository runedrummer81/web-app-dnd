import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMapSync } from "./MapSyncContext";

export const MapSelectionTab = ({ mapSetData, onMapSwitch, currentMapId }) => {
  const [openSection, setOpenSection] = useState(null); // null, 'towns', 'dungeons', or 'locations'
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Add fog state
  const { mapState, updateMapState } = useMapSync();
  const fogSettings = mapState.fogOfWar || {
    enabled: false,
    revealedMask: null,
  };

  if (!mapSetData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[var(--secondary)]/50 text-center uppercase tracking-wider">
          No maps available
        </p>
      </div>
    );
  }

  const worldMap = mapSetData.worldMap;
  const cityMaps = mapSetData.cityMaps || [];
  const dungeonMaps = mapSetData.dungeonMaps || [];
  const locationMaps = mapSetData.locationMaps || [];

  const totalLocationMaps = locationMaps.reduce(
    (sum, location) => sum + (location.maps?.length || 0),
    0
  );

  // Toggle function that closes others
  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
      if (section !== "locations") {
        setSelectedLocation(null);
      }
    }
  };

  // Fog toggle handler
  const handleToggleFog = () => {
    const newEnabled = !fogSettings.enabled;
    updateMapState({
      fogOfWar: {
        ...fogSettings,
        enabled: newEnabled,
        revealedMask: newEnabled ? fogSettings.revealedMask : null,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* WORLD MAP BANNER */}
      <motion.button
        onClick={() => onMapSwitch("world")}
        className="relative w-full h-32 overflow-hidden border-2 border-[var(--secondary)] group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          {worldMap?.imageUrl && (
            <img
              src={worldMap.imageUrl}
              alt="World Map"
              className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{ objectPosition: "center 30%" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/10" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors duration-300">
              {worldMap?.name || "World Map"}
            </h2>
            {currentMapId === "world" && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-1 bg-[var(--primary)] mt-2 mx-auto"
                style={{ maxWidth: "200px" }}
              />
            )}
          </div>
        </div>

        {currentMapId === "world" && (
          <motion.div
            layoutId="activeMapTab"
            className="absolute inset-0 border-4 border-[var(--primary)] pointer-events-none"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>

      {/* TOWN MAPS SECTION */}
      {cityMaps.length > 0 && (
        <section>
          <motion.button
            onClick={() => toggleSection("towns")}
            className="relative w-full h-24 overflow-hidden border-2 border-[var(--secondary)] group transition-all duration-300 hover:border-[var(--primary)]"
          >
            {mapSetData.cityMapsBannerUrl && (
              <div className="absolute inset-0">
                <img
                  src={mapSetData.cityMapsBannerUrl}
                  alt="Town Maps"
                  className="w-full h-full object-cover object-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/10" />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between px-6 h-full">
              <div className="text-left">
                <h2
                  className={`text-lg font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    openSection === "towns"
                      ? "text-[var(--primary)]"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  Town Maps
                </h2>
                <p className="text-xs text-[var(--secondary)]/70 uppercase tracking-wider mt-1">
                  {cityMaps.length}{" "}
                  {cityMaps.length === 1 ? "location" : "locations"} available
                </p>
              </div>

              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-[var(--primary)] transition-colors duration-300"
                animate={{ rotate: openSection === "towns" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  d="M 6,9 L 12,15 L 18,9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="square"
                />
              </motion.svg>
            </div>

            {openSection === "towns" && (
              <motion.div
                className="absolute inset-0 border-2 border-[var(--primary)]/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {openSection === "towns" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-8">
                  {cityMaps.map((cityMap, index) => (
                    <motion.button
                      key={cityMap.id}
                      onClick={() => onMapSwitch(cityMap.id)}
                      className="relative group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="relative aspect-square overflow-hidden border-2 border-[var(--secondary)] group-hover:border-[var(--primary)] transition-colors duration-300">
                        {cityMap.imageUrl ? (
                          <img
                            src={cityMap.imageUrl}
                            alt={cityMap.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--dark-muted-bg)] flex items-center justify-center">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--secondary)"
                              strokeWidth="2"
                              className="opacity-30"
                            >
                              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-[var(--secondary)] group-hover:text-[var(--primary)] font-bold uppercase tracking-wider text-sm transition-colors duration-300">
                            {cityMap.name}
                          </h3>
                        </div>

                        {currentMapId === cityMap.id && (
                          <>
                            <motion.div
                              layoutId="activeMapTab"
                              className="absolute inset-0 border-4 border-[var(--primary)] pointer-events-none"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 bg-[var(--primary)] rounded-full p-1"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--dark-muted-bg)"
                                strokeWidth="3"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* DUNGEONS SECTION */}
      {dungeonMaps.length > 0 && (
        <section>
          <motion.button
            onClick={() => toggleSection("dungeons")}
            className="relative w-full h-24 overflow-hidden border-2 border-[var(--secondary)] group transition-all duration-300 hover:border-[var(--primary)]"
          >
            {mapSetData.dungeonMapsBannerUrl && (
              <div className="absolute inset-0">
                <img
                  src={mapSetData.dungeonMapsBannerUrl}
                  alt="Dungeons & Caves"
                  className="w-full h-full object-cover object-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/10" />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between px-6 h-full">
              <div className="text-left">
                <h2
                  className={`text-lg font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    openSection === "dungeons"
                      ? "text-[var(--primary)]"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  Dungeons & Caves
                </h2>
                <p className="text-xs text-[var(--secondary)]/70 uppercase tracking-wider mt-1">
                  {dungeonMaps.length}{" "}
                  {dungeonMaps.length === 1 ? "dungeon" : "dungeons"} available
                </p>
              </div>

              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-[var(--primary)] transition-colors duration-300"
                animate={{ rotate: openSection === "dungeons" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  d="M 6,9 L 12,15 L 18,9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="square"
                />
              </motion.svg>
            </div>

            {openSection === "dungeons" && (
              <motion.div
                className="absolute inset-0 border-2 border-[var(--primary)]/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {openSection === "dungeons" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-8">
                  {dungeonMaps.map((dungeonMap, index) => (
                    <motion.button
                      key={dungeonMap.id}
                      onClick={() => onMapSwitch(dungeonMap.id)}
                      className="relative group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="relative aspect-square overflow-hidden border-2 border-[var(--secondary)] group-hover:border-[var(--primary)] transition-colors duration-300">
                        {dungeonMap.imageUrl ? (
                          <img
                            src={dungeonMap.imageUrl}
                            alt={dungeonMap.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--dark-muted-bg)] flex items-center justify-center">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--secondary)"
                              strokeWidth="2"
                              className="opacity-30"
                            >
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-[var(--secondary)] group-hover:text-[var(--primary)] font-bold uppercase tracking-wider text-sm transition-colors duration-300">
                            {dungeonMap.name}
                          </h3>
                        </div>

                        {currentMapId === dungeonMap.id && (
                          <>
                            <motion.div
                              layoutId="activeMapTab"
                              className="absolute inset-0 border-4 border-[var(--primary)] pointer-events-none"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 bg-[var(--primary)] rounded-full p-1"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--dark-muted-bg)"
                                strokeWidth="3"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* LOCATIONS SECTION (CARD-BASED) */}
      {locationMaps.length > 0 && (
        <section>
          <motion.button
            onClick={() => {
              toggleSection("locations");
              setSelectedLocation(null);
            }}
            className="relative w-full h-24 overflow-hidden border-2 border-[var(--secondary)] group transition-all duration-300 hover:border-[var(--primary)]"
          >
            {mapSetData.locationMapsBannerUrl && (
              <div className="absolute inset-0">
                <img
                  src={mapSetData.locationMapsBannerUrl}
                  alt="Locations"
                  className="w-full h-full object-cover object-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/10" />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between px-6 h-full">
              <div className="text-left">
                <h2
                  className={`text-lg font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    openSection === "locations"
                      ? "text-[var(--primary)]"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  Locations
                </h2>
                <p className="text-xs text-[var(--secondary)]/70 uppercase tracking-wider mt-1">
                  {locationMaps.length}{" "}
                  {locationMaps.length === 1 ? "location" : "locations"} •{" "}
                  {totalLocationMaps} maps
                </p>
              </div>

              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-[var(--primary)] transition-colors duration-300"
                animate={{ rotate: openSection === "locations" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  d="M 6,9 L 12,15 L 18,9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="square"
                />
              </motion.svg>
            </div>

            {openSection === "locations" && (
              <motion.div
                className="absolute inset-0 border-2 border-[var(--primary)]/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          <AnimatePresence mode="wait">
            {openSection === "locations" && (
              <motion.div
                key={selectedLocation ? "maps" : "locations"}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {!selectedLocation ? (
                  // SHOW LOCATION CARDS (TALLER)
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-8">
                    {locationMaps.map((location, index) => (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className="relative group"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden border-2 border-[var(--secondary)] group-hover:border-[var(--primary)] transition-colors duration-300">
                          {location.bannerUrl ? (
                            <img
                              src={location.bannerUrl}
                              alt={location.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[var(--dark-muted-bg)] flex items-center justify-center">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--secondary)"
                                strokeWidth="2"
                                className="opacity-30"
                              >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                              </svg>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-[var(--secondary)] group-hover:text-[var(--primary)] font-bold uppercase tracking-wider text-sm transition-colors duration-300">
                              {location.name}
                            </h3>
                            {location.description && (
                              <p className="text-xs text-[var(--secondary)]/60 mt-1">
                                {location.description}
                              </p>
                            )}
                            <span className="inline-block mt-2 px-2 py-0.5 bg-[var(--primary)]/80 text-[var(--dark-muted-bg)] text-xs font-bold uppercase tracking-wider rounded">
                              {location.maps?.length || 0}{" "}
                              {location.maps?.length === 1 ? "map" : "maps"}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // SHOW SELECTED LOCATION'S MAPS
                  <div className="pt-4 space-y-4 pb-8">
                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--secondary)] text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors uppercase tracking-wider text-sm font-bold"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to Locations
                    </button>

                    {/* Location Title */}
                    <div className="px-2">
                      <h3 className="text-lg font-bold uppercase tracking-[0.15em] text-[var(--primary)]">
                        {selectedLocation.name}
                      </h3>
                      {selectedLocation.description && (
                        <p className="text-sm text-[var(--secondary)]/70 mt-1">
                          {selectedLocation.description}
                        </p>
                      )}
                    </div>

                    {/* Maps Grid - WITH FADE EFFECTS ONLY WHEN SCROLLING */}
                    <div className="relative">
                      {/* Top fade overlay - only visible when scrollable */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--dark-muted-bg)] to-transparent z-10 pointer-events-none opacity-0 group-data-[scrolled=true]:opacity-100 transition-opacity" />

                      {/* Bottom fade overlay - always visible to indicate more content below */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--dark-muted-bg)] to-transparent z-10 pointer-events-none" />

                      {/* Scrollable container */}
                      <div className="max-h-[450px] overflow-y-auto pr-2 pt-2 pb-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedLocation.maps?.map((map, index) => (
                            <button
                              key={map.id}
                              onClick={() => onMapSwitch(map.id)}
                              className="relative group"
                            >
                              <div className="relative aspect-square overflow-hidden border-2 border-[var(--secondary)] group-hover:border-[var(--primary)] transition-colors duration-300">
                                {map.imageUrl ? (
                                  <img
                                    src={map.imageUrl}
                                    alt={map.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[var(--dark-muted-bg)] flex items-center justify-center">
                                    <svg
                                      width="48"
                                      height="48"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="var(--secondary)"
                                      strokeWidth="2"
                                      className="opacity-30"
                                    >
                                      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h4 className="text-[var(--secondary)] group-hover:text-[var(--primary)] font-bold uppercase tracking-wider text-sm transition-colors duration-300">
                                    {map.name}
                                  </h4>
                                </div>

                                {currentMapId === map.id && (
                                  <>
                                    <motion.div
                                      layoutId="activeMapTab"
                                      className="absolute inset-0 border-4 border-[var(--primary)] pointer-events-none"
                                      initial={false}
                                      transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                      }}
                                    />
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute top-2 right-2 bg-[var(--primary)] rounded-full p-1"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--dark-muted-bg)"
                                        strokeWidth="3"
                                      >
                                        <path d="M5 13l4 4L19 7" />
                                      </svg>
                                    </motion.div>
                                  </>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* FOG OF WAR SECTION - Full Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-6"
      >
        <section className="relative">
          <button
            onClick={() => {
              const newEnabled = !fogSettings.enabled;
              updateMapState({
                fogOfWar: {
                  ...fogSettings,
                  enabled: newEnabled,
                  isDrawing: newEnabled, // Auto-enable drawing
                  revealedMask: newEnabled ? fogSettings.revealedMask : null,
                },
              });
            }}
            className={`w-full p-4 transition-all duration-300 flex items-center justify-between group ${
              fogSettings.enabled
                ? "border-2 border-[var(--primary)] bg-[var(--primary)]/10"
                : "border-2 border-[var(--secondary)]/50 hover:border-[var(--primary)]"
            }`}
          >
            <div className="text-left">
              <h2
                className={`text-base font-bold uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-2 ${
                  fogSettings.enabled
                    ? "text-[var(--primary)]"
                    : "text-[var(--secondary)]"
                }`}
              >
                Fog of War
                {fogSettings.enabled && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </h2>
              <p className="text-xs text-[var(--secondary)]/60 mt-1 uppercase tracking-wider">
                {fogSettings.enabled
                  ? "Active • Click map to reveal areas"
                  : "Hide unexplored areas from players"}
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                fogSettings.enabled
                  ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                  : "bg-[var(--secondary)]/20 text-[var(--secondary)]"
              }`}
            >
              {fogSettings.enabled ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 15h18M3 9h18M3 12h18" opacity="0.5" />
                </svg>
              )}
            </div>
          </button>

          {/* Expanded Controls when Fog is Active */}
          <AnimatePresence>
            {fogSettings.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-l-2 border-r-2 border-b-2 border-[var(--primary)]/30"
              >
                <div className="p-4 space-y-4 bg-[var(--dark-muted-bg)]">
                  {/* Drawing Status */}
                  <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2"
                          className="animate-pulse"
                        >
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                        </svg>
                        <span className="text-[var(--primary)] text-sm font-bold uppercase tracking-wider">
                          Drawing Active
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          updateMapState({
                            fogOfWar: {
                              ...fogSettings,
                              isDrawing: !fogSettings.isDrawing,
                            },
                          });
                        }}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                          fogSettings.isDrawing
                            ? "bg-[var(--primary)] text-[var(--dark-muted-bg)]"
                            : "bg-[var(--secondary)]/20 text-[var(--secondary)] hover:bg-[var(--secondary)]/30"
                        }`}
                      >
                        {fogSettings.isDrawing ? "On" : "Off"}
                      </button>
                    </div>
                    <p className="text-[var(--secondary)]/70 text-xs mt-2">
                      💡 Click and drag on the map to reveal areas
                    </p>
                  </div>

                  {/* Brush Size Control */}
                  <div>
                    <h3 className="text-[var(--secondary)] uppercase mb-2 text-xs font-bold flex items-center justify-between">
                      <span>Brush Size</span>
                      <span className="text-[var(--primary)] text-lg">
                        {fogSettings.brushSize}px
                      </span>
                    </h3>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      step="10"
                      value={fogSettings.brushSize}
                      onChange={(e) => {
                        updateMapState({
                          fogOfWar: {
                            ...fogSettings,
                            brushSize: parseInt(e.target.value),
                          },
                        });
                      }}
                      className="w-full h-2 bg-[var(--secondary)]/30 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[30, 80, 150].map((size, i) => (
                        <motion.button
                          key={size}
                          onClick={() => {
                            updateMapState({
                              fogOfWar: {
                                ...fogSettings,
                                brushSize: size,
                              },
                            });
                          }}
                          className={`px-3 py-2 uppercase font-medium text-xs ${
                            fogSettings.brushSize === size
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

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-[var(--secondary)] uppercase mb-2 text-xs font-bold">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        onClick={() => {
                          updateMapState({
                            fogOfWar: {
                              ...fogSettings,
                              revealedMask: null, // Clear = all revealed
                            },
                          });
                        }}
                        className="px-4 py-3 border-2 border-green-500/50 text-green-400 font-medium uppercase tracking-wider text-xs hover:border-green-400 hover:bg-green-500/10 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ✓ Reveal All
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          // Create a completely black canvas = full fog
                          const canvas = document.createElement("canvas");
                          canvas.width = 2000;
                          canvas.height = 2000;
                          const ctx = canvas.getContext("2d");
                          ctx.fillStyle = "rgba(0, 0, 0, 1)";
                          ctx.fillRect(0, 0, canvas.width, canvas.height);

                          updateMapState({
                            fogOfWar: {
                              ...fogSettings,
                              revealedMask: canvas.toDataURL(),
                            },
                          });
                        }}
                        className="px-4 py-3 border-2 border-red-500/50 text-red-400 font-medium uppercase tracking-wider text-xs hover:border-red-400 hover:bg-red-500/10 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ✕ Hide All
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </div>
  );
};
