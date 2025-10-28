import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export const ConfirmEndSessionModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 p-6 rounded space-y-4 max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <p className="text-yellow-400 font-bold text-center">
            Are you sure you want to end the session?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-yellow-600 rounded font-bold hover:bg-yellow-500 transition"
            >
              End Session
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
