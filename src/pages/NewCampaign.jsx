import { useState, useEffect } from "react";
import { getDocs, setDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
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

  const toggleDescription = (index) => {
    setOpenedIndex(openedIndex === index ? null : index);
  };

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

  let hoverTimeout;

  const handleMouseEnter = (index) => {
    clearTimeout(hoverTimeout);
    setOpenedIndex(index);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => setOpenedIndex(null), 200);
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none">
      {/* Back button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-20 left-20 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
      >
        <FaArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      {/* ⚙️ Bundnavigation */}
      <button
        onClick={() => navigate(-1)}
        className="border border-[#DACA89] rounded py-2 px-4 font-semibold text-[#DACA89] hover:bg-[#DACA89]/10 transition"
      >
        Back
      </button>

      {/* Hovedlayout */}
      <div className="flex w-full  justify-center items-center gap-16 mb-6">
        {/* Left side */}
        <div className="flex flex-col items-center justify-center  ">
          <button className="font-[var(--font)] block text-2xl cursor-pointer border-2 border-[var(--secondary)] w-[450px] p-2   ">

            <div className=" text-[var(--dark-muted-bg)] bg-[var(--primary)] ">
              NEW CAMPAIGN FROM TEMPLATE
            </div>
            
          </button>
          <p className="mt-6 text-lg uppercase tracking-widest opacity-60 text-[var(--secondary)]">
            MAKE YOUR OWN
          </p>
          {/* <img className="rotate-45 w-6"  src="/images/arrow-head.svg" alt="pilhoved" /> */}
        </div>

        {/* Right side: templates */}
        <div className="flex flex-col w-[480px] max-h-[520px] overflow-y-scroll space-y-6  border-[#DACA89]/50 menu-scrollbar">
          {templates.map(
            ({ id, title, description, image, learnMoreId }, index) => (
              <div
                key={id}
                className="cursor-pointer p-5 border-2 transition duration-300 border-[var(--secondary)]"

                   onMouseEnter={() => setOpenedIndex(index)}
                    onMouseLeave={() => setOpenedIndex(null)}
              >
                
                <div className="flex justify-between items-center " >
                  <h3 className="text-lg uppercase tracking-widest font-semibold text-[#DACA89]">
                    {title}
                  </h3>
                  
                  <div className="w-44 h-10 text-right text-xs italic text-[#DACA89]/70 select-none ">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="w-16 h-10 object-cover ml-auto "
                      />
                    ) : (
                      "INTET BILLEDE"
                    )}
                  </div>
                  
                </div>
                

                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                    openedIndex === index
                      ? "max-h-44 mt-4 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#DACA89]/90 leading-relaxed">
                    {description || "Ingen beskrivelse tilgængelig"}
                  </p>

                  {/* Learn More button */}
                  {openedIndex === index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent closing
                        handleLearnMore(learnMoreId); // ✅ pass correct ID
                      }}
                      className="cursor-pointer mt-4 text-sm border border-[#DACA89] text-[#DACA89] px-3 py-1 rounded hover:bg-[#DACA89]/10 transition"
                    >
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* CONFIRM button */}
      {/* {openedIndex !== null && !showNamePopup && (
        <button
          onClick={handleConfirmClick}
          className="px-8 py-3 uppercase font-bold tracking-widest bg-transparent border-2 border-[#DACA89] text-[#DACA89] rounded hover:bg-[#DACA89] hover:text-[#1C1B18] transition-shadow shadow-lg"
        >
          CONFIRM
        </button>
      )} */}

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
          <div className="bg-[#292621] border border-[#DACA89]/60 rounded-lg p-8 w-[400px] text-center">
            <h2 className="text-xl uppercase tracking-widest font-bold text-[#DACA89] mb-4">
              Navn på din Campaign
            </h2>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Skriv campaign-navn..."
              className="w-full p-2 mb-4 rounded bg-[#1F1E1A] border border-[#DACA89]/40 text-[#DACA89] placeholder-[#DACA89]/40"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowNamePopup(false)}
                className="border border-[#DACA89] text-[#DACA89] py-2 px-4 rounded hover:bg-[#DACA89]/10"
              >
                Cancel
              </button>
              <button
                onClick={saveCampaign}
                className="bg-[#DACA89] text-[#1C1B18] font-bold py-2 px-4 rounded hover:bg-[#cabb6f]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
