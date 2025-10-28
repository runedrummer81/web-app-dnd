import { Routes, Route, useLocation } from "react-router";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/CreateEncounter";
import NewCampaign from "./pages/NewCampaign";
import ProtectedRoute from "./components/ProtectedRoute";
import Session from "./pages/Session";
import SessionEdit from "./pages/SessionEdit";
import LoadPage from "./pages/loadPage";
import Border from "./components/Border";
import BG from "./components/BG";
import RunSession from "./pages/RunSession";
import { PlayerView } from "./pages/PlayerView"; // ✅ Changed from ./pages/RunSession
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Title from "./components/Title";

// Wrapper component to fetch session data AND map data before loading RunSession
function RunSessionWrapper() {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [mapSetData, setMapSetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndMaps = async () => {
      try {
        console.log("🔍 Fetching session:", sessionId);

        // 1. Fetch session data
        const sessionRef = doc(db, "Sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
          console.error("❌ Session not found");
          setLoading(false);
          return;
        }

        const session = {
          id: sessionSnap.id,
          ...sessionSnap.data(),
        };
        setSessionData(session);
        console.log("✅ Session fetched:", session);

        // 2. Fetch campaign data to get mapSetId
        console.log("🔍 Fetching campaign:", session.campaignId);
        const campaignRef = doc(db, "Campaigns", session.campaignId);
        const campaignSnap = await getDoc(campaignRef);

        if (!campaignSnap.exists()) {
          console.error("❌ Campaign not found");
          setLoading(false);
          return;
        }

        const campaign = campaignSnap.data();
        console.log("✅ Campaign fetched:", campaign);

        // 3. Fetch map set data
        if (campaign.mapSetId) {
          console.log("🔍 Fetching mapSet:", campaign.mapSetId);
          const mapSetRef = doc(db, "MapSets", campaign.mapSetId);
          const mapSetSnap = await getDoc(mapSetRef);

          if (mapSetSnap.exists()) {
            const mapSet = {
              id: mapSetSnap.id,
              ...mapSetSnap.data(),
            };
            setMapSetData(mapSet);
            console.log("✅ MapSet fetched:", mapSet);
          } else {
            console.warn("⚠️ Map set not found, using default");
          }
        } else {
          console.warn("⚠️ Campaign has no mapSetId");
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionAndMaps();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-[var(--primary)] text-2xl">Loading session...</div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-600 text-2xl">Session not found</div>
      </div>
    );
  }

  return (
    <RunSession
      sessionId={sessionId}
      sessionData={sessionData}
      mapSetData={mapSetData}
    />
  );
}

export default function App() {
  const location = useLocation();

  // Check if we're on a "session running" page where we don't want Nav/Border/BG
  const isSessionRunning =
    location.pathname.startsWith("/run-session") ||
    location.pathname === "/player-view";

  return (
    <>
      {/* Only show Nav, Border, and BG when NOT in session running mode */}
      {!isSessionRunning && (
        <>
          <Nav />
          <Border currentPath={location.pathname} />

          <BG />
          {/* <Title /> */}
        </>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/continue"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loadcampaign"
            element={
              <ProtectedRoute>
                <LoadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/encounters"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newcampaign"
            element={
              <ProtectedRoute>
                <NewCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session-edit"
            element={
              <ProtectedRoute>
                <SessionEdit />
              </ProtectedRoute>
            }
          />
          {/* Run Session Route - Full screen, no Nav/Border/BG */}
          <Route
            path="/run-session/:sessionId"
            element={
              <ProtectedRoute>
                <RunSessionWrapper />
              </ProtectedRoute>
            }
          />
          {/* Player View - Full screen, no Nav/Border/BG */}
          <Route path="/player-view" element={<PlayerView />} />
        </Routes>
      </main>
    </>
  );
}
