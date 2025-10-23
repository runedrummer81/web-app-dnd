import { useState, useEffect } from "react";
import {
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router";

export default function Session() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fromPage =
    location.state?.from || localStorage.getItem("lastNonSessionPage");

  // Gem den i localStorage, så vi husker den, selv hvis man opretter en ny session
  useEffect(() => {
    if (fromPage && !fromPage.includes("session")) {
      localStorage.setItem("lastNonSessionPage", fromPage);
    }
  }, [fromPage]);

  // 🔹 Find campaignId — enten fra navigate state eller localStorage
  useEffect(() => {
    const idFromNav = location.state?.campaignId;
    const idFromStorage = localStorage.getItem("selectedCampaignId");
    const finalId = idFromNav || idFromStorage;
    if (!finalId) {
      console.warn("⚠️ No campaignId found — return to Home");
      navigate("/home");
      return;
    }
    setCampaignId(finalId);
    localStorage.setItem("selectedCampaignId", finalId);
  }, [location.state, navigate]);

  // 🔹 Hent sessions for campaign (testing testin med Rune)
  useEffect(() => {
    if (!campaignId) return;
    async function fetchSessions() {
      try {
        const q = query(
          collection(db, "Sessions"),
          where("campaignId", "==", campaignId)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Sessions hentet:", fetched);
        setSessions(fetched.sort((a, b) => b.sessNr - a.sessNr)); // sortér efter session-nummer
      } catch (err) {
        console.error("🔥 Firestore fejl:", err);
      }
    }
    fetchSessions();
  }, [campaignId]);



  const createNewSession = async () => {
    if (!campaignId) return;

    try {
      // 🔹 Hent eksisterende sessions for denne campaign
      const q = query(
        collection(db, "Sessions"),
        where("campaignId", "==", campaignId)
      );
      const snapshot = await getDocs(q);
      const existingSessions = snapshot.docs.map((d) => d.data());

      // 🔹 Find næste nummer
      const highestSessNr = existingSessions.reduce(
        (max, s) => Math.max(max, s.sessNr || 0),
        0
      );
      const nextSessNr = highestSessNr + 1;

      // 🔹 Gør ID unikt for campaign
      const sessionId = `${campaignId}_sess_${nextSessNr
        .toString()
        .padStart(3, "0")}`;

      // 🔹 Opret nyt session-objekt
      const newSession = {
        title: `Session ${nextSessNr}`,
        campaignId,
        sessNr: nextSessNr,
        dmNotes: "",
        encounters: [],
        combatMaps: [],
        createdAt: new Date(),
      };

      // 🔹 Gem med custom ID i Firestore
      await setDoc(doc(db, "Sessions", sessionId), newSession);

      // 🔹 Opdater campaignens info (antal sessions + sidst åbnet)
      const campaignRef = doc(db, "Campaigns", campaignId);
      await updateDoc(campaignRef, {
        sessionsCount: (existingSessions?.length || 0) + 1,
        lastOpened: new Date(),
      });

      // 🔹 Opdater lokalt
      setSessions((prev) => [...prev, { id: sessionId, ...newSession }]);

      // 🔹 Naviger direkte til SessionEdit
      navigate("/session-edit", { state: { sessionId } });

      console.log(`✅ Ny session oprettet med ID: ${sessionId}`);
    } catch (err) {
      console.error("🔥 Fejl ved oprettelse af ny session:", err);
    }
  };

  // 🔹 Håndter valg af session
  const handleSelectSession = (session) => {
    setSelectedSession((prev) => (prev?.id === session.id ? null : session));
  };

  

  useEffect(() => {
    console.log("🧭 Session opened from:", fromPage);
  }, [fromPage]);

  return (
    <div className="flex justify-center space-x-8 p-8 min-h-screen bg-[#1C1B18] text-[var(--primary)] font-serif select-none">
      {/* Venstre side: sessionliste */}
      

      <section className="flex flex-col justify-center w-1/3 space-y-4">
        <h2 className="text-lg uppercase tracking-widest font-semibold">
          Choose a Session
        </h2>

        <button
          className="flex flex-row justify-center space-x-2 bg-transparent border border-[var(--primary)] text-[var(--primary)] font-semibold py-2 px-4 rounded hover:bg-[var(--primary)]/10 transition"
          onClick={createNewSession}
        >
          + New Session
        </button>

        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[60vh]">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSelectSession(session)}
              className={`flex justify-center gap-x-2 items-center bg-transparent border border-[var(--primary)] text-[var(--primary)] font-semibold py-2 px-4 rounded hover:bg-[var(--primary)]/10 transition cursor-pointer p-5 rounded-md shadow-inner transition-shadow duration-300 border-[var(--primary)]/50 bg-[#292621] hover:shadow-[0_0_15px_#DACA89]/60 ${
                selectedSession?.id === session.id ? "bg-[#2E2C27]" : ""
              }`}
            >
              <h3 className="text-lg uppercase tracking-widest font-semibold">
                {session.title || `Session ${session.sessNr}`}
              </h3>
              <p className="text-sm opacity-70">Session #{session.sessNr}</p>
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="italic text-[var(--primary)]/60 mt-4">
              No existing sessions yet.
            </p>
          )}
        </div>
      </section>

      

      {/* Højre side: detaljer */}
      {selectedSession && (
        <section className="flex flex-col justify-start w-1/3 space-y-4 border-l border-[var(--primary)]/50 pl-8">
          <h2 className="text-xl uppercase tracking-widest font-semibold">
            {selectedSession.title}
          </h2>

          {/* DM Notes */}
          <div className="border border-[var(--primary)]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">
              DM Notes
            </h3>
            <p className="text-[var(--primary)]/90 whitespace-pre-wrap">
              {selectedSession.dmNotes || "Ingen noter endnu"}
            </p>
          </div>

          {/* Encounters */}
          <div className="border border-[var(--primary)]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">
              Encounters
            </h3>
            {selectedSession.encounters?.length > 0 ? (
              selectedSession.encounters.map((enc) => (
                <p key={enc.id} className="text-[var(--primary)]/90">
                  {enc.name}
                </p>
              ))
            ) : (
              <p className="text-[var(--primary)]/70 italic">Ingen encounters endnu</p>
            )}
          </div>

          {/* Combat Maps */}
          <div className="border border-[var(--primary)]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">
              Combat Maps
            </h3>
            {selectedSession.combatMaps?.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {selectedSession.combatMaps.map((map) => (
                  <div
                    key={map.id}
                    className="flex flex-col items-center border border-[var(--primary)]/40 rounded p-2 bg-[#1F1E1A]"
                  >
                    <img
                      src={map.image}
                      alt={map.title}
                      className="w-24 h-16 object-cover rounded mb-1"
                    />
                    <p className="text-xs">{map.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--primary)]/70 italic">Ingen maps endnu</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="border border-[var(--primary)] rounded py-2 px-4 hover:bg-[var(--primary)]/10 transition"
              onClick={() =>
                navigate("/session-edit", {
                  state: { sessionId: selectedSession.id },
                })
              }
            >
              Edit Session
            </button>
            <button
              className="border border-[var(--primary)] rounded py-2 px-4 hover:bg-[var(--primary)]/10 transition"
              onClick={() =>
                navigate("/session-run", {
                  state: { sessionId: selectedSession.id },
                })
              }
            >
              Run Session
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
