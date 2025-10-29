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

const RunSession = ({ sessionId, sessionData, mapSetData }) => {
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
        <CombatStateProvider>
          <div className="w-screen h-screen flex bg-[var(--dark-muted-bg)] overflow-hidden">
            {/* Map Display - Left Side */}
            <div className="relative lg:block lg:w-[65%] h-full">
              {/* Overlay gradient for darkness on sides & top */}

              {/* Epic Player Display Button - Only show if not opened */}
              {!isPlayerWindowOpen && (
                <PlayerDisplayButton onClick={openPlayerDisplay} />
              )}
              <MapDisplay />
            </div>

            {/* DM Info Box - Right Side */}
            <div className="hidden lg:flex lg:w-[35%] h-full relative  flex-col ">
              {/* Art Deco Border Frame */}
              <BorderRunSession />

              {/* Content inside the border frame */}
              <div className={`absolute inset-0 flex flex-col`}>
                {/* DM Panel Content - Takes full space when button is hidden */}
                <div className={`flex-1 overflow-hidden`}>
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
