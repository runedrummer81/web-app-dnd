import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
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
  const [filters, setFilters] = useState({ forest: false, cave: false, castle: false });

  const sessionId = location.state?.sessionId;

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
      const snapshot = await getDocs(collection(db, "encounters"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvailableEncounters(data);
    }
    fetchEncounters();
  }, []);

  // 🗺️ 3. Hent combat maps
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
        availableMaps.filter((map) => activeFilters.includes(map.category?.toLowerCase()))
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
    return <p className="text-center mt-20 text-[#DACA89]">Indlæser session...</p>;

  return (
    <div className="p-8 min-h-screen bg-[#1C1B18] text-[#DACA89] font-serif select-none grid grid-cols-2 gap-8">
      {/* 🧾 Venstre kolonne */}
      <section className="flex flex-col space-y-6">
        {/* Noter */}
        <div>
          <h2 className="text-lg uppercase tracking-widest font-semibold mb-2">DM Notes</h2>
          <textarea
            value={sessionData.dmNotes || ""}
            onChange={handleNotesChange}
            placeholder="Skriv dine noter her..."
            className="w-full h-[40vh] p-3 rounded-md bg-[#292621] border border-[#DACA89]/50 text-[#DACA89] focus:outline-none focus:border-[#DACA89]"
          />
        </div>

        {/* Encounters */}
        <article className="border border-[#DACA89]/50 rounded p-4 bg-[#292621]">
          <h3 className="text-lg uppercase tracking-widest mb-2">Encounters</h3>

          <select
            onChange={handleAddEncounter}
            defaultValue=""
            className="w-full bg-[#1F1E1A] border border-[#DACA89]/40 rounded p-2 mb-4 text-[#DACA89]"
          >
            <option value="">+ Tilføj encounter...</option>
            {availableEncounters.map((enc) => (
              <option key={enc.id} value={enc.id}>
                {enc.name}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            {encounters.length > 0 ? (
              encounters.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between bg-[#1F1E1A] px-3 py-2 rounded items-center"
                >
                  <p>{e.name}</p>
                  <button
                    onClick={() => handleRemoveEncounter(e.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[#DACA89]/60 italic">Ingen encounters valgt</p>
            )}
          </div>
        </article>
      </section>

      {/* 🗺️ Højre kolonne */}
      <section className="flex flex-col space-y-6">
        {/* World Map */}
        {worldMap && (
          <article className="border border-[#DACA89]/50 rounded p-4 bg-[#292621]">
            <h3 className="text-lg uppercase tracking-widest mb-2">World Map</h3>
            <img
              src={worldMap}
              alt="World Map"
              className="rounded-lg shadow-md w-full object-cover max-h-[250px]"
            />
          </article>
        )}

        {/* Combat Maps */}
        <article className="border border-[#DACA89]/50 rounded p-4 bg-[#292621]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg uppercase tracking-widest">Combat Maps</h3>
            <button
              onClick={() => setShowMapModal(true)}
              className="border border-[#DACA89] rounded py-1 px-3 hover:bg-[#DACA89]/10 transition"
            >
              Vælg Maps
            </button>
          </div>

          {/* Valgte maps */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              {combatMaps.length > 0 ? (
                combatMaps.map((map) => (
                  <div
                    key={map.id}
                    className="flex flex-col items-center border border-[#DACA89]/40 rounded p-2 bg-[#1F1E1A] relative"
                  >
                    <img
                      src={map.image}
                      alt={map.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <p className="text-xs mt-1">{map.title}</p>
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
      <section className="col-span-2 flex justify-between mt-8 items-center">
        <DiceThrower />
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/session")}
            className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
          >
            Save
          </button>
        </div>
      </section>

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
              className="bg-[#1C1B18] border border-[#DACA89]/50 p-6 rounded-lg shadow-xl w-[80%] max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg uppercase tracking-widest font-semibold">Vælg Combat Maps</h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-[#DACA89]/70 hover:text-[#DACA89]"
                >
                  ✕
                </button>
              </div>

              {/* Filtre */}
              <div className="mb-4 flex gap-4">
                {["forest", "cave", "castle"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
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
                {filteredMaps.map((map) => (
                  <div
                    key={map.id}
                    onClick={() => handleAddMap(map)}
                    className="cursor-pointer border border-[#DACA89]/30 rounded p-2 bg-[#1F1E1A] hover:border-[#DACA89]"
                  >
                    <img
                      src={map.image}
                      alt={map.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-center text-sm">{map.title}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
                >
                  Luk
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
