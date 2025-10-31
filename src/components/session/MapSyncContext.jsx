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
    routeSettingMode: false,
    combatMapActive: false,
    activeCombatMap: null,
    creatureTokens: [],
    gridSettings: {
      visible: false,
      size: 40,
      color: "#d9ca89",
      opacity: 0.3,
    },
    // NEW: Token state
    tokens: [],
  });
  const broadcastChannelRef = useRef(null);
  useEffect(() => {
    if (!("BroadcastChannel" in window)) {
      console.error("❌ BroadcastChannel is not supported in this browser");
      return;
    }
    try {
      const channel = new BroadcastChannel("dnd-session-sync");
      broadcastChannelRef.current = channel;
      console.log(
        `✅ BroadcastChannel initialized (${isDMView ? "DM" : "Player"} View)`
      );
      channel.onmessage = (event) => {
        console.log(
          `📨 Received broadcast (${isDMView ? "DM" : "Player"} View):`,
          event.data
        );
        if (event.data.type === "MAP_STATE_UPDATE" && !isDMView) {
          console.log(
            "🔄 Updating player view with new state:",
            event.data.payload
          );
          setMapState(event.data.payload);
        }
      };
      channel.onerror = (error) => {
        console.error("❌ BroadcastChannel error:", error);
      };
      if (isDMView) {
        setTimeout(() => {
          channel.postMessage({
            type: "INIT_TEST",
            message: "DM View initialized",
          });
          console.log("🧪 Sent initialization test message");
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Error creating BroadcastChannel:", error);
    }
    return () => {
      if (broadcastChannelRef.current) {
        console.log(
          `🔌 Closing BroadcastChannel (${isDMView ? "DM" : "Player"} View)`
        );
        broadcastChannelRef.current.close();
      }
    };
  }, [isDMView]);
  const updateMapState = (updates) => {
    console.log(
      `🔄 updateMapState called (${isDMView ? "DM" : "Player"} View):`,
      updates
    );
    setMapState((prev) => {
      const newState = { ...prev, ...updates };
      console.log("📦 New state:", newState);
      if (isDMView && broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: "MAP_STATE_UPDATE",
            payload: newState,
          });
          console.log("📡 Broadcasting state update to players");
        } catch (error) {
          console.error("❌ Error broadcasting state:", error);
        }
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
