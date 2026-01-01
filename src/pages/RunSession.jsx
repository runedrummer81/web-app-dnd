import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  MapSyncProvider,
  RunSessionContext,
} from "../components/session/MapSyncContext";
import { CombatStateProvider } from "../components/session/CombatStateContext";
import { MapDisplay } from "../components/session/MapDisplay";
import { DMPanel } from "../components/session/DMPanel";
import { PlayerDisplayButton } from "../components/session/PlayerDisplayButton";
import { useMapSync } from "../components/session/MapSyncContext";
import { ConfirmEndSessionModal } from "../components/session/ConfirmEndSessionModal";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import BorderRunSession from "../components/session/BorderRunSession";
import { CombatTransition } from "../components/session/CombatTransition";
import { useCombatState } from "../components/session/CombatStateContext";
import PrepNotesOverlay from "../components/session/PrepNotesOverlay";
import {
  FortressProvider,
  useFortress,
} from "../components/session/fortress/FortressContext";
import { FortressChoiceOverlay } from "../components/session/fortress/FortressChoiceOverlay";

const DMPanelWrapper = ({
  sessionId,
  sessionData,
  mapSetData,
  isPlayerWindowOpen,
  onEndSessionClick,
  quickNotes,
  setQuickNotes,
  onRequestEndSessionConfirm,
  onOpenPrepNotes,
}) => {
  const { mapState, updateMapState } = useMapSync();

  const getCurrentMap = () => {
    if (!mapSetData) {
      return { width: 2000, height: 2000 };
    }

    if (mapState.currentMapId === "world") {
      return mapSetData.worldMap || { width: 2000, height: 2000 };
    }

    const cityMap = mapSetData.cityMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (cityMap) return cityMap;

    const dungeonMap = mapSetData.dungeonMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (dungeonMap) return dungeonMap;

    const locationMaps = mapSetData.locationMaps || [];
    for (const location of locationMaps) {
      const map = location.maps?.find((m) => m.id === mapState.currentMapId);
      if (map) return map;
    }

    const combatMap = sessionData?.combatMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (combatMap) {
      return {
        width: combatMap.width || 2000,
        height: combatMap.height || 2000,
      };
    }

    if (mapState.fillerMapData) {
      return mapState.fillerMapData;
    }

    return mapSetData.worldMap || { width: 2000, height: 2000 };
  };

  const handleMapSwitch = (mapId, fillerMapData = null) => {
    updateMapState({
      currentMapId: mapId,
      markers: [],
      fillerMapData: fillerMapData,
      fogOfWar: {
        enabled: false,
        revealedMask: null,
        isDrawing: false,
        brushSize: 50,
      },
    });
  };

  const handleWeatherChange = (newWeather) => {
    updateMapState({
      weather: newWeather,
    });
  };

  const handleEndCombat = () => {
    updateMapState({ currentMapId: "world", markers: [] });
  };

  return (
    <DMPanel
      sessionId={sessionId}
      sessionData={sessionData}
      mapSetData={mapSetData}
      onMapSwitch={handleMapSwitch}
      currentMapId={mapState.currentMapId}
      currentMap={getCurrentMap()}
      weather={mapState.weather}
      onWeatherChange={handleWeatherChange}
      isPlayerWindowOpen={isPlayerWindowOpen}
      onEndSessionClick={onEndSessionClick}
      quickNotes={quickNotes}
      setQuickNotes={setQuickNotes}
      onEndCombat={handleEndCombat}
      onRequestEndSessionConfirm={onRequestEndSessionConfirm}
      onOpenPrepNotes={onOpenPrepNotes}
    />
  );
};

const CombatWrapper = ({ children }) => {
  const { combatTransition, setCombatTransition } = useCombatState();

  return (
    <>
      {children}
      <CombatTransition
        type={combatTransition.type}
        isVisible={combatTransition.isVisible}
        onComplete={() => setCombatTransition({ isVisible: false, type: null })}
      />
    </>
  );
};

// NEW: Component that uses fortress state
const RunSessionContent = ({ sessionId, sessionData, mapSetData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [playerWindowRef, setPlayerWindowRef] = useState(null);
  const [isPlayerWindowOpen, setIsPlayerWindowOpen] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [quickNotes, setQuickNotes] = useState([]);
  const [showPrepNotes, setShowPrepNotes] = useState(false);

  // Access fortress state
  const { fortressState, makeChoice } = useFortress();

  const base = import.meta.env.BASE_URL || "/web-app-dnd/";

  const openPlayerDisplay = () => {
    const playerUrl = `${base}player-view?session=${sessionId}`;
    const playerWindow = window.open(
      playerUrl,
      "DnD Player View",
      "width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no"
    );

    setPlayerWindowRef(playerWindow);
    setIsPlayerWindowOpen(true);
  };

  const handleShowEndSessionConfirm = () => setShowEndSessionConfirm(true);

  useEffect(() => {
    return () => {
      if (playerWindowRef && !playerWindowRef.closed) {
        playerWindowRef.close();
      }
    };
  }, [playerWindowRef]);

  useEffect(() => {
    if (!sessionId) return;

    const unsub = onSnapshot(doc(db, "Sessions", sessionId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setQuickNotes(data.sessionNotes || []);
        setLoading(false);
      } else {
        console.warn("Session not found in Firestore");
        setLoading(false);
      }
    });

    return () => unsub();
  }, [sessionId]);

  const handleEndSession = async () => {
    try {
      console.log("🔚 Starting end session process...");

      if (playerWindowRef && !playerWindowRef.closed) {
        console.log("🪟 Closing player window...");
        playerWindowRef.close();
      }
      setPlayerWindowRef(null);
      setIsPlayerWindowOpen(false);

      console.log("💾 Saving session notes...");
      await updateDoc(doc(db, "Sessions", sessionId), {
        sessionNotes: quickNotes,
        endedAt: new Date(),
      });

      console.log("❌ Closing modal...");
      setShowEndSessionConfirm(false);

      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("🚀 Navigating to /session...");
      navigate("/session", {
        state: { campaignId: sessionData.campaignId },
        replace: true,
      });
    } catch (err) {
      console.error("❌ Error ending session:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[var(--primary)]">
        Loading session...
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        Could not load session data.
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-screen h-screen"
      >
        <ConfirmEndSessionModal
          show={showEndSessionConfirm}
          onCancel={() => setShowEndSessionConfirm(false)}
          onConfirm={handleEndSession}
        />
        {!isPlayerWindowOpen && (
          <PlayerDisplayButton onClick={openPlayerDisplay} />
        )}
        <div className="w-screen h-screen flex bg-black overflow-hidden">
          {/* Map Display - Left Side */}
          <div className="lg:block lg:w-[65%] h-full">
            <MapDisplay className="w-full h-full" />
          </div>

          {/* DM Info Box - Right Side */}
          <div className="hidden lg:flex lg:w-[35%] h-full relative bg-[#151612] flex-col">
            <BorderRunSession />

            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 overflow-hidden">
                <DMPanelWrapper
                  sessionId={sessionId}
                  sessionData={sessionData}
                  mapSetData={mapSetData}
                  isPlayerWindowOpen={isPlayerWindowOpen}
                  onEndSessionClick={handleShowEndSessionConfirm}
                  quickNotes={quickNotes}
                  setQuickNotes={setQuickNotes}
                  onRequestEndSessionConfirm={handleShowEndSessionConfirm}
                  onOpenPrepNotes={() => setShowPrepNotes(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <PrepNotesOverlay
        isOpen={showPrepNotes}
        onClose={() => setShowPrepNotes(false)}
        sessionData={sessionData}
        quickNotes={quickNotes}
        onQuickNotesChange={setQuickNotes}
      />

      {/* Fortress Choice Overlay - Shows on DM screen during choice phase */}
      {fortressState.phase === "choice" && (
        <FortressChoiceOverlay onChoiceSelect={makeChoice} isDMView={true} />
      )}
    </>
  );
};

// Main RunSession component - NOW WRAPPED with providers
const RunSession = ({ sessionId, sessionData, mapSetData }) => {
  return (
    <RunSessionContext.Provider value={{ mapSetData, sessionData }}>
      <MapSyncProvider isDMView={true}>
        <CombatStateProvider>
          <FortressProvider>
            <CombatWrapper>
              <RunSessionContent
                sessionId={sessionId}
                sessionData={sessionData}
                mapSetData={mapSetData}
              />
            </CombatWrapper>
          </FortressProvider>
        </CombatStateProvider>
      </MapSyncProvider>
    </RunSessionContext.Provider>
  );
};

export default RunSession;
