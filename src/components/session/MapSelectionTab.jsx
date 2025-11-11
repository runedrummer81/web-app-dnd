import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const MapSelectionTab = ({ mapSetData, onMapSwitch, currentMapId }) => {
  const [townMapsOpen, setTownMapsOpen] = useState(false);

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

  return (
    <div className="space-y-4">
      {/* WORLD MAP BANNER */}
      <motion.button
        onClick={() => onMapSwitch("world")}
        className="relative w-full h-32 overflow-hidden border-2 border-[var(--secondary)] group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {worldMap?.imageUrl && (
            <img
              src={worldMap.imageUrl}
              alt="World Map"
              className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{ objectPosition: "center 30%" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        </div>

        {/* Content */}
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

        {/* Active indicator */}
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
            onClick={() => setTownMapsOpen(!townMapsOpen)}
            className="w-full p-4 border-2 border-[var(--secondary)] transition-all duration-300 flex items-center justify-between group hover:border-[var(--primary)]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="text-left">
              <h2
                className={`text-lg font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  townMapsOpen
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
              animate={{ rotate: townMapsOpen ? 180 : 0 }}
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
          </motion.button>

          {/* TOWN MAPS GRID */}
          <AnimatePresence>
            {townMapsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {cityMaps.map((cityMap, index) => (
                    <motion.button
                      key={cityMap.id}
                      onClick={() => onMapSwitch(cityMap.id)}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Map thumbnail */}
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

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Map name */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-[var(--secondary)] group-hover:text-[var(--primary)] font-bold uppercase tracking-wider text-sm transition-colors duration-300">
                            {cityMap.name}
                          </h3>
                        </div>

                        {/* Active indicator */}
                        {currentMapId === cityMap.id && (
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
                        )}

                        {/* Active checkmark */}
                        {currentMapId === cityMap.id && (
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
    </div>
  );
};
