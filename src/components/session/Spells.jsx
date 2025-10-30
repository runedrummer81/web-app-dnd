import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function SpellBook() {
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        console.log("Starting to fetch spells...");
        console.log("Database instance:", db);

        const spellsCollection = collection(db, "Spells");
        console.log("Collection reference:", spellsCollection);

        const querySnapshot = await getDocs(spellsCollection);
        console.log("Query completed. Size:", querySnapshot.size);
        console.log("Is empty?", querySnapshot.empty);

        const spellList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`Doc ${doc.id}:`, data);
          return {
            id: doc.id,
            ...data,
          };
        });

        console.log("Final spell list:", spellList);
        setSpells(spellList);
      } catch (error) {
        console.error("Error fetching spells:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#d9ca89] uppercase tracking-wider">
        Spellbook
      </h2>

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
      ) : spells.length === 0 ? (
        <div
          className="text-center py-12 text-[#BF883C]/50 text-sm uppercase tracking-wider"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Your spellbook is currently under construction. Please check back
          later!
        </div>
      ) : (
        <div className="space-y-4">
          {spells.map((spell, index) => (
            <motion.div
              key={spell.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative border-2 border-[#BF883C]/20 bg-[#151612]/50 p-4 hover:border-[#BF883C]/40 transition-all "
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className="text-lg font-bold text-[#d9ca89] uppercase"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    {spell.name || spell.id}
                  </p>
                  {spell.range && (
                    <p
                      className="text-xs text-[#BF883C]/70 uppercase tracking-wider"
                      style={{ fontFamily: "EB Garamond, serif" }}
                    >
                      Range: {spell.range}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
