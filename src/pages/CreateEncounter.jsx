import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, deleteDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const handleDeleteEncounter = async (id) => {
  if (!confirm("Are you sure you want to delete this encounter?")) return;
  try {
    await deleteDoc(doc(db, "encounters", id));
  } catch (err) {
    console.error("Error deleting encounter:", err);
  }
};

export default function CreateEncounters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatures, setCreatures] = useState([]);
  const [filteredCreatures, setFilteredCreatures] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [encounterName, setEncounterName] = useState("");
  const [savedEncounters, setSavedEncounters] = useState([]);
  const [hoveredCreature, setHoveredCreature] = useState(null);

  useEffect(() => {
    const fetchCreatures = async () => {
      const querySnapshot = await getDocs(collection(db, "Creatures"));
      const creatureList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCreatures(creatureList);
    };
    fetchCreatures();

    const q = query(collection(db, "encounters"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSavedEncounters(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCreatures([]);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = creatures.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(lowerTerm)) ||
        (c.name_lower && c.name_lower.includes(lowerTerm))
    );
    setFilteredCreatures(filtered);
  }, [searchTerm, creatures]);

  const handleAddCreature = (creature) => {
    setSelectedCreatures((prev) => {
      const existing = prev.find((c) => c.id === creature.id);
      if (existing) {
        return prev.map((c) =>
          c.id === creature.id ? { ...c, count: c.count + 1 } : c
        );
      }
      return [...prev, { ...creature, count: 1 }];
    });

    // Close dropdown + hover preview after click
    setFilteredCreatures([]);
    setHoveredCreature(null);
    setSearchTerm("");
  };

  const handleRemoveCreature = (id) => {
    setSelectedCreatures((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCountChange = (id, delta) => {
    setSelectedCreatures((prev) =>
      prev
        .map((c) =>
          c.id === id ? { ...c, count: Math.max(1, c.count + delta) } : c
        )
        .filter((c) => c.count > 0)
    );
  };

  const handleSaveEncounter = async () => {
    if (!encounterName.trim() || selectedCreatures.length === 0) return;
    await addDoc(collection(db, "encounters"), {
      name: encounterName,
      creatures: selectedCreatures,
      createdAt: new Date(),
    });
    setEncounterName("");
    setSelectedCreatures([]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 gap-8">
      {/* LEFT PANEL — SEARCH + ENCOUNTER CREATION */}
      <div className="w-2/3 flex flex-col space-y-6">
        {/* Search bar */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for a creature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 rounded-t-lg bg-gray-800 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 outline-none w-full"
          />

          {/* Animated dropdown */}
          <div
            className={`absolute z-10 w-full bg-gray-900 border border-yellow-600 rounded-b-lg max-h-64 overflow-y-auto shadow-lg transition-all duration-200 ease-out origin-top transform ${
              filteredCreatures.length > 0
                ? "opacity-100 scale-y-100 translate-y-0"
                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
            }`}
          >
            {filteredCreatures.map((creature) => (
              <div
                key={creature.id}
                className="flex justify-between items-center p-2 hover:bg-yellow-700/30 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleAddCreature(creature)}
                onMouseEnter={() => setHoveredCreature(creature)}
                onMouseLeave={() => setHoveredCreature(null)}
                onMouseMove={(e) => {
                  setHoveredCreature((prev) =>
                    prev
                      ? {
                          ...prev,
                          mousePos: { x: e.clientX + 15, y: e.clientY + 15 },
                        }
                      : null
                  );
                }}
              >
                <span className="text-yellow-200">{creature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Encounter creation panel */}
        <div className="flex flex-col bg-gray-800 border border-yellow-700 rounded-xl p-6 space-y-4 shadow-lg flex-1 overflow-y-auto">
          <input
            type="text"
            placeholder="Name your encounter..."
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="p-3 rounded-lg bg-gray-900 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 outline-none w-full"
          />

          <div className="flex flex-col gap-3">
            {selectedCreatures.length === 0 && (
              <p className="text-gray-400 italic text-center">
                No creatures selected
              </p>
            )}

            <AnimatePresence>
              {selectedCreatures.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <span>{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCountChange(c.id, -1)}
                      className="px-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                      -
                    </button>
                    <span>{c.count}</span>
                    <button
                      onClick={() => handleCountChange(c.id, 1)}
                      className="px-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveCreature(c.id)}
                      className="ml-3 text-red-500 hover:text-red-400 transition"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedCreatures.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 140, 0, 0.9)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEncounter}
                className="relative cursor-pointer bg-gray-700 border-2 border-yellow-600 rounded-lg px-8 py-3 text-yellow-300 font-bold tracking-widest shadow-inner hover:text-yellow-100 transition-all duration-300 mx-auto block mt-4 overflow-hidden"
              >
                <span className="uppercase relative z-10">Save Encounter</span>

                {/* Molten lines */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30 rounded-lg animate-pulse"></span>

                {/* Corners as molten rivets */}
                <span className="absolute top-0 left-0 w-2 h-2 bg-orange-400 rounded-full shadow-lg"></span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full shadow-lg"></span>
                <span className="absolute bottom-0 left-0 w-2 h-2 bg-orange-400 rounded-full shadow-lg"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-orange-400 rounded-full shadow-lg"></span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL — SAVED ENCOUNTERS */}
      <div className="w-1/3 border-l border-gray-700 pl-6 overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Saved Encounters
        </h2>

        <AnimatePresence>
          {savedEncounters.map((enc) => (
            <motion.div
              key={enc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-gray-800 border border-yellow-700 rounded-lg p-4 mb-4 relative shadow-md hover:shadow-yellow-500/10 transition-shadow"
            >
              <h3 className="text-lg font-semibold text-yellow-300">
                {enc.name || "Unnamed Encounter"}
              </h3>
              <ul className="text-sm mt-2 space-y-1">
                {(enc.creatures || []).map((c, i) => (
                  <li key={i}>
                    {c.name} × {c.count}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDeleteEncounter(enc.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hover preview panel (animated) */}
      <AnimatePresence>
        {hoveredCreature && hoveredCreature.mousePos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-[900px] bg-gray-900 text-gray-100 border border-yellow-700 rounded-xl shadow-2xl pointer-events-none overflow-hidden"
            style={{
              top: hoveredCreature.mousePos.y,
              left: hoveredCreature.mousePos.x,
            }}
          >
            {hoveredCreature.imageURL && (
              <div className="absolute top-4 right-3 w-30 h-30 rounded-full border-2 border-yellow-600 overflow-hidden shadow-md">
                <img
                  src={hoveredCreature.imageURL}
                  alt={hoveredCreature.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 pr-28 relative">
              <h2 className="text-2xl text-yellow-300 font-bold mb-1">
                {hoveredCreature.name}
              </h2>
              <p className="italic text-sm text-gray-300 mb-2">
                {hoveredCreature.size} {hoveredCreature.type},{" "}
                {hoveredCreature.alignment}
              </p>
              <div className="grid grid-cols-2 gap-1 text-sm mb-2">
                <p>
                  <strong>AC:</strong> {hoveredCreature.ac}
                </p>
                <p>
                  <strong>HP:</strong> {hoveredCreature.hp}
                </p>
                <p>
                  <strong>Speed:</strong> {hoveredCreature.speed}
                </p>
                <p>
                  <strong>CR:</strong> {hoveredCreature.cr}
                </p>
                {hoveredCreature.initiative && (
                  <p>
                    <strong>Initiative:</strong> {hoveredCreature.initiative}
                  </p>
                )}
              </div>
              {hoveredCreature.stats && hoveredCreature.modifiers && (
                <div className="grid grid-cols-6 gap-2 text-center text-xs border-t border-b border-gray-700 py-2 mb-2 bg-gray-900/60 rounded-md">
                  {["str", "dex", "con", "int", "wis", "cha"].map((statKey) => (
                    <div key={statKey}>
                      <p className="font-bold text-yellow-300">
                        {statKey.toUpperCase()}
                      </p>
                      <p className="text-gray-200 text-xs">
                        {hoveredCreature.stats[statKey]}{" "}
                        <span className="text-gray-400">
                          (mod: {hoveredCreature.modifiers[statKey + "_mod"]},
                          save: {hoveredCreature.modifiers[statKey + "_save"]})
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {hoveredCreature.traits?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Traits</h4>
                  {hoveredCreature.traits.map((t, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong>{t.name}.</strong> {t.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.actions?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Actions</h4>
                  {hoveredCreature.actions.map((a, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong>{a.name}.</strong> {a.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.bonus_actions?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Bonus Actions</h4>
                  {hoveredCreature.bonus_actions.map((b, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong>{b.name}.</strong> {b.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.gear?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Gear</h4>
                  <p className="text-sm">{hoveredCreature.gear.join(", ")}</p>
                </div>
              )}
              {hoveredCreature.languages?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Languages</h4>
                  <p className="text-sm">
                    {hoveredCreature.languages.join(", ")}
                  </p>
                </div>
              )}
              {hoveredCreature.senses?.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400">Senses</h4>
                  <p className="text-sm">{hoveredCreature.senses.join(", ")}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
