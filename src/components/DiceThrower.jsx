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
    <div className="z-50 flex items-center">
      <div className="flex items-center">
        {/* Toggle button */}
        <button
          onClick={() => {
            if (rollResults) {
              setRollResults(false); // close rollResults only
            } else {
              setOpen(!open); // toggle menu
            }
          }}
          className="p-4 cursor-pointer transition-all transform hover:scale-105"
          title={open ? "Close Dice Menu" : "Open Dice Menu"}
        >
          {open ? (
            <AiOutlineClose size={24} className="text-[var(--primary)]" />
          ) : (
            <FaDiceD20 size={24} className="text-[var(--primary)]" />
          )}
        </button>

        {/* Dice panel */}
        {open && (
          <div className="absolute left-30 flex items-center ml-5 animate-fadeIn gap-3">
            {DICE_TYPES.map((die) => {
              const Icon = die.icon;
              return (
                <div key={die.name} className="relative">
                  <button
                    onClick={() => handleDiceClick(die.name)}
                    className="p-2 hover:border-2 hover:border-[var(--primary)] rounded-full text-white transition-all shadow-inner hover:shadow-lg hover:scale-110 transform"
                    title={`Click to add ${die.name}`}
                  >
                    <Icon
                      size={35}
                      className={`${
                        die.name === "d4"
                          ? "text-red-500"
                          : die.name === "d6"
                          ? "text-blue-500"
                          : die.name === "d8"
                          ? "text-green-500"
                          : die.name === "d10"
                          ? "text-yellow-500"
                          : die.name === "d12"
                          ? "text-purple-500"
                          : "text-pink-500"
                      }`}
                    />
                  </button>

                  {/* Delete button only shows when die count > 0 */}
                  {diceCounters[die.name] > 0 && (
                    <span className="absolute -top-2 left-0 flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setDiceCounters({
                            ...diceCounters,
                            [die.name]: diceCounters[die.name] - 1,
                          });
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-400"
                        title={`Remove one ${die.name}`}
                      >
                        -
                      </button>
                    </span>
                  )}

                  {/* Red counter */}
                  {diceCounters[die.name] > 0 && (
                    <span className="absolute -top-2 right-0 bg-[var(--primary)] text-xs w-5 h-5 rounded-full flex items-center justify-center text-[var(--dark-muted-bg)] font-bold">
                      {diceCounters[die.name]}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Roll Button */}
            <div className="ml-4 inline-block border-2 border-[var(--secondary)] p-1 hover:scale-105">
              <button
                onClick={handleRoll}
                className="px-5 py-2 bg-[var(--primary)] text-[var(--dark-muted-bg)] font-bold transition-all"
              >
                Roll
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roll results */}
      {rollResults && (
        <div className="absolute left-30 bottom-10 animate-fadeIn p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h4 className="uppercase font-bold text-[var(--primary)]">
                Dice Roll Results
              </h4>
            </div>

            <ul className="text-sm flex gap-10">
              {Object.entries(rollResults.results).map(([die, rolls]) => (
                <li key={die}>
                  {die}: {rolls.join(", ")}
                </li>
              ))}
            </ul>

            <p className="font-bold ">Total: {rollResults.total}</p>
          </div>
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
