import { useState, useEffect } from "react";
import { getDocs, addDoc, updateDoc, collection, query, where, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router";
import SessionComp from "../components/SessionComp";

export default function Session() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Find campaignId — enten fra navigate state eller localStorage
  useEffect(() => {
    const idFromNav = location.state?.campaignId;
    const idFromStorage = localStorage.getItem("selectedCampaignId");
    const finalId = idFromNav || idFromStorage;
    if (!finalId) {
      console.warn("⚠️ Ingen campaignId fundet — redirecter til Home");
      navigate("/home");
      return;
    }
    setCampaignId(finalId);
    localStorage.setItem("selectedCampaignId", finalId);
  }, [location.state, navigate]);

  // 🔹 Hent sessions for campaign
  useEffect(() => {
    if (!campaignId) return;
    async function fetchSessions() {
      try {
        const q = query(collection(db, "Sessions"), where("campaignId", "==", campaignId));
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

  // 🔹 Opret ny session
  const createNewSession = async () => {
  if (!campaignId) return;

  try {
    // 🔹 Find højeste sessNr
    const lastSession = sessions[sessions.length - 1];
    const nextSessNr = lastSession ? lastSession.sessNr + 1 : 1;

    // 🔹 Opret ny session
    const newSession = {
      title: `Session ${nextSessNr}`,
      campaignId: campaignId,
      sessNr: nextSessNr,
      dmNotes: "",
      encounters: [],
      combatMaps: [],
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "Sessions"), newSession);
    console.log("✅ Ny session oprettet:", docRef.id);

    // 🔹 Opdater campaignens sessionsCount i Firestore
    const campaignRef = doc(db, "Campaigns", campaignId);
    await updateDoc(campaignRef, {
      sessionsCount: (sessions?.length || 0) + 1,
      lastOpened: new Date(),
    });

    console.log("🧩 Campaign opdateret med nyt sessionsCount!");

    // 🔹 Opdater lokalt
    setSessions((prev) => [...prev, { id: docRef.id, ...newSession }]);
  } catch (err) {
    console.error("🔥 Fejl ved oprettelse af ny session:", err);
  }
};


  // 🔹 Håndter valg af session
  const handleSelectSession = (session) => {
    setSelectedSession((prev) => (prev?.id === session.id ? null : session));
  };

  return (
    <div className="flex justify-center space-x-8 p-8 min-h-screen bg-[#1C1B18] text-[#DACA89] font-serif select-none">
      {/* Venstre side: sessionliste */}
      <section className="flex flex-col justify-center w-1/3 space-y-4">
        <h2 className="text-lg uppercase tracking-widest font-semibold">Choose a Session</h2>

        <button
          className="flex flex-row justify-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
          onClick={createNewSession}
        >
          + New Session
        </button>

        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[60vh]">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-center gap-x-2 items-center bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
              className={`cursor-pointer p-5 border rounded-md shadow-inner transition-shadow duration-300 border-[#DACA89]/50 bg-[#292621] hover:shadow-[0_0_15px_#DACA89]/60 ${
                selectedSession?.id === session.id ? "bg-[#2E2C27]" : ""
              }`}
              onClick={() => handleSelectSession(session)}
            >
              <h3 className="text-lg uppercase tracking-widest font-semibold">
                {session.title || `Session ${session.sessNr}`}
              </h3>
              <p className="text-sm opacity-70">Session #{session.sessNr}</p>
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="italic text-[#DACA89]/60 mt-4">Ingen sessions endnu.</p>
          )}
        </div>
      </section>

      {/* Højre side: detaljer */}
      {selectedSession && (
        <section className="flex flex-col justify-start w-1/3 space-y-4 border-l border-[#DACA89]/50 pl-8">
          <h2 className="text-xl uppercase tracking-widest font-semibold">
            {selectedSession.title}
          </h2>

          {/* DM Notes */}
          <div className="border border-[#DACA89]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">DM Notes</h3>
            <p className="text-[#DACA89]/90 whitespace-pre-wrap">
              {selectedSession.dmNotes || "Ingen noter endnu"}
            </p>
          </div>

          {/* Encounters */}
          <div className="border border-[#DACA89]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">Encounters</h3>
            {selectedSession.encounters?.length > 0 ? (
              selectedSession.encounters.map((enc, i) => <p key={i}>{enc}</p>)
            ) : (
              <p className="text-[#DACA89]/70 italic">Ingen encounters endnu</p>
            )}
          </div>

          {/* Combat Maps */}
          <div className="border border-[#DACA89]/50 rounded p-3">
            <h3 className="uppercase text-sm tracking-wide opacity-80 mb-1">Combat Maps</h3>
            {selectedSession.combatMaps?.length > 0 ? (
              selectedSession.combatMaps.map((map, i) => <p key={i}>{map}</p>)
            ) : (
              <p className="text-[#DACA89]/70 italic">Ingen maps endnu</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
              onClick={() => navigate("/session-edit", { state: { sessionId: selectedSession.id } })}
            >
              Edit Session
            </button>
            <button
              className="border border-[#DACA89] rounded py-2 px-4 hover:bg-[#DACA89]/10 transition"
              onClick={() => navigate("/session-run", { state: { sessionId: selectedSession.id } })}
            >
              Run Session
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
