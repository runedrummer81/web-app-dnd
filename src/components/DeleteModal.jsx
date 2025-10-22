import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteModal({ open, onClose, campaign, onConfirm }) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // close on outside click
        >
          <motion.div
            className="bg-[#1C1B18] p-8 w-96 max-w-[90%] flex flex-col items-center gap-6 relative shadow-[0_0_30px_rgba(191,136,60,0.6)] border-2 border-[#bf883c]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <p className="text-[#DACA89] text-center text-lg font-semibold">
              Are you sure you want to delete <br />
              <span className="text-[#bf883c]">
                {campaign?.title || campaign?.name || "this campaign"}
              </span>
              ?
            </p>

            <div className="flex gap-6 mt-4">
              <motion.button
                onClick={onConfirm}
                whileHover={{ boxShadow: "0 0 20px rgba(255,80,80,0.6)" }}
                className="cursor-pointer px-6 py-2 uppercase font-bold text-[#1C1B18] bg-[#ff6b6b]"
              >
                CONFIRM
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ boxShadow: "0 0 20px rgba(191,136,60,0.6)" }}
                className="cursor-pointer px-6 py-2 uppercase font-bold text-[#1C1B18] bg-[#f0d382]"
              >
                CANCEL
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
