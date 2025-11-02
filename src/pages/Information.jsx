// src/pages/Information.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Information() {
  const [sectionIndex, setSectionIndex] = useState(0);

  // Technologies with Simple Icons CDN links
  const technologies = [
    {
      name: "React",
      description: "Frontend framework for building UI",
      icon: "https://cdn.simpleicons.org/react/BF883C",
    },
    {
      name: "Vite",
      description: "Lightning-fast build tool",
      icon: "https://cdn.simpleicons.org/vite/BF883C",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first styling framework",
      icon: "https://cdn.simpleicons.org/tailwindcss/BF883C",
    },
    {
      name: "Framer Motion",
      description: "Smooth animations library",
      icon: "https://cdn.simpleicons.org/framer/BF883C",
    },
    {
      name: "Leaflet",
      description: "Interactive map rendering",
      icon: "https://cdn.simpleicons.org/leaflet/BF883C",
    },
    {
      name: "Firebase",
      description: "Backend services & authentication",
      icon: "https://cdn.simpleicons.org/firebase/BF883C",
    },
  ];

  const sections = ["about", "features", "stack"];
  const maxIndex = sections.length - 1;

  // Scroll handler
  useEffect(() => {
    let scrollAccumulator = 0;
    const SCROLL_THRESHOLD = 50;

    const handleWheel = (e) => {
      scrollAccumulator += e.deltaY;

      if (scrollAccumulator >= SCROLL_THRESHOLD) {
        setSectionIndex((prev) => Math.min(prev + 1, maxIndex));
        scrollAccumulator = 0;
        e.preventDefault();
      } else if (scrollAccumulator <= -SCROLL_THRESHOLD) {
        setSectionIndex((prev) => Math.max(prev - 1, 0));
        scrollAccumulator = 0;
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [maxIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "s") {
        setSectionIndex((prev) => Math.min(prev + 1, maxIndex));
        e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "w") {
        setSectionIndex((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maxIndex]);

  return (
    <div className="fixed inset-0 bg-[#151612] text-[#d9ca89] overflow-hidden font-serif select-none">
      {/* Safe area to avoid navbar */}
      <div className="pt-40 px-20 pb-20 h-full flex flex-col">
        {/* Scroll hint text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mb-8"
        >
          <motion.p
            className="text-[#BF883C]/60 text-sm uppercase tracking-widest"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Scroll to explore
          </motion.p>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {sections[sectionIndex] === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl text-center space-y-8"
              >
                <h2
                  className="text-5xl font-bold uppercase tracking-wider mb-12"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "0 0 30px rgba(191, 136, 60, 0.5)",
                  }}
                >
                  About Overseer's Vault
                </h2>

                <div className="space-y-6 text-[#BF883C] text-xl leading-relaxed">
                  <p>
                    Overseer's Vault is a digital toolkit built for Dungeon
                    Masters who want to bring their Dungeons & Dragons sessions
                    to life. Designed with tabletop play in mind, it transforms
                    your laptop and a shared screen into an interactive game
                    board — showing your players living maps, dynamic weather,
                    and real-time combat encounters. Behind the scenes, the DM
                    controls everything from a dedicated interface, managing
                    notes, placing markers, and exploring the world unseen by
                    the party.
                  </p>
                  <p>
                    Originally created as an exam project, Overseer's Vault
                    combines advanced web development with a deep love for D&D
                    storytelling. The first module,{" "}
                    <span className="text-[#d9ca89] font-semibold">
                      Rime of the Frostmaiden
                    </span>
                    , is fully functional — with more adventures on the way!
                  </p>
                </div>
              </motion.div>
            )}

            {sections[sectionIndex] === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl"
              >
                <h2
                  className="text-5xl font-bold uppercase tracking-wider text-center mb-12"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "0 0 30px rgba(191, 136, 60, 0.5)",
                  }}
                >
                  Key Features
                </h2>

                <div className="grid grid-cols-3 gap-8">
                  {[
                    {
                      title: "Interactive Maps",
                      description:
                        "Explore detailed world and city maps with markers, weather effects and more",
                    },
                    {
                      title: "Combat Management",
                      description:
                        "Track initiative, manage tokens, and visualize spell effects",
                    },
                    {
                      title: "Session Notes",
                      description:
                        "Keep detailed notes with timestamps, organization and categorize your quick-notes",
                    },
                    {
                      title: "Create Encounters",
                      description:
                        "Manage and make your own encounters, search and add whatever creature you'd like",
                    },
                    {
                      title: "DM Tools",
                      description:
                        "Suite of tools designed for Dungeon Masters, we aim to make your life easier",
                    },
                    {
                      title: "Frostmaiden Ready",
                      description:
                        "Fully integrated with Rime of the Frostmaiden, get ready to face Auril!",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="text-center"
                    >
                      <h3
                        className="text-2xl font-bold text-[#d9ca89] mb-3 uppercase tracking-wide"
                        style={{ fontFamily: "EB Garamond, serif" }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-[#BF883C] text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {sections[sectionIndex] === "stack" && (
              <motion.div
                key="stack"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl"
              >
                <h2
                  className="text-5xl font-bold uppercase tracking-wider text-center mb-12"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "0 0 30px rgba(191, 136, 60, 0.5)",
                  }}
                >
                  Technology Stack
                </h2>

                <div className="grid grid-cols-3 gap-8">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex flex-col items-center text-center group"
                    >
                      {/* Icon with glow effect */}
                      <div className="mb-4 relative">
                        <img
                          src={tech.icon}
                          alt={`${tech.name} logo`}
                          className="w-16 h-16 transition-all duration-300 "
                          style={{
                            filter:
                              "drop-shadow(0 0 8px rgba(191, 136, 60, 0.4))",
                          }}
                        />
                      </div>

                      {/* Name */}
                      <h3
                        className="text-2xl font-bold text-[#d9ca89] mb-3 uppercase"
                        style={{ fontFamily: "EB Garamond, serif" }}
                      >
                        {tech.name}
                      </h3>

                      {/* Description */}
                      <p className="text-[#BF883C] text-base">
                        {tech.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section indicators with scroll arrows */}
        <div className="flex flex-col items-center gap-4 pb-8">
          {/* Up arrow */}
          {sectionIndex > 0 && (
            <motion.button
              onClick={() => setSectionIndex((prev) => Math.max(prev - 1, 0))}
              className="text-[#BF883C] hover:text-[#d9ca89] transition-colors"
              animate={{ y: [-4, 0, -4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </motion.button>
          )}

          {/* Dots */}
          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setSectionIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === sectionIndex
                    ? "bg-[#d9ca89] w-8"
                    : "bg-[#BF883C] w-2 hover:bg-[#d9ca89]"
                }`}
              />
            ))}
          </div>

          {/* Down arrow */}
          {sectionIndex < maxIndex && (
            <motion.button
              onClick={() =>
                setSectionIndex((prev) => Math.min(prev + 1, maxIndex))
              }
              className="text-[#BF883C] hover:text-[#d9ca89] transition-colors"
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
