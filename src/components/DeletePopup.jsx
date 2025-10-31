import { motion } from "framer-motion";
import React from "react";

export default function DeletePopup({ confirmDelete, setDeleteConfirm }) {
  const buttons = ["Delete", "Cancel"];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [keyboardActive, setKeyboardActive] = React.useState(true);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      setKeyboardActive(true); // disable hover highlighting when keyboard is used
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setActiveIndex((prev) =>
          e.key === "ArrowRight"
            ? (prev + 1) % buttons.length
            : (prev - 1 + buttons.length) % buttons.length
        );
      } else if (e.key === "Enter") {
        if (activeIndex === 0) confirmDelete();
        else setDeleteConfirm({ open: false, encounterId: null });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, confirmDelete, setDeleteConfirm]);

  // Determine which index should be highlighted
  const getActiveIndex = () =>
    keyboardActive ? activeIndex : hoverIndex;

  const currentActive = getActiveIndex();

  return (
    <motion.div
      className="bg-black border-4 border-[var(--secondary)] text-center drop-shadow-[0_0_10px_#d8c78a] max-w-lg mx-auto p-8 rounded-none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-4xl font-serif text-[var(--primary)] mb-10 tracking-wide">
        DELETE ENCOUNTER
      </h3>
      <p className="text-2xl font-serif text-[var(--secondary)] mb-16">
        Are you sure you want to delete this encounter?
      </p>

      <div className="flex justify-center items-center gap-20">
        {buttons.map((label, index) => {
          const isActive = currentActive === index;

          return (
            <button
              key={label}
              onClick={() =>
                index === 0
                  ? confirmDelete()
                  : setDeleteConfirm({ open: false, encounterId: null })
              }
              onMouseEnter={() => {
                setHoverIndex(index);
                setKeyboardActive(false);
              }}
              onMouseLeave={() => setHoverIndex(null)}
              className={`relative font-serif text-3xl font-bold uppercase transition-all duration-200 px-4 py-2
                ${
                  isActive
                    ? "text-[var(--primary)] cursor-pointer"
                    : "text-[var(--secondary)] cursor-pointer"
                }`}
            >
              {isActive && (
                <motion.svg
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 79 79"
                  fill="none"
                  className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8"
                >
                  <path
                    d="M39.202 76.9561L75.895 40.2631L36.693 1.06107"
                    stroke="#b77a2b"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M56.2974 20.6661L37.9509 39.0126L57.5477 58.6094"
                    stroke="#b77a2b"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M36.693 1.06107L37.3184 20.0408L56.9152 39.6376L38.5687 57.9841L39.202 76.9561"
                    stroke="#b77a2b"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                  />
                </motion.svg>
              )}
              {label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
