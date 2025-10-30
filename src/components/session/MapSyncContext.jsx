import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const MapSyncContext = createContext();
export const RunSessionContext = createContext();

export const useMapSync = () => {
  const context = useContext(MapSyncContext);
  if (!context) throw new Error("useMapSync must be used within MapSyncProvider");
  return context;
};

export const MapSyncProvider = ({ children, isDMView = true }) => {
  const [mapState, setMapState] = useState({
    currentMapId: "world",
    viewport: null,
    dmContainerSize: null,
    markers: [],
    isInCombat: false,
    weather: { snow: false, aurora: false, timeOfDay: "day" },
    route: { waypoints: [], visibleToPlayers: false },
    routeSettingMode: false,
    viewportPercent: null,
  });

  const broadcastRef = useRef(null);

  useEffect(() => {
    const channel = new BroadcastChannel("dnd-session-sync");
    broadcastRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "MAP_STATE_UPDATE" && !isDMView) {
        setMapState(event.data.payload);
      }
    };

    return () => channel.close();
  }, [isDMView]);

  // useCallback forhindrer at updateMapState bliver genoprettet hver render
  const updateMapState = useCallback((updates) => {
    setMapState(prev => {
      const newState = { ...prev, ...updates };
      if (isDMView && broadcastRef.current) {
        broadcastRef.current.postMessage({ type: "MAP_STATE_UPDATE", payload: newState });
      }
      return newState;
    });
  }, [isDMView]);

  return (
    <MapSyncContext.Provider value={{ mapState, updateMapState, isDMView }}>
      {children}
    </MapSyncContext.Provider>
  );
};