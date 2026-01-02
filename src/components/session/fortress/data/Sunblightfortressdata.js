// Sunblight Fortress Room Data
// Based on Rime of the Frostmaiden Chapter 3

export const FORTRESS_LEVELS = {
  ICE_GATE: "ice-gate",
  COMMAND: "command",
  FORGE: "forge",
};

export const fortressRooms = {
  // COMMAND LEVEL (Middle - where players enter)
  X1: {
    id: "X1",
    name: "Entrance",
    level: FORTRESS_LEVELS.COMMAND,
    description:
      "A ten-foot-high double door of featureless stone. An arrow slit guards the approach.",
    readAloud:
      "Moving east from the top of the stairs leads you to the entrance of the fortress: a ten-foot-high double door of featureless stone. An arrow slit facing in your direction guards the approach.",
    features: [
      "Stone double doors (barred from within)",
      "Iron portcullis (lowered)",
      "Arrow slit (grants three-quarters cover)",
    ],
    specialMechanics: {
      doors:
        "Barred shut from within. Can be opened with knock spell or from area X6.",
      portcullis: "Can be raised from X6's winch, or forced with knock spell.",
      duergarGuard:
        "Duergar in X6 watches through arrow slit. Turns invisible when characters approach. Loyal to Grandolpha - will secretly help party by opening doors.",
    },
    enemies: [],
    loot: [],
    connections: ["X6"], // Connects to X6 when doors/portcullis open
    gridBounds: null, // Will define these when we have exact map coordinates
  },

  X2: {
    id: "X2",
    name: "Barracks",
    level: FORTRESS_LEVELS.COMMAND,
    description: "Living quarters for duergar guards",
    readAloud: "", // Will fill in from sourcebook
    features: [],
    enemies: [],
    loot: [],
    connections: ["X3", "X4"],
    gridBounds: null,
  },

  // ... More rooms will be added as we build this out
  // For now, starting with X1 to get the system working

  // ICE GATE LEVEL (Top)
  X13: {
    id: "X13",
    name: "West Guard Post",
    level: FORTRESS_LEVELS.ICE_GATE,
    description: "",
    readAloud: "",
    features: [],
    enemies: [],
    loot: [],
    connections: [],
    gridBounds: null,
  },

  // FORGE LEVEL (Bottom)
  X16: {
    id: "X16",
    name: "Underdark Tunnel",
    level: FORTRESS_LEVELS.FORGE,
    description: "",
    readAloud: "",
    features: [],
    enemies: [],
    loot: [],
    connections: [],
    gridBounds: null,
  },
};

// Starting configuration
export const FORTRESS_START = {
  room: "X1",
  level: FORTRESS_LEVELS.COMMAND,
  partyPosition: { x: 100, y: 100 }, // Will adjust based on actual map
};
