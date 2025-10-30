import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  MapSyncProvider,
  RunSessionContext,
} from "../components/session/MapSyncContext";
import { CombatStateProvider } from "../components/session/CombatStateContext";
import { MapDisplay } from "../components/session/MapDisplay";

export const PlayerView = () => {
  const [mapSetData, setMapSetData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session");

        if (!sessionId) {
          console.error("❌ No session ID in URL");
          setLoading(false);
          return;
        }

        console.log("🔍 Player View fetching session:", sessionId);

        const sessionRef = doc(db, "Sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
          console.error("❌ Session not found");
          setLoading(false);
          return;
        }

        const session = { id: sessionSnap.id, ...sessionSnap.data() };
        setSessionData(session);
        console.log("✅ Player View session fetched:", session);

        const campaignRef = doc(db, "Campaigns", session.campaignId);
        const campaignSnap = await getDoc(campaignRef);

        if (!campaignSnap.exists()) {
          console.error("❌ Campaign not found");
          setLoading(false);
          return;
        }

        const campaign = campaignSnap.data();
        console.log("✅ Player View campaign fetched:", campaign);

        if (campaign.mapSetId) {
          const mapSetRef = doc(db, "MapSets", campaign.mapSetId);
          const mapSetSnap = await getDoc(mapSetRef);

          if (mapSetSnap.exists()) {
            setMapSetData({ id: mapSetSnap.id, ...mapSetSnap.data() });
            console.log("✅ Player View mapSet fetched");
          }
        }
      } catch (error) {
        console.error("❌ Player View error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading player view...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black">
      <RunSessionContext.Provider value={{ mapSetData, sessionData }}>
        <MapSyncProvider isDMView={false}>
          <CombatStateProvider>
            {" "}
            {/* ← Added this wrapper! */}
            <div className="w-full h-full bg-black">
              <MapDisplay />
            </div>
          </CombatStateProvider>
        </MapSyncProvider>
      </RunSessionContext.Provider>
    </div>
  );
};
