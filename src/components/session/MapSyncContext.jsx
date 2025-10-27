import { createContext, useContext, useState, useEffect, useRef } from "react";

const MapSyncContext = createContext();
export const RunSessionContext = createContext();

export const useMapSync = () => {
  const context = useContext(MapSyncContext);
  if (!context) {
    throw new Error("useMapSync must be used within MapSyncProvider");
  }
  return context;
};

export const MapSyncProvider = ({ children, isDMView = true }) => {
  const [mapState, setMapState] = useState({
    currentMapId: "world",
    viewport: {
      center: [1000, 1000],
      zoom: 1,
    },
    markers: [],
    isInCombat: false,
    weather: {
      snow: false,
      aurora: false,
      timeOfDay: "day",
    },
    route: {
      waypoints: [],
      visibleToPlayers: false,
    },
    routeSettingMode: false, // ✅ ADD THIS
  });

  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    const channel = new BroadcastChannel("dnd-session-sync");
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "MAP_STATE_UPDATE" && !isDMView) {
        setMapState(event.data.payload);
      }
    };

    return () => {
      channel.close();
    };
  }, [isDMView]);

  const updateMapState = (updates) => {
    setMapState((prev) => {
      const newState = { ...prev, ...updates };

      if (isDMView && broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: "MAP_STATE_UPDATE",
          payload: newState,
        });
      }

      return newState;
    });
  };

  const value = {
    mapState,
    updateMapState,
    isDMView,
  };

  return (
    <MapSyncContext.Provider value={value}>{children}</MapSyncContext.Provider>
  );
};
