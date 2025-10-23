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
          {/* <div className="border-t border-[#DACA89]/40 py-5 flex justify-center">
            <button
              onClick={onConfirm}
               className="cursor-pointer btn-glow hover:scale-110"
              >
             Confirm
            </button>
          </div> */}

          {/* Left arrow */}
                            <motion.div
                              className="absolute -left-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20 drop-shadow-[0_0_20px_rgba(191,136,60,0.8)]"
                              style={{ transform: "translateY(-0%) scale(0.97)" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 35.9 67.5"
                                className="h-[70px] w-auto rotate-180"
                              >
                                <defs>
                                  <style>{`.st0 { fill: none; stroke: #bf883c; stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
                                </defs>
                                <polyline
                                  className="st0"
                                  points="1.4 66.8 34.5 33.8 1.4 .7"
                                />
                                <polyline
                                  className="st0"
                                  points="17.9 17.2 1.4 33.8 17.9 50.3"
                                />
                                <polyline
                                  className="st0"
                                  points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
                                />
                              </svg>
                            </motion.div>
              
                            {/* LOAD button itself */}
                            <motion.button
                              onClick={onConfirm}
                              className="
                          relative cursor-pointer px-14 py-2 text-4xl font-extrabold uppercase text-[#1C1B18] bg-[#f0d382]
                          overflow-hidden
                          before:content-[''] before:absolute before:inset-0
                          before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
                          before:translate-x-[-100%] before:skew-x-12
                          hover:before:animate-[shine_1s_ease-in-out_forwards]
                        "
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.35 }}
                            >
                              LOAD
                            </motion.button>
              
                            {/* Right arrow */}
                            <motion.div
                              className="absolute -right-[36px] top-1/2 -translate-y-1/2 pointer-events-none z-20 drop-shadow-[0_0_20px_rgba(191,136,60,0.8)]"
                              style={{ transform: "translateY(-0%) scale(0.97)" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 35.9 67.5"
                                className="h-[70px] w-auto"
                              >
                                <defs>
                                  <style>{`.st0 { fill: none; stroke: #bf883c; stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
                                </defs>
                                <polyline
                                  className="st0"
                                  points="1.4 66.8 34.5 33.8 1.4 .7"
                                />
                                <polyline
                                  className="st0"
                                  points="17.9 17.2 1.4 33.8 17.9 50.3"
                                />
                                <polyline
                                  className="st0"
                                  points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
                                />
                              </svg>
                            </motion.div>

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
