import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function SpellBook() {
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const spellsCollection = collection(db, "Spells");
        const querySnapshot = await getDocs(spellsCollection);

        const spellList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSpells(spellList);
      } catch (error) {
        console.error("Error fetching spells:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  // Filter spells based on search term
  const filteredSpells = spells.filter((spell) =>
    spell.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search spells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2  text-[#d9ca89] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {loading ? (
        <div
          className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Loading spells...
        </div>
      ) : error ? (
        <div
          className="text-center py-12 text-red-400 text-sm"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Error: {error}
        </div>
      ) : filteredSpells.length === 0 ? (
        <div
          className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
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
              className="flex flex-col items-center p-2 active:border-2 active:border-[var(--primary)]"
            >
              <img
                className="h-20 w-20 object-cover"
                src={spell.imageURL}
                alt={spell.name || "Spell image"}
              />
              <p className="mt-2 text-sm font-bold text-[#d9ca89] uppercase text-center">
                {spell.name || spell.id}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
