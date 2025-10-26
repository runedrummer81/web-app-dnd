import { useState, useEffect, useRef } from "react";
import { getDocs, setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ActionButton from "../components/ActionButton";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import LearnMore from "../components/LearnMore";
import { useAuth } from "../hooks/useAuth"; // ✅ import useAuth

export default function NewCampaign() {
  const { user, loading } = useAuth(); // ✅ get current user
  const [templates, setTemplates] = useState([]);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

    const [showNamePopup, setShowNamePopup] = useState(false);
    const [campaignName, setCampaignName] = useState("");
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);

    // Lyt efter navigation attempts fra Nav
useEffect(() => {
  const handleNavigationEvent = () => {
    handleNavigationAttempt("/session");
  };
  
  window.addEventListener("attemptNavigation", handleNavigationEvent);
  return () => window.removeEventListener("attemptNavigation", handleNavigationEvent);
}, [hasUnsavedChanges]);

  // 🔹 Fetch templates from Firestore
  useEffect(() => {
    async function getTemplates() {
      try {
        const querySnapshot = await getDocs(collection(db, "Templates"));
        const fetchedTemplates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Templates fetched:", fetchedTemplates);
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error("🔥 Firestore error:", err);
      }
    }
    getTemplates();
  }, []);

  // 🔹 Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showLearnMore ? "hidden" : "";
  }, [showLearnMore]);

  // 🔹 Fetch LearnMore data dynamically
  const handleLearnMore = async (learnMoreId) => {
    try {
      const docRef = doc(db, "learnmore", learnMoreId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedTemplate({
          title: data.title,
          description: data.description,
          image: data.mainImage,
          extraImage1: data.secondaryImage,
          extraText1: data.secondaryText,
          extraImage2: data.thirdImage,
          thirdText: data.thirdText,
          fourthImage: data.fourthImage,
          fourthText: data.fourthText,
          fifthImage: data.fifthImage,
          fifthText: data.fifthText,
        });
        setShowLearnMore(true);
      } else {
        console.log("No LearnMore document found for ID:", learnMoreId);
      }
    } catch (err) {
      console.error("Error fetching LearnMore document:", err);
    }
  };

  // 🔹 Show popup when confirming
  const handleConfirmClick = () => {
    if (openedIndex === null) return;
    setShowNamePopup(true);
  };

  // 🔹 Save new campaign to Firestore
  const saveCampaign = async () => {
    if (openedIndex === null || !campaignName.trim()) return;
    if (!user) {
      console.error("🔥 User not authenticated!");
      return;
    }

    const selectedTemplate = templates[openedIndex];
    const formattedName = campaignName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    const campaignId = `camp_${formattedName}`;

    const newCampaign = {
      title: campaignName,
      description: selectedTemplate.description || "",
      campaignNr: Date.now(),
      templateId: selectedTemplate.id,
      lastOpened: new Date(),
      firstOpened: new Date(),
      sessionsCount: 0,
      image: selectedTemplate.image || "",
      ownerId: user.uid, // ✅ associate with current user
    };

    try {
      // ✅ add document to Firestore with custom ID
      await setDoc(doc(db, "Campaigns", campaignId), newCampaign);
      console.log("✅ New campaign created with ID:", campaignId);

      // ✅ Store in localStorage and navigate
      localStorage.setItem("selectedCampaignId", campaignId);
      navigate("/session", { state: { campaignId, from: "/newcampaign" } });
    } catch (error) {
      console.error("🔥 Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setShowNamePopup(false);
    }
  };

  if (loading) return null; // wait until auth is loaded

  return (
    <AnimatePresence>
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none">
        {/* Hovedlayout */}
        <div className="flex w-full  justify-center items-center gap-60 mb-6 ">
          {/* Left side */}
          <div className="flex flex-col items-center justify-center  ">
            <div className="relative inline-block">
              <button className="font-[var(--font)] block text-2xl font-semibold cursor-pointer border-l-2 border-t-2 border-b-2 border-[var(--secondary)] w-fit h-fit p-1 relative ">
                <div className="text-[var(--dark-muted-bg)] bg-[var(--primary)] p-5">
                  NEW CAMPAIGN FROM TEMPLATE
                </div>

                {/* Højre pil */}
                <motion.div className="absolute top-1/2 -translate-y-1/2 -right-10 pointer-events-none z-10 drop-shadow-[0_0_20px_rgba(191,136,60,0.8)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35.9 67.5"
                    className="h-[70px] w-auto"
                  >
                    <defs>
                      <style>{`.st0 { fill: none; stroke: var(--secondary); stroke-width: 4px; stroke-miterlimit: 10; }`}</style>
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
              </button>
            </div>

            <p className="mt-6 text-lg uppercase tracking-widest opacity-60 text-[var(--secondary)]">
              MAKE YOUR OWN
            </p>
            {/* <img className="rotate-45 w-6"  src="/images/arrow-head.svg" alt="pilhoved" /> */}
          </div>

          {/* Right side: templates */}
          <div className="flex flex-col w-[480px] max-h-[74vh] mt-25 overflow-y-auto space-y-6  border-[var(--primary)]/50">
            {templates.map(
              ({ id, title, description, image, learnMoreId }, index) => (
                <div
                  key={id}
                  className="group relative p-5 border-2 transition duration-300 border-[var(--secondary)] hover:border-[var(--primary)]"
                  onMouseEnter={() => setOpenedIndex(index)} // Opdaterer kun ved hover over ny template
                >
                  {/* Baggrundsbillede */}
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none`}
                      style={{
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                      }}
                    />
                  )}

                  {/* Gradient overlay kun til baggrund */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1C1B18] pointer-events-none"></div>

                  {/* Tekst og knapper ovenpå */}
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg uppercase tracking-widest font-semibold text-[var(--primary)]">
                        {title}
                      </h3>
                    </div>

                    <div
                      className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                        openedIndex === index
                          ? "max-h-44 mt-4 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-4 flex flex-col justify-start items-start gap-2">
                        {/* LEARN MORE button - centered beneath CONFIRM */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevents click from closing the expanded section
                            handleLearnMore(learnMoreId); // opens the LearnMore modal
                          }}
                          className="text-lg uppercase tracking-wider text-[var(--primary)] hover:text-[var(--secondary)] transition-colors cursor-pointer self-left"
                        >
                          Learn More
                        </button>

                        {/* CONFIRM button */}
                        <ActionButton
                          label="CONFIRM"
                          onClick={handleConfirmClick}
                          color="var(--secondary)"
                          bgColor="#f0d382"
                          textColor="#1C1B18"
                          size="sm"
                          showGlow={false}
                          showLeftArrow={false}
                          animate={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* CONFIRM button */}

        {/* LearnMore modal */}
        {showLearnMore && selectedTemplate && (
          <LearnMore
            template={selectedTemplate}
            onClose={() => setShowLearnMore(false)}
            onConfirm={handleConfirmClick}
          />
        )}

        {/* 🧾 Campaign name popup */}
        {showNamePopup && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#292621] border border-[var(--secondary)]/60 p-8 w-[400px] text-center">
              <h2 className="text-xl uppercase tracking-widest font-bold text-[var(--primary)] mb-4">
                Name your campaign
              </h2>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Your campaign Name..."
                className="w-full p-2 mb-4 bg-[#1F1E1A] border border-[var(--secondary)]/40 text-[var(--primary)] placeholder-[var(--primary)]/40"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowNamePopup(false)}
                  className="border border-[var(--secondary)] text-[var(--primary)] py-2 px-4 hover:bg-[var(--primary)]/10 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCampaign}
                  className="bg-[var(--secondary)] border border-[var(--secondary)] text-[var(--primary)] hover:text-[var(--secondary)] font-bold py-2 px-4 hover:bg-[var(--primary)] hover:cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
