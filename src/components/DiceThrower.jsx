import { useState } from "react";
import { FaDiceD20 } from "react-icons/fa";
import { GiD4, GiDiceEightFacesEight, GiD10, GiD12 } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { IoDice } from "react-icons/io5";

const DICE_TYPES = [
  { name: "d4", sides: 4, icon: GiD4 },
  { name: "d6", sides: 6, icon: IoDice },
  { name: "d8", sides: 8, icon: GiDiceEightFacesEight },
  { name: "d10", sides: 10, icon: GiD10 },
  { name: "d12", sides: 12, icon: GiD12 },
  { name: "d20", sides: 20, icon: FaDiceD20 },
];

export default function DiceThrower() {
  const [open, setOpen] = useState(false);
  const [diceCounters, setDiceCounters] = useState({
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
  });
  const [rollResults, setRollResults] = useState(null);

  // Sounds (placed in public/sounds/)
  const diceSound = new Audio("public/audio/dice-single.wav"); // single/multiple dice
  const criticalSound = new Audio("public/audio/critical-sound.wav"); // critical D20

  const handleDiceClick = (name) => {
    setDiceCounters((prev) => ({ ...prev, [name]: prev[name] + 1 }));
  };

  const handleRoll = () => {
    const results = {};
    let total = 0;
    let criticalD20 = false;

    for (let die of DICE_TYPES) {
      const rolls = [];
      for (let i = 0; i < diceCounters[die.name]; i++) {
        const roll = Math.floor(Math.random() * die.sides) + 1;
        rolls.push(roll);
        total += roll;

        if (die.name === "d20" && roll === 20) criticalD20 = true;
      }
      if (rolls.length > 0) results[die.name] = rolls;
    }

    setRollResults({ results, total });
    setOpen(false);

    // Reset dice counters
    setDiceCounters({
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 0,
    });

    // Play sound
    if (criticalD20) {
      criticalSound.play();
    } else {
      diceSound.play();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center">
      <div className="flex items-center">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-4 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white cursor-pointer transition-all shadow-lg transform hover:scale-105 hover:shadow-xl"
          title={open ? "Close Dice Menu" : "Open Dice Menu"}
        >
          {open ? <AiOutlineClose size={24} /> : <FaDiceD20 size={24} />}
        </button>

        {/* Dice panel */}
        {open && (
          <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-md border-2 border-yellow-600 rounded-full p-2 shadow-lg ml-2 animate-fadeIn">
            {DICE_TYPES.map((die) => {
              const Icon = die.icon;
              return (
                <div key={die.name} className="relative">
                  <button
                    onClick={() => handleDiceClick(die.name)}
                    className="p-2 bg-gray-700 hover:bg-yellow-700 rounded-full text-white transition-all shadow-inner hover:shadow-lg hover:scale-110 transform"
                    title={`Click to add ${die.name}`}
                  >
                    <Icon size={24} />
                  </button>
                  {/* Red counter */}
                  {diceCounters[die.name] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center text-white font-bold">
                      {diceCounters[die.name]}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Roll Button */}
            <button
              onClick={handleRoll}
              className="ml-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Roll
            </button>
          </div>
        )}
      </div>

      {/* Roll results */}
      {rollResults && (
        <div className="absolute bottom-20 left-0 bg-gray-900/95 text-white border-2 border-yellow-600 rounded-lg p-4 shadow-lg w-64 animate-fadeIn">
          <button
            onClick={() => setRollResults(null)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-400"
            title="Close"
          >
            ×
          </button>
          <h4 className="font-bold mb-2 text-yellow-400">Dice Roll Results</h4>
          <ul className="text-sm">
            {Object.entries(rollResults.results).map(([die, rolls]) => (
              <li key={die}>
                {die}: {rolls.join(", ")}
              </li>
            ))}
          </ul>
          <p className="font-bold mt-2 text-green-400">
            Total: {rollResults.total}
          </p>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}
      </style>
    </div>
  );
}
