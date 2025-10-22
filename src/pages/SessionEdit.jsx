import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import DiceThrower from "../components/DiceThrower";
import { motion, AnimatePresence } from "framer-motion";

export default function SessionEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionData, setSessionData] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [availableEncounters, setAvailableEncounters] = useState([]);
  const [availableMaps, setAvailableMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [combatMaps, setCombatMaps] = useState([]);
  const [worldMap, setWorldMap] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [filters, setFilters] = useState({
    forest: false,
    cave: false,
    castle: false,
  });

  // Tilføj en midlertidig state til valgte maps i modal
  const [tempSelectedMaps, setTempSelectedMaps] = useState([]);

  const sessionId = location.state?.sessionId;

  // 💬 Modal state for encounters
  const [showEncounterModal, setShowEncounterModal] = useState(false);

  // 🧠 1. Hent session + world map
  useEffect(() => {
    if (!sessionId) {
      console.warn("⚠️ Ingen sessionId fundet — redirecter");
      navigate("/session");
      return;
    }

    async function fetchSession() {
      try {
        const sessionRef = doc(db, "Sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          setSessionData(data);
          setEncounters(data.encounters || []);
          setCombatMaps(data.combatMaps || []);

          // Hent world map via template
          if (data.campaignId) {
            const campaignRef = doc(db, "Campaigns", data.campaignId);
            const campaignSnap = await getDoc(campaignRef);
            const templateId = campaignSnap.data().templateId;
            if (templateId) {
              const templateRef = doc(db, "Templates", templateId);
              const templateSnap = await getDoc(templateRef);
              if (templateSnap.exists()) {
                setWorldMap(templateSnap.data().worldMap || null);
              }
            }
          }
        }
      } catch (err) {
        console.error("🔥 Fejl ved hentning af session:", err);
      }
    }

    fetchSession();
  }, [sessionId, navigate]);

  // 🧩 2. Hent encounters
  useEffect(() => {
    async function fetchEncounters() {
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        const q = query(
          collection(db, "encounters"),
          where("ownerId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAvailableEncounters(data);
      } catch (err) {
        console.error("🔥 Fejl ved hentning af encounters:", err);
      }
    }

    fetchEncounters();
  }, []);

  // 🗺️ 3. Hent combat smaps
  useEffect(() => {
    async function fetchMaps() {
      const q = query(collection(db, "Maps"), where("type", "==", "combat"));
      const snapshot = await getDocs(q);
      const maps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAvailableMaps(maps);
      setFilteredMaps(maps);
    }
    fetchMaps();
  }, []);

  // ✏️ 4. Ændr noter
  const handleNotesChange = (e) => {
    setSessionData({ ...sessionData, dmNotes: e.target.value });
  };

  // ⚔️ 5. Tilføj encounter
  const handleAddEncounter = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const selected = availableEncounters.find((enc) => enc.id === selectedId);
    if (selected && !encounters.find((e) => e.id === selectedId)) {
      setEncounters([...encounters, selected]);
    }
  };

  const handleRemoveEncounter = (id) => {
    setEncounters(encounters.filter((e) => e.id !== id));
  };

  // 🧭 6. Filtrer maps
  useEffect(() => {
    const activeFilters = Object.entries(filters)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    if (activeFilters.length === 0) {
      setFilteredMaps(availableMaps);
    } else {
      setFilteredMaps(
        availableMaps.filter((map) =>
          map.tags?.some((tag) => activeFilters.includes(tag.toLowerCase()))
        )
      );
    }
  }, [filters, availableMaps]);

  // ➕ 7. Tilføj/fjern maps
  const handleAddMap = (map) => {
    if (!combatMaps.find((m) => m.id === map.id)) {
      setCombatMaps([...combatMaps, map]);
    }
  };

  const handleRemoveMap = (id) => {
    setCombatMaps(combatMaps.filter((m) => m.id !== id));
  };

  // 💾 8. Gem til Firebase
  const handleSave = async () => {
    try {
      const sessionRef = doc(db, "Sessions", sessionId);
      await updateDoc(sessionRef, {
        dmNotes: sessionData.dmNotes,
        notesHeadline: sessionData.notesHeadline, // Add this line
        encounters,
        combatMaps,
        lastEdited: new Date(),
      });
      console.log("✅ Session gemt!");
      navigate("/session");
    } catch (err) {
      console.error("🔥 Fejl ved gem:", err);
    }
  };

  if (!sessionData)
    return (
      <p className="text-center mt-20 text-[#DACA89]">Indlæser session...</p>
    );

  return (
    <div className="min-h-screen bg-[#1C1B18] text-[#DACA89] font-serif select-none grid grid-cols-3 gap-8 px-20 pt-40 pb-20 items-stretch">
      {/* 🧾 Venstre kolonne */}
      <section className="flex flex-col min-h-full col-span-2">
        {/* Noter */}
        <div className="flex justify-between items-baseline py-3">
          <h3 className="text-lg uppercase tracking-widest">Noter</h3>
        </div>
        <div className="border-2 border-[var(--secondary)] p-4 focus-within:border-[var(--primary)]">
          <input
            type="text"
            value={sessionData.notesHeadline || ""}
            onChange={(e) =>
              setSessionData({ ...sessionData, notesHeadline: e.target.value })
            }
            placeholder="Headline..."
            className="w-full text-2xl uppercase font-bold text-[var(--primary)] p-2 mb-4 focus:outline-none"
          />

          <textarea
            value={sessionData.dmNotes || ""}
            onChange={handleNotesChange}
            placeholder="Skriv dine noter her..."
            className="w-full h-[40vh] font-light text-[var(--secondary)] p-5 focus:outline-none focus:text-[var(--primary)] resize-none"
          />
        </div>
      </section>

      {/* 🗺️ Højre kolonne */}
      <section className="flex flex-col  min-h-full">
        {/* Encounters */}
        <article>
          <div className="flex justify-between items-baseline py-3">
            <h3 className="text-lg uppercase tracking-widest">Encounters</h3>
            <button
              onClick={() => setShowEncounterModal(true)}
              className=" text-4xl transition "
            >
              +
            </button>
          </div>

          <div className="space-y-2 border-2 border-[var(--secondary)] p-2">
            {encounters.length > 0 ? (
              encounters.map((e) => (
                <div key={e.id} className=" px-3 py-2 items-center">
                  <div className="flex justify-between">
                    <p className="text-1xl">{e.name}</p>
                    <button
                      onClick={() => handleRemoveEncounter(e.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <p className="font-light text-[var(--secondary)]">
                      {e.creatures && e.creatures.length > 0
                        ? e.creatures.map((c, i) => (
                            <span key={i}>
                              {c.name} × {c.count}
                              <br />
                            </span>
                          ))
                        : "No creatures"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[var(-primary)]/60 italic">
                Ingen encounters valgt
              </p>
            )}
          </div>
        </article>

        {/* World Map */}
        {/* {worldMap && (
          <article className="border-2 border-[var(--secondary)]/50 p-4 ">
            <h3 className="text-lg uppercase tracking-widest mb-2">
              World Map
            </h3>
            <img
              src={worldMap}
              alt="World Map"
              className="w-full object-cover max-h-[250px]"
            />
          </article>
        )} */}

        {/* Combat Maps */}
        <article>
          <div className="flex justify-between items-center mb-3 pt-5">
            <h3 className="text-lg uppercase tracking-widest">Maps</h3>
          </div>

          {/* Valgte maps */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowMapModal(true)}
                className="right-0 py-1 text-4xl px-3 transition"
              >
                +
              </button>
              {combatMaps.length > 0 ? (
                combatMaps.map((map) => (
                  <div
                    key={map.id}
                    className="relative flex flex-col items-center p-2 border-2 border-[var(--secondary)] aspect-square w-24"
                  >
                    <img
                      src={map.image}
                      alt={map.title}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleRemoveMap(map.id)}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#DACA89]/60 italic">Ingen maps valgt</p>
              )}
            </div>
          </div>
        </article>
      </section>

      {/* ⚙️ Bundnavigation */}
      <section className="col-span-3 flex justify-between mt-8 items-center min-w-full">
        <DiceThrower />
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
          >
            Save
          </button>
        </div>
      </section>

      {/* 💬 ENCOUNTER MODAL */}
      <AnimatePresence>
        {showEncounterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--dark-muted-bg)] border-2 border-[var(--secondary)] p-6  shadow-xl w-[80%] max-w-md max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg uppercase tracking-widest font-semibold">
                  Vælg Encounter
                </h3>
                <button
                  onClick={() => setShowEncounterModal(false)}
                  className="text-[var(--primary)] hover:text-white transition text-lg"
                >
                  ✕
                </button>
              </div>

              <ul className="space-y-2">
                {availableEncounters.length > 0 ? (
                  availableEncounters.map((enc) => (
                    <li key={enc.id}>
                      <button
                        onClick={() => {
                          handleAddEncounter({ target: { value: enc.id } });
                          setShowEncounterModal(false);
                        }}
                        className="w-full text-[var(--secondary)] text-left p-2 hover:text-[var(--primary)] transition"
                      >
                        {enc.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--primary)] italic">
                    Ingen encounters fundet
                  </p>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💡 MAP MODAL */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--dark-muted-bg)] border-2 border-[var(--secondary)] p-6 shadow-xl w-[80%] max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg uppercase tracking-widest font-semibold">
                  Vælg Combat Maps
                </h3>
                <button
                  onClick={() => {
                    setTempSelectedMaps([]);
                    setShowMapModal(false);
                  }}
                  className="text-[var(--primary)] hover:text-white transition text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Filtre */}
              <div className="mb-4 flex gap-4">
                {["forest", "cave", "castle"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer text-[var(--secondary)]"
                  >
                    <input
                      type="checkbox"
                      checked={filters[type]}
                      onChange={(e) =>
                        setFilters({ ...filters, [type]: e.target.checked })
                      }
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>

              {/* Map-liste */}
              <div className="grid grid-cols-3 gap-4">
                {filteredMaps.map((map) => {
                  const isSelected = tempSelectedMaps.find(
                    (m) => m.id === map.id
                  );
                  return (
                    <div
                      key={map.id}
                      onClick={() => {
                        if (isSelected) {
                          setTempSelectedMaps(
                            tempSelectedMaps.filter((m) => m.id !== map.id)
                          );
                        } else {
                          setTempSelectedMaps([...tempSelectedMaps, map]);
                        }
                      }}
                      className={`cursor-pointer border-2 p-2 hover:border-[var(--primary)] transition ${
                        isSelected
                          ? "border-[var(--primary)]"
                          : "border-[var(--secondary)]"
                      }`}
                    >
                      <img
                        src={map.image}
                        alt={map.title}
                        className="w-full h-32 object-cover mb-2"
                      />
                      <p className="text-center text-sm text-[var(--secondary)]">
                        {map.title}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Confirm-knap */}
              <div className="flex justify-end mt-6 gap-2">
                <button
                  onClick={() => {
                    const newMaps = tempSelectedMaps.filter(
                      (map) => !combatMaps.find((m) => m.id === map.id)
                    );
                    setCombatMaps([...combatMaps, ...newMaps]);
                    setTempSelectedMaps([]);
                    setShowMapModal(false);
                  }}
                  className="border-2 border-[var(--secondary)] py-2 px-4 hover:bg-[var(--secondary)]/10 transition text-[var(--secondary)]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setTempSelectedMaps([]);
                    setShowMapModal(false);
                  }}
                  className="border-2 border-[var(--secondary)] py-2 px-4 hover:bg-[var(--secondary)]/10 transition text-[var(--secondary)]"
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
