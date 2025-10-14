import React, { useState, useEffect } from "react";
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
    // Firestore onSnapshot will automatically update savedEncounters
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

  // Fetch all creatures from Firestore
  useEffect(() => {
    const fetchCreatures = async () => {
      const querySnapshot = await getDocs(collection(db, "Creatures"));
      const creatureList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Loaded creatures:", creatureList);
      setCreatures(creatureList);
    };
    fetchCreatures();

    // Listen to encounters
    const q = query(collection(db, "encounters"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSavedEncounters(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  // Filter search results
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

    // console.log("Search results:", filtered); // 👈 log this too

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
      {/* LEFT SIDE — CREATE ENCOUNTER */}
      <div className="w-2/3 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400">Create Encounter</h1>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search for a creature..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 outline-none"
        />
        {/* Search Results */}
        {filteredCreatures.length > 0 && (
          <div className="bg-gray-800 border border-yellow-700 rounded-lg max-h-64 overflow-y-auto p-2 relative">
            {filteredCreatures.map((creature) => (
              <div
                key={creature.id}
                className="flex justify-between items-center p-2 hover:bg-yellow-700/30 rounded-lg cursor-pointer"
                onClick={() => handleAddCreature(creature)}
                onMouseEnter={() => setHoveredCreature(creature)}
                onMouseLeave={() => setHoveredCreature(null)}
                onMouseMove={(e) => {
                  // Update mouse position for stat block
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
        )}

        {hoveredCreature && hoveredCreature.mousePos && (
          <div
            className="fixed z-50 w-[400px] bg-gray-900 text-gray-100 border border-yellow-700 rounded-xl p-4 shadow-2xl pointer-events-none"
            style={{
              top: hoveredCreature.mousePos.y,
              left: hoveredCreature.mousePos.x,
            }}
          >
            <h2 className="text-2xl text-yellow-300 font-bold mb-1">
              {hoveredCreature.name}
            </h2>
            <p className="italic text-sm text-gray-400 mb-2">
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
            </div>
            {hoveredCreature.stats && (
              <div className="grid grid-cols-6 gap-2 text-center text-xs border-t border-b border-gray-700 py-2 mb-2">
                {Object.entries(hoveredCreature.stats).map(([key, val]) => (
                  <div key={key}>
                    <p className="font-bold text-yellow-300">
                      {key.toUpperCase()}
                    </p>
                    <p>{val}</p>
                  </div>
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
          </div>
        )}
        {/* Selected creatures */}
        {selectedCreatures.length > 0 && (
          <div className="bg-gray-800 border border-yellow-700 rounded-lg p-4 space-y-3">
            {selectedCreatures.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <span>{c.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCountChange(c.id, -1)}
                    className="px-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    -
                  </button>
                  <span>{c.count}</span>
                  <button
                    onClick={() => handleCountChange(c.id, 1)}
                    className="px-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveCreature(c.id)}
                    className="ml-3 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Encounter name & save */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Encounter name..."
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="p-3 flex-grow rounded-lg bg-gray-800 border border-yellow-600 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            onClick={handleSaveEncounter}
            className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg font-bold text-gray-900"
          >
            Save
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — SAVED ENCOUNTERS */}
      <div className="w-1/3 border-l border-gray-700 pl-6 overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Saved Encounters
        </h2>
        {savedEncounters.map((enc) => (
          <div
            key={enc.id}
            className="bg-gray-800 border border-yellow-700 rounded-lg p-4 mb-4 relative"
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
              className="absolute top-2 right-2 text-red-500 hover:text-red-400 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
