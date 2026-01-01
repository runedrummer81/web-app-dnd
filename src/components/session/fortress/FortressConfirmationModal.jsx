import { motion, AnimatePresence } from "framer-motion";
import ActionButton from "../../ActionButton";

export const FortressConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#151612] border-4 border-[#BF883C] max-w-3xl w-full"
            style={{
              boxShadow:
                "0 0 60px rgba(191,136,60,0.4), inset 0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            <div className="p-12">
              {/* Main Title - Smaller to fit in 2 lines */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-[#d9ca89] uppercase tracking-[0.2em] text-center mb-3 leading-tight"
                style={{
                  fontFamily: "EB Garamond, serif",
                  textShadow:
                    "0 0 40px rgba(217,202,137,0.9), 0 0 80px rgba(217,202,137,0.5)",
                }}
              >
                Assault on Sunblight Fortress
              </motion.h2>

              {/* Subtitle - Chapter info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#BF883C] text-center uppercase tracking-[0.3em] mb-8"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                Chapter 3: Destruction's Light
              </motion.p>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-[2px] w-80 mx-auto mb-10 bg-gradient-to-r from-transparent via-[#BF883C] to-transparent"
              />

              {/* Warning/Description Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <p
                  className="text-xl text-[#d9ca89] text-center leading-relaxed px-8"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  This will transition your party into a multi-stage dungeon
                  encounter within Xardorok Sunblight's fortress.
                </p>
                <p
                  className="text-lg text-[#BF883C]/80 text-center mt-4 px-8"
                  style={{ fontFamily: "EB Garamond, serif" }}
                >
                  The party will be presented with a critical decision that will
                  shape the remainder of this chapter. Do you want to proceed?
                </p>
              </motion.div>

              {/* Action Buttons - Stacked */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-6 items-center"
              >
                {/* Confirm Button - Using ActionButton - Larger */}
                <ActionButton
                  label="BEGIN"
                  onClick={onConfirm}
                  size="lg"
                  color="var(--secondary)"
                  bgColor="var(--primary)"
                  textColor="var(--dark-muted-bg)"
                  showLeftArrow={true}
                  showRightArrow={true}
                  showGlow={false}
                  animate={false}
                />

                {/* Cancel Button - Text only */}
                <button onClick={onCancel} className="group cursor-pointer">
                  <span
                    className="text-[#BF883C]/70 font-bold uppercase tracking-[0.25em] text-lg group-hover:text-red-400 transition-colors duration-300"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    Cancel
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
