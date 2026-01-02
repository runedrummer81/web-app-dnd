import { createContext, useContext, useState, useEffect } from "react";

// Define fortress levels here (or import if you have them in sunblightFortressData.js)
export const FORTRESS_LEVELS = {
  ICE_GATE: "ice-gate",
  COMMAND: "command",
  FORGE: "forge",
};

const FortressContext = createContext();

export const useFortress = () => {
  const context = useContext(FortressContext);
  if (!context) {
    throw new Error("useFortress must be used within FortressProvider");
  }
  return context;
};

export const FortressProvider = ({ children }) => {
  const [fortressState, setFortressState] = useState({
    active: false,
    phase: null, // null | "choice" | "infiltration" | "complete"
    choiceMade: null, // null | "fortress" | "dragon"
    isRevealed: false, // Whether choice options are revealed
    currentLevel: FORTRESS_LEVELS.COMMAND, // Ice Gate, Command, or Forge
    currentRoom: "X1", // Current room ID
    revealedRooms: [], // Array of room IDs that have been revealed
  });

  // Broadcast state updates to other windows
  const broadcastState = (newState) => {
    const channel = new BroadcastChannel("fortress-sync");
    channel.postMessage({
      type: "FORTRESS_STATE_UPDATE",
      payload: newState,
    });
    channel.close();
  };

  const startFortressEncounter = () => {
    const newState = {
      active: true,
      phase: "choice",
      choiceMade: null,
      isRevealed: false,
      currentLevel: FORTRESS_LEVELS.COMMAND,
      currentRoom: "X1",
      revealedRooms: [],
    };
    setFortressState(newState);
    broadcastState(newState);
  };

  const revealChoices = () => {
    setFortressState((prev) => {
      const newState = {
        ...prev,
        isRevealed: true,
      };
      broadcastState(newState);
      return newState;
    });
  };

  const makeChoice = (choice) => {
    setFortressState((prev) => {
      const newState = {
        ...prev,
        phase: "infiltration",
        choiceMade: choice,
      };
      broadcastState(newState);
      return newState;
    });
  };

  const setCurrentRoom = (roomId) => {
    setFortressState((prev) => {
      const newState = {
        ...prev,
        currentRoom: roomId,
      };
      broadcastState(newState);
      return newState;
    });
  };

  const switchFortressLevel = (level) => {
    setFortressState((prev) => {
      const newState = {
        ...prev,
        currentLevel: level,
      };
      broadcastState(newState);
      return newState;
    });
  };

  const endFortressEncounter = () => {
    const newState = {
      active: false,
      phase: null,
      choiceMade: null,
      isRevealed: false,
      currentLevel: FORTRESS_LEVELS.COMMAND,
      currentRoom: "X1",
      revealedRooms: [],
    };
    setFortressState(newState);
    broadcastState(newState);
  };

  // Listen for state updates from other windows
  useEffect(() => {
    const channel = new BroadcastChannel("fortress-sync");

    channel.onmessage = (event) => {
      if (event.data.type === "FORTRESS_STATE_UPDATE") {
        setFortressState(event.data.payload);
      }
    };

    return () => channel.close();
  }, []);

  return (
    <FortressContext.Provider
      value={{
        fortressState,
        startFortressEncounter,
        revealChoices,
        makeChoice,
        switchFortressLevel,
        setCurrentRoom,
        endFortressEncounter,
      }}
    >
      {children}
    </FortressContext.Provider>
  );
};
