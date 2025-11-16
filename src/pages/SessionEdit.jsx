import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import MapBrowserModal from "../components/MapBrowserModal";
import EncounterBrowserModal from "../components/EncounterBrowserModal";
import { motion } from "framer-motion";
import ArrowButton from "../components/ArrowButton";
import UnsavedModal from "../components/UnsavedModal";

export default function SessionEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const encountersContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [visibleEncounters, setVisibleEncounters] = useState(5);

  const [sessionData, setSessionData] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [encounters, setEncounters] = useState([]);
  const [combatMaps, setCombatMaps] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [creatureImages, setCreatureImages] = useState({});

  const [showMoreEncountersModal, setShowMoreEncountersModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [originalSessionData, setOriginalSessionData] = useState(null);

  const [headlineError, setHeadlineError] = useState(false);

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

  const sessionId = location.state?.sessionId;
  const draftData = location.state?.isDraft ? location.state : null;

  useEffect(() => {
    if (draftData && draftData.isDraft) {
      console.log("📝 Creating new draft session");
      setIsDraft(true);

      const newSessionData = {
        title: `Session ${draftData.sessNr}`,
        campaignId: draftData.campaignId,
        sessNr: draftData.sessNr,
        dmNotes: "",
        notesHeadline: "",
        encounters: [],
        combatMaps: [],
      };

      setSessionData(newSessionData);
      setOriginalSessionData(newSessionData);
      setEncounters([]);
      setCombatMaps([]);
      return;
    }

    if (!sessionId) {
      console.warn("No sessionId found — redirect");
      navigate("/session");
      return;
    }

    async function fetchSession() {
      try {
        const sessionRef = doc(db, "Sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          setSessionData(data);
          setOriginalSessionData(data);
          setEncounters(data.encounters || []);
          setCombatMaps(data.combatMaps || []);
          setIsDraft(false);
        }
      } catch (err) {
        console.error("couldn't find session:", err);
      }
    }

    fetchSession();
  }, [sessionId, draftData, navigate]);

  // Load content into editor when sessionData changes
  useEffect(() => {
    if (editorRef.current && sessionData) {
      editorRef.current.innerHTML = sessionData.dmNotes || "";
    }
  }, [sessionData?.dmNotes]);

  useEffect(() => {
    async function fetchCreatureImages() {
      const creatureNames = new Set();
      encounters.forEach((encounter) => {
        if (encounter.creatures) {
          encounter.creatures.forEach((creature) => {
            creatureNames.add(creature.name);
          });
        }
      });

      try {
        const creaturesSnapshot = await getDocs(collection(db, "Creatures"));
        const images = {};

        creaturesSnapshot.docs.forEach((doc) => {
          const creatureData = doc.data();
          const creatureName = doc.id;

          if (creatureNames.has(creatureName)) {
            images[creatureName] = creatureData.imageURL || null;
          }
        });

        setCreatureImages(images);
      } catch (err) {
        console.error("Error fetching creature images:", err);
      }
    }

    if (encounters.length > 0) {
      fetchCreatureImages();
    }
  }, [encounters]);

  useEffect(() => {
    if (isDraft) {
      const hasContent =
        (sessionData?.dmNotes && sessionData.dmNotes.trim() !== "") ||
        (sessionData?.notesHeadline &&
          sessionData.notesHeadline.trim() !== "") ||
        encounters.length > 0 ||
        combatMaps.length > 0;

      setHasUnsavedChanges(hasContent);
      return;
    }

    if (!originalSessionData) return;

    const notesChanged = sessionData?.dmNotes !== originalSessionData.dmNotes;
    const headlineChanged =
      sessionData?.notesHeadline !== originalSessionData.notesHeadline;
    const encountersChanged =
      JSON.stringify(encounters) !==
      JSON.stringify(originalSessionData.encounters || []);
    const mapsChanged =
      JSON.stringify(combatMaps) !==
      JSON.stringify(originalSessionData.combatMaps || []);

    const changed =
      notesChanged || headlineChanged || encountersChanged || mapsChanged;
    setHasUnsavedChanges(changed);
  }, [sessionData, encounters, combatMaps, originalSessionData, isDraft]);

  useEffect(() => {
    const handleNavigationEvent = () => {
      if (hasUnsavedChanges) {
        setPendingNavigation("/session");
        setShowUnsavedModal(true);
      } else {
        navigate("/session");
      }
    };

    window.addEventListener("attemptNavigation", handleNavigationEvent);
    return () =>
      window.removeEventListener("attemptNavigation", handleNavigationEvent);
  }, [hasUnsavedChanges, navigate]);

  // Rich text formatting functions
  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setSessionData({ ...sessionData, dmNotes: editorRef.current.innerHTML });
    }
  };

  const handleRemoveEncounter = (id) => {
    setEncounters(encounters.filter((e) => e.id !== id));
  };

  const handleRemoveMap = (id) => {
    setCombatMaps(combatMaps.filter((m) => m.id !== id));
  };

  const handleMapsConfirm = (newMaps) => {
    setCombatMaps([...combatMaps, ...newMaps]);
  };

  const handleEncounterConfirm = (newSelectedEncounters) => {
    setEncounters(newSelectedEncounters);
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!sessionData.notesHeadline || sessionData.notesHeadline.trim() === "") {
      setHeadlineError(true);
      setTimeout(() => setHeadlineError(false), 600);
      return;
    }

    try {
      if (isDraft) {
        const newSessionId = `${
          sessionData.campaignId
        }_sess_${sessionData.sessNr.toString().padStart(3, "0")}`;

        await setDoc(doc(db, "Sessions", newSessionId), {
          title: sessionData.title,
          campaignId: sessionData.campaignId,
          sessNr: sessionData.sessNr,
          dmNotes: sessionData.dmNotes,
          notesHeadline: sessionData.notesHeadline,
          encounters,
          combatMaps,
          createdAt: new Date(),
          lastEdited: new Date(),
        });

        const campaignRef = doc(db, "Campaigns", sessionData.campaignId);
        const q = query(
          collection(db, "Sessions"),
          where("campaignId", "==", sessionData.campaignId)
        );
        const snapshot = await getDocs(q);
        await updateDoc(campaignRef, {
          sessionsCount: snapshot.docs.length + 1,
          lastOpened: new Date(),
        });

        console.log("✅ New session created:", newSessionId);
      } else {
        const sessionRef = doc(db, "Sessions", sessionId);
        await updateDoc(sessionRef, {
          dmNotes: sessionData.dmNotes,
          notesHeadline: sessionData.notesHeadline,
          encounters,
          combatMaps,
          lastEdited: new Date(),
        });

        console.log("✅ Session updated:", sessionId);
      }

      navigate("/session", {
        state: {
          campaignId: sessionData.campaignId,
          refreshSessions: true,
        },
      });
    } catch (err) {
      console.error("❌ Error saving session:", err);
    }
  };

  const handleSaveAndNavigate = async () => {
    await handleSave();
    setShowUnsavedModal(false);
  };

  const handleContinueWithoutSaving = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const displayedMaps = combatMaps.slice(0, 3);
  const extraMapsCount = combatMaps.length - 3;

  useEffect(() => {
    const calculateVisibleEncounters = () => {
      if (!encountersContainerRef.current) return;

      const containerTop =
        encountersContainerRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - containerTop - 20;

      const cardHeight = 140;
      let count = Math.max(1, Math.floor(availableHeight / cardHeight));

      if (count % 2 === 0) {
        count = Math.max(1, count - 1);
      }

      setVisibleEncounters(count);
    };

    calculateVisibleEncounters();
    window.addEventListener("resize", calculateVisibleEncounters);
    return () =>
      window.removeEventListener("resize", calculateVisibleEncounters);
  }, [encountersContainerRef, encounters]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dark-muted-bg)] text-[var(--primary)] font-serif p-20 pt-40 gap-8 overflow-y-auto">
      {!sessionData ? (
        <p className="text-center mt-20 text-[var(--primary)]">
          Loading session...
        </p>
      ) : (
        <>
          {isDraft && (
            <motion.div
              className="text-[var(--secondary)] text-center text-sm italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✨ Creating new session - remember to save!
            </motion.div>
          )}

          <div className="flex gap-8 flex-1 min-h-0">
            {/* Notes Section */}
            <motion.section
              className="flex flex-col flex-1 min-h-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-2 select-none">
                <h3 className="text-lg uppercase tracking-widest">Notes</h3>
              </div>

              <div className="relative border-2 border-[var(--secondary)] p-6 flex flex-col flex-1 min-h-0 text-[var(--secondary)] focus-within:border-[var(--primary)] focus-within:text-[var(--primary)]">
                <CornerArrow className="absolute top-0 left-0 w-8 h-8 rotate-[270deg] scale-125 pointer-events-none" />
                <CornerArrow className="absolute top-0 right-0 w-8 h-8 scale-125 pointer-events-none" />
                <CornerArrow className="absolute bottom-0 left-0 w-8 h-8 rotate-[180deg] scale-125 pointer-events-none" />
                <CornerArrow className="absolute bottom-0 right-0 w-8 h-8 rotate-[90deg] scale-125 pointer-events-none" />

                {/* Headline */}
                <div className="flex flex-row mb-2 flex-shrink-0">
                  <motion.input
                    type="text"
                    value={sessionData.notesHeadline || ""}
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        notesHeadline: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        editorRef.current?.focus();
                      }
                    }}
                    placeholder="Add Headline..."
                    className={`p-2 text-[var(--primary)] outline-none text-2xl uppercase font-bold bg-transparent flex-1`}
                    animate={
                      headlineError
                        ? {
                            x: [-5, 5, -5, 5, 0],
                            textShadow: "0 0 8px #bf883c",
                          }
                        : { x: 0, textShadow: "0 0 0px transparent" }
                    }
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-[var(--secondary)]/30 flex-shrink-0">
                  {/* Text Style */}
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<b>${selectedText}</b>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 7);
                        }, 0);
                      }
                    }}
                    className="px-3 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors font-bold"
                    title="Bold"
                  >
                    B
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<i>${selectedText}</i>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 7);
                        }, 0);
                      }
                    }}
                    className="px-3 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors italic"
                    title="Italic"
                  >
                    I
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<u>${selectedText}</u>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 7);
                        }, 0);
                      }
                    }}
                    className="px-3 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors underline"
                    title="Underline"
                  >
                    U
                  </button>

                  <div className="w-px bg-[var(--secondary)]/30 mx-1"></div>

                  {/* Font Sizes */}
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="font-size: 0.875rem">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 40);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                    title="Small Text"
                  >
                    Small
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="font-size: 1.25rem">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 39);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-base border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                    title="Large Text"
                  >
                    Large
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="font-size: 1.5rem">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 38);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-lg border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                    title="Extra Large Text"
                  >
                    XL
                  </button>

                  <div className="w-px bg-[var(--secondary)]/30 mx-1"></div>

                  {/* Headings */}
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<h1>${selectedText}</h1>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 9);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-base border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors font-bold"
                    title="Heading 1"
                  >
                    H1
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<h2>${selectedText}</h2>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 9);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors font-bold"
                    title="Heading 2"
                  >
                    H2
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<h3>${selectedText}</h3>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 9);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors font-bold"
                    title="Heading 3"
                  >
                    H3
                  </button>

                  <div className="w-px bg-[var(--secondary)]/30 mx-1"></div>

                  {/* Text Color */}
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="color: #ef4444">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 37);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors text-red-500"
                    title="Red Text"
                  >
                    Red
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="color: #10b981">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 37);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors text-green-500"
                    title="Green Text"
                  >
                    Green
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const textarea = editorRef.current;
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = sessionData.dmNotes.substring(
                        start,
                        end
                      );

                      if (selectedText) {
                        const newText =
                          sessionData.dmNotes.substring(0, start) +
                          `<span style="color: #3b82f6">${selectedText}</span>` +
                          sessionData.dmNotes.substring(end);

                        setSessionData({ ...sessionData, dmNotes: newText });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, end + 37);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-sm border border-[var(--secondary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors text-blue-500"
                    title="Blue Text"
                  >
                    Blue
                  </button>
                </div>

                {/* Textarea Editor */}
                <textarea
                  ref={editorRef}
                  value={sessionData.dmNotes || ""}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, dmNotes: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation(); // Stop Enter from bubbling to parent/buttons
                    }
                  }}
                  placeholder="Your journey starts..."
                  className="w-full font-light focus:outline-none resize-none bg-transparent flex-1 min-h-0"
                />

                <style>{`
  textarea::placeholder {
    color: var(--secondary);
    opacity: 0.5;
  }
`}</style>
              </div>
            </motion.section>

            {/* Right Column - Encounters & Maps */}
            <motion.section className="flex flex-col overflow-y-auto max-h-full w-[400px] flex-shrink-0">
              {/* Encounters */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg uppercase tracking-widest select-none">
                    Encounters
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowEncounterModal(true)}
                    className="text-4xl leading-none transition hover:text-[var(--primary)]"
                  >
                    +
                  </button>
                </div>

                <div className="relative flex flex-col overflow-hidden">
                  <div
                    className="overflow-y-auto flex-1"
                    ref={encountersContainerRef}
                  >
                    {encounters.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {encounters.slice(0, visibleEncounters).map((e) => {
                          const firstCreature =
                            e.creatures && e.creatures.length > 0
                              ? e.creatures[0]
                              : null;
                          const creatureImageUrl = firstCreature
                            ? creatureImages[firstCreature.name] || null
                            : null;

                          return (
                            <motion.div
                              key={e.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative overflow-hidden border-2 border-[var(--secondary)] hover:border-[var(--primary)] transition-all duration-300 group select-none"
                              style={{ minHeight: "100px" }}
                            >
                              {creatureImageUrl && (
                                <div
                                  className="absolute inset-2 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                                  style={{
                                    backgroundImage: `url(${creatureImageUrl})`,
                                    backgroundPosition: "right center",
                                    clipPath:
                                      "polygon(40% 0, 100% 0, 100% 100%, 40% 100%)",
                                  }}
                                />
                              )}
                              <div
                                className="absolute inset-2"
                                style={{
                                  background:
                                    "linear-gradient(to right, var(--dark-muted-bg) 0%, var(--dark-muted-bg) 40%, rgba(28, 27, 24, 0.7) 70%, transparent 100%)",
                                }}
                              />

                              <div className="relative z-10 p-4 flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-xl font-semibold text-[var(--primary)] mb-2 transition-all">
                                    {e.name}
                                  </p>
                                  <div className="text-[var(--secondary)] text-sm space-y-1">
                                    {e.creatures && e.creatures.length > 0 ? (
                                      e.creatures.map((c, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="text-[var(--secondary)]/60">
                                            •
                                          </span>
                                          <span>
                                            {c.name} × {c.count}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-[var(--secondary)]/60 italic">
                                        No creatures
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEncounter(e.id)}
                                  className="text-red-400 hover:text-red-300 transition text-xl z-20 ml-4 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,100,100,0.6)]"
                                >
                                  ✕
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}

                        {encounters.length > visibleEncounters && (
                          <div
                            className="flex items-center justify-center border-2 border-[var(--secondary)] text-[var(--primary)]/70 italic text-center p-4 hover:border-[var(--primary)] cursor-pointer transition-all duration-300 select-none"
                            onClick={() => setShowMoreEncountersModal(true)}
                          >
                            +{encounters.length - visibleEncounters} more
                            encounter
                            {encounters.length - visibleEncounters > 1
                              ? "s"
                              : ""}
                          </div>
                        )}
                        {showMoreEncountersModal && (
                          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                            <div className="bg-[var(--dark-muted-bg)] border-2 border-[var(--secondary)] p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowMoreEncountersModal(false)
                                }
                                className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-xl"
                              >
                                ✕
                              </button>

                              <h3 className="text-xl font-bold mb-4 text-[var(--primary)]">
                                Extra Encounters
                              </h3>

                              <div className="grid grid-cols-2 gap-3">
                                {encounters
                                  .slice(visibleEncounters)
                                  .map((e) => {
                                    const firstCreature =
                                      e.creatures && e.creatures.length > 0
                                        ? e.creatures[0]
                                        : null;
                                    const creatureImageUrl = firstCreature
                                      ? creatureImages[firstCreature.name] ||
                                        null
                                      : null;

                                    return (
                                      <div
                                        key={e.id}
                                        className="relative overflow-hidden border-2 border-[var(--secondary)] hover:border-[var(--primary)] transition-all duration-300 p-4 "
                                      >
                                        <p className="font-semibold text-[var(--primary)] mb-2">
                                          {e.name}
                                        </p>
                                        {e.creatures &&
                                        e.creatures.length > 0 ? (
                                          e.creatures.map((c, i) => (
                                            <div
                                              key={i}
                                              className="text-[var(--secondary)] text-sm"
                                            >
                                              {c.name} × {c.count}
                                            </div>
                                          ))
                                        ) : (
                                          <span className="text-[var(--secondary)]/60 italic">
                                            No creatures
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[var(--primary)]/60 italic text-center py-4">
                        No encounters added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Maps */}
              <div>
                <div
                  className="flex justify-between items-center mb-3 "
                  style={{ height: "40px" }}
                >
                  <h3 className="text-lg uppercase tracking-widest select-none">
                    Maps
                  </h3>
                </div>
                <div className="relative  p-4 ">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="cursor-pointer py-1 text-4xl leading-none px-3 transition hover:text-[var(--primary)] "
                    >
                      +
                    </button>
                    {displayedMaps.length > 0 ? (
                      <>
                        {displayedMaps.map((map) => (
                          <motion.div
                            key={map.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative flex flex-col items-center p-2 border-2 border-[var(--secondary)] aspect-square w-24 hover:border-[var(--primary)]  transition-all"
                          >
                            <img
                              src={map.image}
                              alt={map.title}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMap(map.id)}
                              className="cursor-pointer absolute top-1 right-1 text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_10px_rgba(255,100,100,0.6)]"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))}
                        {extraMapsCount > 0 && (
                          <div className="flex items-center justify-center aspect-square w-24 border-2 border-[var(--secondary)]/50 bg-[#1C1B18]">
                            <p className="text-[var(--primary)] text-center text-sm font-semibold select-none">
                              +{extraMapsCount}
                              <br />
                              more
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-[var(--primary)]/60 italic">
                        No maps added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Save Button */}
          <div className="flex justify-end flex-shrink-0 mt-6">
            <ArrowButton
              label={isDraft ? "Create Session" : "Save Session"}
              onClick={handleSave}
              size="md"
              color="var(--primary)"
              glow="rgba(191,136,60,0.6)"
              hoverOffset={20}
              gradient={true}
            />
          </div>

          <EncounterBrowserModal
            isOpen={showEncounterModal}
            onClose={() => setShowEncounterModal(false)}
            onConfirm={handleEncounterConfirm}
            alreadySelectedEncounters={encounters}
          />

          <MapBrowserModal
            isOpen={showMapModal}
            onClose={() => setShowMapModal(false)}
            onConfirm={handleMapsConfirm}
            alreadySelectedMaps={combatMaps}
          />

          <UnsavedModal
            open={showUnsavedModal}
            onClose={() => setShowUnsavedModal(false)}
            onSave={handleSaveAndNavigate}
            onContinue={handleContinueWithoutSaving}
          />
        </>
      )}
    </div>
  );
}
