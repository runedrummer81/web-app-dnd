import React, { useState } from "react";
import { motion } from "framer-motion";
import { spellsData } from "../../data/spells";
import { useMapSync } from "./MapSyncContext";

export default function SpellBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedSpell, setDraggedSpell] = useState(null);
  const { updateMapState, mapState } = useMapSync();

  // Listen for spell drop on map - creates PREVIEW effect
  React.useEffect(() => {
    const handleSpellDrop = (event) => {
      if (!draggedSpell) return;

      const { position } = event.detail;

      console.log("🔮 Spell dropped at position:", position);

      // Create PREVIEW spell effect
      const previewEffect = {
        id: `spell-preview-${Date.now()}`,
        name: draggedSpell.name,
        position: position,
        radius: 100,
        effectURL: draggedSpell.effectURL,
        color: draggedSpell.color,
        isPreview: true, // Mark as preview
      };

      console.log("🔮 Creating preview effect:", previewEffect);

      // Set as preview (only one preview at a time)
      updateMapState({
        spellEffectPreview: previewEffect,
      });

      setDraggedSpell(null);
    };

    window.addEventListener("spellDropped", handleSpellDrop);
    return () => window.removeEventListener("spellDropped", handleSpellDrop);
  }, [draggedSpell, updateMapState]);

  const filteredSpells = spellsData.filter((spell) =>
    spell.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (spell, e) => {
    console.log("🔮 Dragging spell:", spell);
    setDraggedSpell(spell);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("spell", JSON.stringify(spell));

    const img = e.target.querySelector("img");
    if (img) {
      e.dataTransfer.setDragImage(img, 40, 40);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 p-3 rounded">
        <p className="text-xs text-[var(--secondary)] uppercase">
          🔥 Drag spell icons onto the combat map to place effects
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search spells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-black/40 border border-[var(--primary)]/30 text-[#d9ca89] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {filteredSpells.length === 0 ? (
        <div className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider">
          No spells found.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {filteredSpells.map((spell, index) => (
            <motion.div
              key={spell.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              draggable
              onDragStart={(e) => handleDragStart(spell, e)}
              onDragEnd={() => setDraggedSpell(null)}
              className="flex flex-col items-center p-2 border-2 border-transparent hover:border-[var(--primary)] transition cursor-grab active:cursor-grabbing"
            >
              <img
                className="h-20 w-20 object-cover pointer-events-none"
                src={spell.iconURL}
                alt={spell.name}
                draggable={false}
              />
              <p className="mt-2 text-sm font-bold text-[#d9ca89] uppercase text-center">
                {spell.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
