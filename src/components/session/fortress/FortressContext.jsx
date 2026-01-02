import { createContext, useContext, useState, useEffect } from "react";

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

  const endFortressEncounter = () => {
    const newState = {
      active: false,
      phase: null,
      choiceMade: null,
      isRevealed: false,
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
        endFortressEncounter,
      }}
    >
      {children}
    </FortressContext.Provider>
  );
};
