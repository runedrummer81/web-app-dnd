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
  });

  const makeChoice = (choice) => {
    setFortressState((prev) => ({
      ...prev,
      phase: "infiltration",
      choiceMade: choice,
    }));
  };

  const endFortressEncounter = () => {
    setFortressState({
      active: false,
      phase: null,
      choiceMade: null,
    });
  };

  useEffect(() => {
    const channel = new BroadcastChannel("fortress-sync");

    channel.onmessage = (event) => {
      if (event.data.type === "FORTRESS_STATE_UPDATE") {
        setFortressState(event.data.payload);
      }
    };

    return () => channel.close();
  }, []);

  // When state changes, broadcast it
  const startFortressEncounter = () => {
    const newState = { active: true, phase: "choice", choiceMade: null };
    setFortressState(newState);

    const channel = new BroadcastChannel("fortress-sync");
    channel.postMessage({
      type: "FORTRESS_STATE_UPDATE",
      payload: newState,
    });
    channel.close();
  };

  return (
    <FortressContext.Provider
      value={{
        fortressState,
        startFortressEncounter,
        makeChoice,
        endFortressEncounter,
      }}
    >
      {children}
    </FortressContext.Provider>
  );
};
