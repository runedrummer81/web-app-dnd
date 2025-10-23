import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth } from "firebase/auth";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function CreateEncounters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatures, setCreatures] = useState([]);
  const [filteredCreatures, setFilteredCreatures] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [encounterName, setEncounterName] = useState("");
  const [savedEncounters, setSavedEncounters] = useState([]);
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [expandedEncounterId, setExpandedEncounterId] = useState(null);
  const navigate = useNavigate();
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const { spanRef, width } = useAutoWidthInput(encounterName);
  const [nameError, setNameError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    encounterId: null,
  });

  const handleDeleteEncounter = (id) => {
    setDeleteConfirm({ open: true, encounterId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.encounterId) return;

    try {
      await deleteDoc(doc(db, "encounters", deleteConfirm.encounterId));
    } catch (err) {
      console.error("Error deleting encounter:", err);
    } finally {
      setDeleteConfirm({ open: false, encounterId: null });
    }
  };

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

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return; // stop if user is not loaded yet

    const q = query(
      collection(db, "encounters"),
      where("ownerId", "==", user.uid) // <-- fetch only encounters for this user
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setSavedEncounters(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        console.error("Error fetching encounters:", error);
      }
    );

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
    if (!encounterName.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 500);
      return;
    }

    if (selectedCreatures.length === 0) return;

    const auth = getAuth();
    const user = auth.currentUser;

    try {
      if (currentEditingId) {
        await updateDoc(doc(db, "encounters", currentEditingId), {
          name: encounterName,
          creatures: selectedCreatures,
          updatedAt: new Date(),
        });
        setCurrentEditingId(null);
      } else {
        await addDoc(collection(db, "encounters"), {
          name: encounterName,
          creatures: selectedCreatures,
          createdAt: new Date(),
          ownerId: user.uid,
        });
      }

      setEncounterName("");
      setSelectedCreatures([]);
    } catch (err) {
      console.error("Error saving encounter:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedEncounterId((prev) => (prev === id ? null : id));
  };

  const handleEditEncounter = (encounter) => {
    setEncounterName(encounter.name || "");
    setSelectedCreatures(encounter.creatures || []);
    setCurrentEditingId(encounter.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll up to editor
  };

  function useAutoWidthInput(value, defaultWidth = 200) {
    const spanRef = React.useRef();
    const [width, setWidth] = React.useState(defaultWidth);

    React.useEffect(() => {
      if (spanRef.current) {
        setWidth(spanRef.current.offsetWidth + 10); // +10 for padding
      }
    }, [value]);

    return { spanRef, width };
  }

  return (
    <div className="flex min-h-screen bg-[var(--dark-muted-bg)] via-gray-800 to-gray-900 text-[-var(--secondary)] p-20 pt-50 gap-8  ">
      {/* LEFT PANEL — SEARCH + ENCOUNTER CREATION */}

      <div className="w-2/3 flex flex-col space-y-10">
        <div className="flex items-center gap-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 257.6 130.8"
            className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
          >
            <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
            <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
          </svg>
          <div className="relative inline-block">
            <span
              ref={spanRef}
              className="absolute invisible whitespace-pre text-3xl font-normal p-3"
            >
              {encounterName || "Name your encounter..."}
            </span>
            <motion.input
              type="text"
              value={encounterName}
              onChange={(e) => setEncounterName(e.target.value)}
              placeholder="Name your encounter..."
              className={`p-3 text-[var(--primary)] outline-none text-3xl bg-transparent border-none ${
                nameError ? "border-b-2 border-red-500" : ""
              }`}
              style={{ width }}
              animate={
                nameError
                  ? {
                      x: [-5, 5, -5, 5, 0],
                      textShadow: "0 0 8px #bf883c",
                    }
                  : { x: 0, textShadow: "0 0 0px transparent" }
              }
              transition={{ duration: 0.4 }}
            />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 257.6 130.8"
            className="fill-[var(--secondary)] w-8 h-auto "
          >
            <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
            <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
          </svg>
        </div>
        {/* Search bar */}
        <div className="relative w-full ">
          <div className="border-2 border-[var(--secondary)] overflow-none flex items-center ">
            <input
              type="text"
              placeholder="Search for a creature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-[var(--primary)] p-3 m-1 hover:bg-[var(--primary)] hover:text-black outline-none w-full"
            />
          </div>

          <div>
            {filteredCreatures.map((creature) => (
              <div
                key={creature.id}
                className="flex justify-between items-center p-2 cursor-pointer transition-colors text-[var(--secondary)] "
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
                <span className="text-">{creature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Encounter creation */}
        <div className="flex flex-col p-6 space-y-4 flex-1 overflow-y-auto text-[var(--primary)] ">
          <div className="flex flex-col gap-3 text">
            {selectedCreatures.length === 0 && (
              <p className="italic text-center text-[var(--secondary)]">
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
                  className="flex justify-between items-center border-b border-[var(--secondary)] pb-2"
                >
                  <span>{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCountChange(c.id, -1)}
                      className="px-2"
                    >
                      -
                    </button>
                    <span>{c.count}</span>
                    <button
                      onClick={() => handleCountChange(c.id, 1)}
                      className="px-2"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveCreature(c.id)}
                      className="ml-3 text-red-500 hover:text-red-400 transition"
                    >
                      X
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
                transition={{ duration: 0.2 }}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEncounter}
                className="relative cursor-pointer text-[var(--primary)] px-8 py-3 font-bold mx-auto block mt-4 overflow-hidden"
              >
                <span className="uppercase relative z-10">
                  {currentEditingId ? "Update Encounter" : "Save Encounter"}
                </span>
                <span className="absolute inset-0 "></span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL — SAVED ENCOUNTERS */}
      <div className="w-1/3 border-l border-[var(--secondary)] pl-6 flex flex-col">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4 flex-shrink-0">
          Saved Encounters
        </h2>

        <div
          className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[55vh] scrollbar-thin scrollbar-thumb-[var(--secondary)] scrollbar-track-[var(--dark-muted-bg)] hover:scrollbar-thumb-[var(--primary)] scrollbar-thumb-rounded-full scrollbar-track-rounded-full" >
          <AnimatePresence>
            {savedEncounters.map((enc) => (
              <motion.div
                key={enc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`relative border-2 border-[var(--secondary)] overflow-hidden transition-all border p-2 m2 ${
                  expandedEncounterId === enc.id ? "p-4" : "p-3 cursor-pointer"
                }`}
              >
                {/* Encounter header */}
                <div
                  className="flex justify-between items-center relative z-10"
                  onClick={() => toggleExpand(enc.id)}
                >
                  <h3 className="text-lg font-bold text-[var(--primary)] tracking-wide transition-colors duration-200 group-hover:text-black">
                    {enc.name || "Unnamed Encounter"}
                  </h3>

                  <button className="text-[var(--primary)] transition text-sm">
                    {expandedEncounterId === enc.id ? "▲" : "▼"}
                  </button>
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {expandedEncounterId === enc.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden flex justify-between "
                    >
                      <ul className="text-sm space-y-1 max-h-[150px] overflow-y-auto pr-1 text-[var(--secondary)]">
                        {(enc.creatures || []).map((c, i) => (
                          <li
                            key={i}
                            className="transition-colors cursor-pointer"
                            onMouseEnter={(e) =>
                              setHoveredCreature({
                                ...c,
                                mousePos: {
                                  x: e.clientX + 15,
                                  y: e.clientY + 15,
                                },
                              })
                            }
                            onMouseMove={(e) =>
                              setHoveredCreature((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      mousePos: {
                                        x: e.clientX + 15,
                                        y: e.clientY + 15,
                                      },
                                    }
                                  : null
                              )
                            }
                            onMouseLeave={() => setHoveredCreature(null)}
                          >
                            {c.name} × {c.count}
                          </li>
                        ))}
                      </ul>

                      {/* delete button */}
                      <div className="flex flex-row text-[var(--primary)] space-x-4">
                        <button
                          onClick={() => handleDeleteEncounter(enc.id)}
                          className=" text-red-500 hover:text-red-400  text-sm transition cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditEncounter(enc)}
                          className=" text-[var(--primary)] hover:text-[var(--secondary)]  text-sm transition cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Hover preview panel (animated) */}
      <AnimatePresence>
        {hoveredCreature && hoveredCreature.mousePos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-[900px] max-w-[90vw] bg-black text-[var(--secondary)] border [var(--secondary)] shadow-2xl pointer-events-none overflow-hidden"
            style={{
              top: Math.min(
                hoveredCreature.mousePos.y,
                window.innerHeight - 20 - 600 // max height clamp (adjust 600 if panel is taller)
              ),
              left: Math.min(
                hoveredCreature.mousePos.x,
                window.innerWidth - 20 - 900 // max width clamp (matches w-[900px])
              ),
            }}
          >
            {hoveredCreature.imageURL && (
              <div className="absolute top-4 right-3 w-30 h-30 rounded-full border-2 border-[var(--secondary)] overflow-hidden shadow-md">
                <img
                  src={hoveredCreature.imageURL}
                  alt={hoveredCreature.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 pr-28 relative">
              <h2 className="text-2xl text-[var(--primary)] font-bold mb-1">
                {hoveredCreature.name}
              </h2>
              <p className="italic text-sm text-[var(--secondary)] mb-2">
                {hoveredCreature.size} {hoveredCreature.type},{" "}
                {hoveredCreature.alignment}
              </p>
              <div className="grid grid-cols-2 gap-1 text-sm mb-2">
                <p className="text-[var(--primary)] flex space-x-1">
                  <strong>AC:</strong>{" "}
                  <p className="text-[var(--secondary)] ">
                    {hoveredCreature.ac}
                  </p>
                </p>
                <p className="text-[var(--primary)] flex space-x-1">
                  <strong>HP:</strong>{" "}
                  <p className="text-[var(--secondary)]">
                    {" "}
                    {hoveredCreature.hp}
                  </p>
                </p>
                <p className="text-[var(--primary)] flex space-x-1">
                  <strong>Speed:</strong>{" "}
                  <p className="text-[var(--secondary)]">
                    {" "}
                    {hoveredCreature.speed}
                  </p>
                </p>
                <p className="text-[var(--primary)] flex space-x-1">
                  <strong>CR:</strong>{" "}
                  <p className="text-[var(--secondary)]">
                    {" "}
                    {hoveredCreature.cr}
                  </p>
                </p>
                {hoveredCreature.initiative && (
                  <p className="text-[var(--primary)] flex space-x-1">
                    <strong>Initiative:</strong>{" "}
                    <p className="text-[var(--secondary)]">
                      {" "}
                      {hoveredCreature.initiative}
                    </p>
                  </p>
                )}
              </div>
              {hoveredCreature.stats && hoveredCreature.modifiers && (
                <div className="grid grid-cols-6 gap-2 text-center text-xs border-t border-b border-[var(--secondary)] py-2 mb-2">
                  {["str", "dex", "con", "int", "wis", "cha"].map((statKey) => (
                    <div key={statKey}>
                      <p className="font-bold text-[var(--primary)]">
                        {statKey.toUpperCase()}
                      </p>
                      <p className="text-[var(--secondary)] text-xs">
                        {hoveredCreature.stats[statKey]}{" "}
                        <span className="text-[var(--secondary)]">
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
                  <h4 className="font-bold text-[var(--primary)]">Traits</h4>
                  {hoveredCreature.traits.map((t, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong className="italic">{t.name}.</strong>{" "}
                      {t.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.actions?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[var(--primary)]">Actions</h4>
                  {hoveredCreature.actions.map((a, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong className="italic">{a.name}.</strong>{" "}
                      {a.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.bonus_actions?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[var(--primary)]">
                    Bonus Actions
                  </h4>
                  {hoveredCreature.bonus_actions.map((b, i) => (
                    <p key={i} className="text-sm mb-1">
                      <strong className="italic">{b.name}.</strong>{" "}
                      {b.description}
                    </p>
                  ))}
                </div>
              )}
              {hoveredCreature.gear?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[var(--primary)]">Gear</h4>
                  <p className="text-sm">{hoveredCreature.gear.join(", ")}</p>
                </div>
              )}
              {hoveredCreature.languages?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[var(--primary)]">Languages</h4>
                  <p className="text-sm">
                    {hoveredCreature.languages.join(", ")}
                  </p>
                </div>
              )}
              {hoveredCreature.senses?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[var(--primary)]">Senses</h4>
                  <p className="text-sm">{hoveredCreature.senses.join(", ")}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirm.open && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[var(--dark-muted-bg)] border border-[var(--secondary)] p-8 text-center shadow-xl max-w-sm mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl text-[var(--primary)] font-bold mb-4">
                Delete Encounter?
              </h3>
              <p className="text-[var(--secondary)] mb-6">
                Are you sure you want to permanently delete this encounter?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-black font-bold transition"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({ open: false, encounterId: null })
                  }
                  className="px-6 py-2 bg-[var(--secondary)] hover:bg-[var(--primary)] text-black font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
