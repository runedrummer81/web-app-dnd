import React, { useState } from "react";

export default function CreatureResult({ creature, onAdd }) {
  const [showStats, setShowStats] = useState(false);

  return (
    <div
      className="relative group bg-gray-800/60 hover:bg-yellow-800/40 border border-yellow-700 rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all"
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
      onClick={() => onAdd(creature)}
    >
      <h3 className="text-lg font-semibold text-yellow-200">{creature.name}</h3>

      {showStats && (
        <div className="absolute left-full top-0 ml-4 z-50 w-[400px] bg-gray-900 text-gray-100 border border-yellow-700 rounded-xl p-4 shadow-2xl">
          <h2 className="text-2xl text-yellow-300 font-bold mb-2">
            {creature.name}
          </h2>
          <p className="italic text-sm text-gray-400 mb-2">
            {creature.size} {creature.type}, {creature.alignment}
          </p>

          <div className="grid grid-cols-2 gap-1 text-sm mb-2">
            <p>
              <strong>AC:</strong> {creature.ac}
            </p>
            <p>
              <strong>HP:</strong> {creature.hp}
            </p>
            <p>
              <strong>Speed:</strong> {creature.speed}
            </p>
            <p>
              <strong>CR:</strong> {creature.cr}
            </p>
          </div>

          {/* Ability Scores */}
          <div className="grid grid-cols-6 gap-2 text-center text-xs border-t border-b border-gray-700 py-2 mb-2">
            {Object.entries(creature.stats || {}).map(([key, val]) => (
              <div key={key}>
                <p className="font-bold text-yellow-300">{key.toUpperCase()}</p>
                <p>{val}</p>
              </div>
            ))}
          </div>

          {/* Traits */}
          {creature.traits && creature.traits.length > 0 && (
            <div className="mb-2">
              <h4 className="font-bold text-yellow-400">Traits</h4>
              {creature.traits.map((t, i) => (
                <p key={i} className="text-sm mb-1">
                  <strong>{t.name}.</strong> {t.desc}
                </p>
              ))}
            </div>
          )}

          {/* Actions */}
          {creature.actions && creature.actions.length > 0 && (
            <div className="mb-2">
              <h4 className="font-bold text-yellow-400">Actions</h4>
              {creature.actions.map((a, i) => (
                <p key={i} className="text-sm mb-1">
                  <strong>{a.name}.</strong> {a.desc}
                </p>
              ))}
            </div>
          )}

          {/* Bonus Actions */}
          {creature.bonus_actions && creature.bonus_actions.length > 0 && (
            <div>
              <h4 className="font-bold text-yellow-400">Bonus Actions</h4>
              {creature.bonus_actions.map((b, i) => (
                <p key={i} className="text-sm mb-1">
                  <strong>{b.name}.</strong> {b.desc}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
