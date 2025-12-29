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
    tokens: [],
    initiativeOrder: [],
    currentTurnIndex: 0,
    combatRound: 1,
    combatTransition: {
      isVisible: false,
      type: null,
    },
    spellEffects: [],
    spellEffectPreview: null,
    // FOG OF WAR - Now at the correct level
    fogOfWar: {
      enabled: false,
      revealedMask: null,
      isDrawing: false,
      brushSize: 50,
    },
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
    console.log("\n" + "=".repeat(60));
    console.log("🔧 updateMapState called");
    console.log("=".repeat(60));

    // Check if updates is a function (functional update)
    const isFunction = typeof updates === "function";
    console.log("Update type:", isFunction ? "FUNCTION" : "OBJECT");

    if (!isFunction) {
      console.log("Updates received:", updates);
      console.log("Keys being updated:", Object.keys(updates));
    }

    setMapState((prev) => {
      // If updates is a function, call it with previous state
      const actualUpdates = isFunction ? updates(prev) : updates;

      console.log("\n📊 BEFORE UPDATE:");
      console.log("  - activeSummons:", prev.activeSummons?.length || 0);
      console.log("  - tokens:", prev.tokens?.length || 0);
      console.log("  - summonEffects:", prev.summonEffects?.length || 0);

      const newState = { ...prev, ...actualUpdates };

      console.log("\n📊 AFTER UPDATE:");
      console.log("  - activeSummons:", newState.activeSummons?.length || 0);
      console.log("  - tokens:", newState.tokens?.length || 0);
      console.log("  - summonEffects:", newState.summonEffects?.length || 0);

      // Detailed logging for activeSummons and tokens
      if (actualUpdates.hasOwnProperty("activeSummons")) {
        console.log("\n🔍 activeSummons change:");
        console.log(
          "  FROM:",
          prev.activeSummons?.map((s) => s.id)
        );
        console.log(
          "  TO:",
          newState.activeSummons?.map((s) => s.id)
        );
      }

      if (actualUpdates.hasOwnProperty("tokens")) {
        console.log("\n🔍 tokens change:");
        console.log(
          "  FROM:",
          prev.tokens?.map((t) => t.id)
        );
        console.log(
          "  TO:",
          newState.tokens?.map((t) => t.id)
        );
      }

      if (isDMView && broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: "MAP_STATE_UPDATE",
            payload: newState,
          });
          console.log("\n📡 Broadcasting state update to players");
        } catch (error) {
          console.error("❌ Error broadcasting state:", error);
        }
      }

      console.log("=".repeat(60) + "\n");
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
