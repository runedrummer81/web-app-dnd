import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LearnMore({ template, onClose, onConfirm }) {
  if (!template) return null;

  const scrollRef = useRef(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setShowBottomFade(isScrollable && !atBottom);
    };

    el.addEventListener("scroll", checkScroll);
    checkScroll(); // initialize
    return () => el.removeEventListener("scroll", checkScroll);
  }, [scrollRef, template]);

  const fadeInProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
    viewport: { once: true, root: scrollRef },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#1C1B18] text-[#DACA89] rounded-xl border border-[#DACA89] shadow-[0_0_180px_rgba(218,202,137,0.3)] w-full max-w-2xl flex flex-col max-h-[80vh]"
        >
          <div
            ref={scrollRef}
            className="overflow-y-auto px-10 pt-10 pb-5 relative"
            style={{
              maxHeight: "calc(80vh - 72px)",
              maskImage: showBottomFade
                ? "linear-gradient(to bottom, black 85%, transparent 100%)"
                : "none",
              WebkitMaskImage: showBottomFade
                ? "linear-gradient(to bottom, black 85%, transparent 100%)"
                : "none",
            }}
          >
            {/* Title */}
            <motion.h2
              {...fadeInProps}
              className="text-4xl font-bold text-center mb-6 leading-tight"
            >
              {template.title}
            </motion.h2>

            {/* Main image */}
            {template.image && (
              <motion.img
                {...fadeInProps}
                src={template.image}
                alt={template.title}
                className="w-full h-52 object-cover rounded mb-6"
              />
            )}

            {/* Description */}
            {template.description && (
              <motion.p
                {...fadeInProps}
                className="text-sm leading-relaxed mb-8"
              >
                {template.description}
              </motion.p>
            )}

            {/* Two-column section */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-7/12 flex flex-col justify-center">
                {template.extraText1 && (
                  <motion.p
                    {...fadeInProps}
                    className="text-sm leading-relaxed"
                  >
                    {template.extraText1}
                  </motion.p>
                )}
              </div>
              {template.extraImage1 && (
                <div className="md:w-5/12 flex items-center">
                  <motion.img
                    {...fadeInProps}
                    src={template.extraImage1}
                    alt="Secondary"
                    className="w-full h-40 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Extra images and texts */}
            {template.extraImage2 && (
              <motion.img
                {...fadeInProps}
                src={template.extraImage2}
                alt="Footer"
                className="w-full h-44 object-cover rounded mb-6"
              />
            )}

            {template.thirdText && (
              <motion.p
                {...fadeInProps}
                className="text-sm leading-relaxed mb-6"
              >
                {template.thirdText}
              </motion.p>
            )}

            {(template.fourthImage || template.fourthText) && (
              <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
                {template.fourthImage && (
                  <motion.img
                    {...fadeInProps}
                    src={template.fourthImage}
                    alt="Chardalyn dragon attacking TenTowns"
                    className="w-80 h-80 object-cover rounded mb-4 md:mb-0"
                  />
                )}
                {template.fourthText && (
                  <motion.p
                    {...fadeInProps}
                    className="text-sm leading-relaxed"
                  >
                    {template.fourthText}
                  </motion.p>
                )}
              </div>
            )}

            {template.fifthImage && (
              <motion.img
                {...fadeInProps}
                src={template.fifthImage}
                alt="Auril"
                className="w-full h-65 object-cover rounded mb-6"
              />
            )}

            {template.fifthText && (
              <motion.p
                {...fadeInProps}
                className="text-sm leading-relaxed mb-6"
              >
                {template.fifthText}
              </motion.p>
            )}
          </div>

          {/* Confirm button */}
          <div className="border-t border-[#DACA89]/40 py-5 flex justify-center">
            <button
              onClick={onConfirm}
              className="cursor-pointer btn-glow hover:scale-110"
            >
              Confirm
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-[#DACA89]/70 hover:text-[#DACA89]"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
