// MapBrowserModal.jsx - SIMPLIFIED & IMPROVED VERSION

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function MapBrowserModal({
  isOpen,
  onClose,
  onConfirm,
  alreadySelectedMaps = [],
}) {
  const [availableMaps, setAvailableMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [tempSelectedMaps, setTempSelectedMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const scrollRef = useRef(null);

  const filterOptions = [
    { value: "all", label: "All Maps" },
    { value: "plains", label: "Plains" },
    { value: "castle", label: "Castle" },
    { value: "snow", label: "Snow" },
  ];

  // Fetch maps from Firestore
  useEffect(() => {
    if (!isOpen) return;

    async function fetchMaps() {
      setLoading(true);
      try {
        const q = query(collection(db, "Maps"), where("type", "==", "combat"));
        const snapshot = await getDocs(q);
        const maps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableMaps(maps);
        setFilteredMaps(maps);
      } catch (err) {
        console.error("Error fetching maps:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMaps();
  }, [isOpen]);

  // Check scroll position for bottom fade effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setShowBottomFade(isScrollable && !atBottom);
    };

    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [filteredMaps]);

  // Filter maps based on selected filter
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredMaps(availableMaps);
    } else {
      setFilteredMaps(
        availableMaps.filter((map) =>
          map.tags?.some((tag) => tag.toLowerCase() === selectedFilter)
        )
      );
    }
  }, [selectedFilter, availableMaps]);

  // Toggle map selection
  const toggleMapSelection = (map) => {
    const isSelected = tempSelectedMaps.find((m) => m.id === map.id);
    if (isSelected) {
      setTempSelectedMaps(tempSelectedMaps.filter((m) => m.id !== map.id));
    } else {
      setTempSelectedMaps([...tempSelectedMaps, map]);
    }
  };

  // Check if map is already added to session
  const isMapAlreadyAdded = (mapId) => {
    return alreadySelectedMaps.some((m) => m.id === mapId);
  };

  // Handle confirm
  const handleConfirm = () => {
    const newMaps = tempSelectedMaps.filter(
      (map) => !isMapAlreadyAdded(map.id)
    );
    onConfirm(newMaps);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setTempSelectedMaps([]);
    setSelectedFilter("all");
    onClose();
  };

  // Fade-in animation props for maps
  const fadeInProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, root: scrollRef, amount: 0.3 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-8"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1F1E1A] border-2 border-[var(--secondary)] shadow-[0_0_60px_rgba(191,136,60,0.4)] w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col relative"
        >
          <div className="flex justify-between items-center p-6 border-b border-[var(--secondary)]/30">
            <h3 className="text-2xl uppercase tracking-widest font-semibold text-[var(--primary)] drop-shadow-[0_0_10px_rgba(191,136,60,0.5)]">
              Map Library
            </h3>
            <button
              onClick={handleClose}
              className="text-[var(--primary)] hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* DROPDOWN MENU BENEATH */}
          <div className="px-6 py-4 border-b border-[var(--secondary)]/30 bg-[#1C1B18]">
            <div className="flex items-center gap-4">
              <label className="text-[var(--secondary)] uppercase text-sm tracking-wider font-semibold">
                Filter:
              </label>

              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none bg-[#1F1E1A] border-2 border-[var(--secondary)]/50 text-[var(--primary)] pl-4 pr-10 py-2.5 uppercase text-sm tracking-widest font-semibold cursor-pointer focus:outline-none focus:border-[var(--primary)] hover:border-[var(--primary)]/70 transition-all duration-300 shadow-[0_0_10px_rgba(191,136,60,0.1)] hover:shadow-[0_0_20px_rgba(191,136,60,0.3)] min-w-[200px]"
                  style={{
                    backgroundImage: "none",
                  }}
                >
                  {filterOptions.map((filter) => (
                    <option
                      key={filter.value}
                      value={filter.value}
                      className="bg-[#1F1E1A] text-[var(--primary)]"
                    >
                      {filter.label}
                    </option>
                  ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[var(--secondary)]"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
              </div>

              {tempSelectedMaps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-auto text-[var(--primary)] text-sm font-semibold tracking-wider"
                >
                  {tempSelectedMaps.length} map
                  {tempSelectedMaps.length !== 1 ? "s" : ""} selected
                </motion.div>
              )}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 relative min-h-[500px]"
            style={{
              maskImage: showBottomFade
                ? "linear-gradient(to bottom, black 85%, transparent 100%)"
                : "none",
              WebkitMaskImage: showBottomFade
                ? "linear-gradient(to bottom, black 85%, transparent 100%)"
                : "none",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--secondary)] text-lg">
                  Loading maps...
                </p>
              </div>
            ) : filteredMaps.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[var(--secondary)] text-xl mb-2">
                  No maps found
                </p>
                <p className="text-[var(--secondary)]/60 text-sm">
                  Try selecting a different filter
                </p>
              </div>
            ) : (
              // Update the grid div to include a key
              <div className="grid grid-cols-3 gap-8" key={selectedFilter}>
                {filteredMaps.map((map, index) => {
                  const isSelected = tempSelectedMaps.find(
                    (m) => m.id === map.id
                  );
                  const isAlreadyAdded = isMapAlreadyAdded(map.id);

                  return (
                    <motion.div
                      key={map.id}
                      {...fadeInProps}
                      whileHover={{ scale: 1.03 }}
                      className="relative"
                    >
                      <div
                        onClick={() =>
                          !isAlreadyAdded && toggleMapSelection(map)
                        }
                        className={`cursor-pointer border-2 p-3 transition-all duration-300 aspect-square ${
                          isAlreadyAdded
                            ? "border-green-600/50 opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "border-[var(--primary)] shadow-[0_0_25px_rgba(191,136,60,0.5)]"
                            : "border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:shadow-[0_0_15px_rgba(191,136,60,0.3)]"
                        }`}
                      >
                        <img
                          src={map.image}
                          alt={map.title}
                          className="w-full h-full object-cover"
                        />

                        {isSelected && !isAlreadyAdded && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-[var(--primary)] border-2 border-[#1C1B18] rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(191,136,60,0.6)]"
                          >
                            <span className="text-[#1C1B18] text-base font-bold">
                              ✓
                            </span>
                          </motion.div>
                        )}

                        {isAlreadyAdded && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-green-600/90 text-white text-xs font-semibold uppercase z-10 shadow-lg">
                            Added
                          </div>
                        )}
                      </div>

                      <p className="text-center text-base text-[var(--secondary)] mt-3 truncate">
                        {map.title}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 p-6 border-t border-[var(--secondary)]/30 bg-[#1C1B18]">
            <button
              onClick={handleClose}
              className="px-6 py-2 border-2 border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={tempSelectedMaps.length === 0}
              className={`px-6 py-2 border-2 transition uppercase tracking-wider ${
                tempSelectedMaps.length === 0
                  ? "border-[var(--secondary)]/30 text-[var(--secondary)]/30 cursor-not-allowed"
                  : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 shadow-[0_0_15px_rgba(191,136,60,0.3)]"
              }`}
            >
              Add{" "}
              {tempSelectedMaps.length > 0
                ? `(${tempSelectedMaps.length})`
                : "Maps"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
