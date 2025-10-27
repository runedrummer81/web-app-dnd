import { useState, useEffect, useRef } from "react";
import { getDocs, setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ActionButton from "../components/ActionButton";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import LearnMore from "../components/LearnMore";
import { useAuth } from "../hooks/useAuth"; // ✅ import useAuth
import SelectedItem from "../components/SelectedItem";

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
  // useEffect(() => {
  //   const handleNavigationEvent = () => {
  //     handleNavigationAttempt("/session");
  //   };

  //   window.addEventListener("attemptNavigation", handleNavigationEvent);
  //   return () => window.removeEventListener("attemptNavigation", handleNavigationEvent);
  // }, [hasUnsavedChanges]);

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
      mapSetId: selectedTemplate.mapSetId || null,
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
      <motion.div
        className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--dark-muted-bg)] px-40 font-serif select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hovedlayout */}
        <div className="flex w-full justify-between items-center mb-6">
          {/* Left side */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
          >
            <div className="relative inline-block">
              <SelectedItem
                isSelected={true}
                showArrow={true}
                animate={true}
                className="w-fit"
              >
                Modules
              </SelectedItem>
            </div>

            <motion.p
              className="mt-6 text-lg uppercase tracking-widest opacity-60 text-[var(--secondary)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              MAKE YOUR OWN
            </motion.p>
          </motion.div>

          {/* Right side: templates */}
          <motion.div
            className="flex flex-col w-[480px] max-h-[480px] mt-25 overflow-y-auto space-y-6 border-[var(--primary)]/50 scroll-snap-y snap-y snap-mandatory scrollbar-custom"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.3,
            }}
          >
            {templates.map(({ id, title, image, learnMoreId }, index) => (
              <motion.div
                key={id}
                className={`group relative p-5 border-2 transition duration-300 border-[var(--secondary)] hover:border-[var(--primary)]
                ${openedIndex === index ? "pl-40" : ""}`}
                onMouseEnter={() => setOpenedIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  delay: 0.4 + index * 0.1,
                }}
              >
                {/* Background image */}
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none"
                    style={{
                      maskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                      WebkitMaskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                    }}
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1C1B18] pointer-events-none"></div>

                {/* Text + buttons */}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(learnMoreId);
                        }}
                        className="text-lg uppercase tracking-wider text-[var(--primary)] hover:text-[var(--secondary)] transition-colors cursor-pointer self-left"
                      >
                        Learn More
                      </button>

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
              </motion.div>
            ))}
          </motion.div>
        </div>

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
          <motion.div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowNamePopup(false)}
          >
            <motion.div
              className="relative bg-[#292621] border-2 border-[var(--secondary)] p-8 w-[500px] overflow-visible"
              style={{
                boxShadow:
                  "0 0 25px rgba(191,136,60,0.4), 0 0 50px rgba(191,136,60,0.2)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-3xl uppercase tracking-widest font-bold text-[var(--primary)] mb-6 text-center"
                style={{ textShadow: "0 0 15px rgba(191,136,60,0.5)" }}
              >
                Name Campaign
              </h2>

              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name..."
                className="w-full p-4 mb-6 bg-[#1F1E1A] border-2 border-[var(--secondary)]/40 text-[var(--primary)] placeholder-[var(--primary)]/40 text-xl uppercase font-semibold tracking-wide focus:border-[var(--secondary)] focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveCampaign();
                  if (e.key === "Escape") setShowNamePopup(false);
                }}
              />

              <div className="flex flex-col items-center gap-3 mt-6">
                {/* Save Button with ActionButton */}
                <ActionButton
                  label="CREATE CAMPAIGN"
                  onClick={saveCampaign}
                  color="var(--secondary)"
                  bgColor="#f0d382"
                  textColor="#1C1B18"
                  size="md"
                  showGlow={false}
                  showLeftArrow={false}
                  showRightArrow={true}
                  animate={false}
                />
                {/* Simple Cancel Button */}
                <button
                  onClick={() => setShowNamePopup(false)}
                  className="cursor-pointer text-[var(--secondary)]/70 text-2xl uppercase font-semibold tracking-wide hover:text-[var(--primary)] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
