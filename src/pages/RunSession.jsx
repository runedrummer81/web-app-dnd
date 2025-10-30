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
          <div className="w-screen h-screen flex bg-black overflow-hidden">
            {/* Map Display - Left Side */}
            <div className=" lg:block lg:w-[65%] h-full">
              <MapDisplay className=" w-full h-full"/>
            </div>

            {/* DM Info Box - Right Side */}
            <div className="hidden lg:flex lg:w-[35%] h-full relative bg-[#151612] flex-col">
              {/* Art Deco Border Frame */}
              <div className="absolute inset-0 pointer-events-none z-50">
                {/* Corner SVGs - Top Left */}
                <div className="absolute top-0 left-0 w-12 h-12 lg:w-16 lg:h-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 115.38 115.38"
                    className="w-full h-full object-contain"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon
                      points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="12.69 115.38 12.69 12.69 115.38 12.69"
                      stroke="#d9ca89"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                {/* Top Right */}
                <div className="absolute top-0 right-0 w-12 h-12 lg:w-16 lg:h-16 rotate-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 115.38 115.38"
                    className="w-full h-full object-contain"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon
                      points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="12.69 115.38 12.69 12.69 115.38 12.69"
                      stroke="#d9ca89"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-12 h-12 lg:w-16 lg:h-16 -rotate-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 115.38 115.38"
                    className="w-full h-full object-contain"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon
                      points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="12.69 115.38 12.69 12.69 115.38 12.69"
                      stroke="#d9ca89"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-12 h-12 lg:w-16 lg:h-16 rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 115.38 115.38"
                    className="w-full h-full object-contain"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon
                      points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
                      stroke="#BF883C"
                      strokeWidth="3"
                    />
                    <polyline
                      points="12.69 115.38 12.69 12.69 115.38 12.69"
                      stroke="#d9ca89"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                {/* Border Lines */}
                <div className="absolute top-0 left-12 right-12 lg:left-16 lg:right-16 h-[2px] bg-[#BF883C]"></div>
                <div className="absolute top-2 left-12 right-12 lg:left-16 lg:right-16 h-[2px] bg-[#d9ca89]"></div>
                <div className="absolute bottom-0 left-12 right-12 lg:left-16 lg:right-16 h-[2px] bg-[#BF883C]"></div>
                <div className="absolute bottom-2 left-12 right-12 lg:left-16 lg:right-16 h-[2px] bg-[#d9ca89]"></div>
                <div className="absolute left-0 top-12 bottom-12 lg:top-16 lg:bottom-16 w-[2px] bg-[#BF883C]"></div>
                <div className="absolute left-2 top-12 bottom-12 lg:top-16 lg:bottom-16 w-[2px] bg-[#d9ca89]"></div>
                <div className="absolute right-0 top-12 bottom-12 lg:top-16 lg:bottom-16 w-[2px] bg-[#BF883C]"></div>
                <div className="absolute right-2 top-12 bottom-12 lg:top-16 lg:bottom-16 w-[2px] bg-[#d9ca89]"></div>
              </div>

              {/* Content inside the border frame */}
              <div
                className={`absolute inset-0 flex flex-col ${
                  isPlayerWindowOpen
                    ? "pt-4 lg:pt-5 pb-12 lg:pb-16 px-3 lg:px-4"
                    : "pt-16 lg:pt-20 pb-12 lg:pb-16 px-3 lg:px-4"
                }`}
              >
                {/* Epic Player Display Button - Only show if not opened */}
                {!isPlayerWindowOpen && (
                  <PlayerDisplayButton onClick={openPlayerDisplay} />
                )}

                {/* DM Panel Content - Takes full space when button is hidden */}
                <div
                  className={`flex-1 overflow-hidden ${
                    isPlayerWindowOpen ? "" : "mt-4"
                  }`}
                >
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
