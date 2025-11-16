import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PrepNotesOverlay({ isOpen, onClose, sessionData }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Corner arrow paths (same as SessionEdit)
  const cornerArrowPaths = [
    "M35.178,1.558l0,32.25",
    "M35.178,1.558l-33.179,-0",
    "M26.941,9.558l0,16.06",
    "M26.941,25.571l8.237,8.237",
    "M1.999,1.558l8,8",
    "M18.911,1.558l0,16.06",
    "M26.941,9.558l-16.705,-0",
    "M34.971,17.588l-16.06,-0",
  ];

  const CornerArrow = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37 36"
      className={className}
      fill="none"
      strokeWidth="2"
    >
      {cornerArrowPaths.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" />
      ))}
    </svg>
  );

  // Save scroll position when closing
  useEffect(() => {
    if (!isOpen && contentRef.current) {
      setScrollPosition(contentRef.current.scrollTop);
    }
  }, [isOpen]);

  // Restore scroll position when opening
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [isOpen, scrollPosition]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Parse notes into sections (split by ## headers)
  const parseNotesIntoSections = (notes) => {
    if (!notes) return [{ title: null, content: notes || "" }];

    const lines = notes.split("\n");
    const sections = [];
    let currentSection = { title: null, content: "" };

    lines.forEach((line) => {
      // Check if line is a header (## Header or **Header**)
      if (line.trim().startsWith("##")) {
        if (currentSection.content || currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^##\s*/, "").trim(),
          content: "",
        };
      } else if (line.trim().match(/^\*\*.*\*\*$/)) {
        if (currentSection.content || currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/\*\*/g, "").trim(),
          content: "",
        };
      } else {
        currentSection.content += line + "\n";
      }
    });

    if (currentSection.content || currentSection.title) {
      sections.push(currentSection);
    }

    return sections;
  };

  // Simple markdown-like formatting
  const formatText = (text) => {
    if (!text) return "";

    // Bold: **text** or __text__
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-[var(--primary)] font-bold">$1</strong>'
    );
    text = text.replace(
      /__(.*?)__/g,
      '<strong class="text-[var(--primary)] font-bold">$1</strong>'
    );

    // Italic: *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

    // Bullet points: - item or • item
    text = text.replace(
      /^[\-•]\s+(.+)$/gm,
      '<div class="ml-4 flex gap-2"><span class="text-[var(--secondary)]">•</span><span>$1</span></div>'
    );

    return text;
  };

  const sections = parseNotesIntoSections(sessionData?.dmNotes);

  // Filter sections based on search
  const filteredSections = searchTerm
    ? sections.filter(
        (section) =>
          section.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sections;

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  // Expand all sections by default on first open
  useEffect(() => {
    if (isOpen && expandedSections.size === 0) {
      setExpandedSections(new Set(sections.map((_, i) => i)));
    }
  }, [isOpen]);

  if (!sessionData) return null;

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center p-[5vh]"
            style={{ zIndex: 9999 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[80vw] h-[90vh] bg-[var(--dark-muted-bg)] border-2 border-[var(--secondary)] flex flex-col overflow-hidden">
              {/* Corner Arrows */}
              <CornerArrow className="absolute top-0 left-0 w-8 h-8 text-[var(--secondary)] rotate-[270deg] scale-125 z-10" />
              <CornerArrow className="absolute top-0 right-0 w-8 h-8 text-[var(--secondary)] scale-125 z-10" />
              <CornerArrow className="absolute bottom-0 left-0 w-8 h-8 text-[var(--secondary)] rotate-[180deg] scale-125 z-10" />
              <CornerArrow className="absolute bottom-0 right-0 w-8 h-8 text-[var(--secondary)] rotate-[90deg] scale-125 z-10" />

              {/* Header */}
              <div className="relative border-b-2 border-[var(--secondary)] p-6 flex justify-between items-center bg-[var(--dark-muted-bg)]">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold uppercase text-[var(--primary)] mb-1">
                    {sessionData.notesHeadline || "Session Prep Notes"}
                  </h2>
                  <p className="text-sm text-[var(--secondary)] uppercase tracking-wider">
                    Preparation Notes
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="text-3xl text-[var(--secondary)] hover:text-red-400 transition-colors duration-200 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,100,100,0.6)]"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="border-b-2 border-[var(--secondary)] p-4 bg-[var(--dark-muted-bg)]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-transparent border border-[var(--secondary)] px-4 py-2 text-[var(--primary)] placeholder-[var(--secondary)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {/* Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto p-8 text-[var(--secondary)]"
              >
                {filteredSections.length === 0 ? (
                  <p className="text-center text-[var(--secondary)]/60 italic py-8">
                    No notes found matching "{searchTerm}"
                  </p>
                ) : (
                  <div className="space-y-6">
                    {filteredSections.map((section, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-[var(--secondary)]/30 pl-6"
                      >
                        {section.title ? (
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full text-left group mb-3 flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
                          >
                            <motion.svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              className="text-[var(--primary)] flex-shrink-0"
                              animate={{
                                rotate: expandedSections.has(index) ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <path
                                d="M 5,7 L 10,12 L 15,7"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="square"
                              />
                            </motion.svg>
                            <h3 className="text-2xl font-bold uppercase text-[var(--primary)]">
                              {section.title}
                            </h3>
                          </button>
                        ) : null}

                        <AnimatePresence>
                          {(expandedSections.has(index) || !section.title) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="text-base leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                  __html: formatText(section.content),
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Controls */}
              <div className="border-t-2 border-[var(--secondary)] p-4 bg-[var(--dark-muted-bg)] flex justify-between items-center">
                <button
                  onClick={() => {
                    if (expandedSections.size === sections.length) {
                      setExpandedSections(new Set());
                    } else {
                      setExpandedSections(new Set(sections.map((_, i) => i)));
                    }
                  }}
                  className="text-sm text-[var(--secondary)] hover:text-[var(--primary)] uppercase tracking-wider transition-colors"
                >
                  {expandedSections.size === sections.length
                    ? "Collapse All"
                    : "Expand All"}
                </button>

                <p className="text-xs text-[var(--secondary)]/60 uppercase tracking-wider">
                  {filteredSections.length} Section
                  {filteredSections.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document.body level
  return createPortal(overlayContent, document.body);
}
