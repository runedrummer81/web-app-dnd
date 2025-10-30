import { useState, useEffect } from "react";
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
import { doc, onSnapshot } from "firebase/firestore";
import BorderRunSession from "../components/session/BorderRunSession";

const DMPanelWrapper = ({
  sessionData,
  mapSetData,
  isPlayerWindowOpen,
  onEndSessionClick,
}) => {
  const { mapState, updateMapState } = useMapSync();

  const handleMapSwitch = (mapId) => {
    updateMapState({
      currentMapId: mapId,
      markers: [],
    });
  };

  const handleWeatherChange = (newWeather) => {
    updateMapState({
      weather: newWeather,
    });
  };

  return (
    <DMPanel
      sessionData={sessionData}
      mapSetData={mapSetData}
      onMapSwitch={handleMapSwitch}
      currentMapId={mapState.currentMapId}
      weather={mapState.weather}
      onWeatherChange={handleWeatherChange}
      isPlayerWindowOpen={isPlayerWindowOpen}
      onEndSessionClick={onEndSessionClick}
    />
  );
};

const RunSession = ({ sessionId, mapSetData }) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerWindowRef, setPlayerWindowRef] = useState(null);
  const [isPlayerWindowOpen, setIsPlayerWindowOpen] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);

  const openPlayerDisplay = () => {
    const playerWindow = window.open(
      `/player-view?session=${sessionId}`,
      "DnD Player View",
      "width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no"
    );
    setPlayerWindowRef(playerWindow);
    setIsPlayerWindowOpen(true);
  };

  useEffect(() => {
    return () => {
      if (playerWindowRef && !playerWindowRef.closed) {
        playerWindowRef.close();
      }
    };
  }, [playerWindowRef]);

  useEffect(() => {
    if (!sessionId) return;

    // Listen for real-time updates from Firestore
    const unsub = onSnapshot(doc(db, "Sessions", sessionId), (snapshot) => {
      if (snapshot.exists()) {
        setSessionData(snapshot.data());
        setLoading(false);
      } else {
        console.warn("Session not found in Firestore");
        setLoading(false);
      }
    });

    return () => unsub();
  }, [sessionId]);

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
    <RunSessionContext.Provider value={{ mapSetData }}>
      <MapSyncProvider isDMView={true}>
        <ConfirmEndSessionModal
          show={showEndSessionConfirm}
          onCancel={() => setShowEndSessionConfirm(false)}
          onConfirm={async () => {
            console.log("End session confirmed!");
            setShowEndSessionConfirm(false);
          }}
        />
        {/* Epic Player Display Button - Only show if not opened */}
        {!isPlayerWindowOpen && (
          <PlayerDisplayButton onClick={openPlayerDisplay} />
        )}
        <CombatStateProvider>
          <div className="w-screen h-screen flex bg-black overflow-hidden">
            {/* Map Display - Left Side */}
            <div className=" lg:block lg:w-[65%] h-full">
              <MapDisplay className=" w-full h-full"/>
            </div>

            {/* DM Info Box - Right Side */}
            <div className="hidden lg:flex lg:w-[35%] h-full relative bg-[#151612] flex-col">
              {/* Art Deco Border Frame */}
              <BorderRunSession />

              {/* Content inside the border frame */}
              <div className={`absolute inset-0 flex flex-col `}>
                {/* DM Panel Content - Takes full space when button is hidden */}
                <div className={`flex-1 overflow-hidden `}>
                  <DMPanelWrapper
                    sessionData={sessionData}
                    mapSetData={mapSetData}
                    isPlayerWindowOpen={isPlayerWindowOpen}
                    onEndSessionClick={() => setShowEndSessionConfirm(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CombatStateProvider>
      </MapSyncProvider>
    </RunSessionContext.Provider>
  );
};

export default RunSession;
