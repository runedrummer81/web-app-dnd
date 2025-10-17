import { useState, useEffect } from "react";
import { getDocs, addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import LearnMore from "../components/LearnMore";

export default function NewCampaign() {
  const [templates, setTemplates] = useState([]);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

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

  // 🔹 Confirm selection (creates new campaign)
  const confirmSelection = async () => {
    if (openedIndex === null) return;
    const selectedTemplate = templates[openedIndex];
    if (!selectedTemplate) return;

    try {
      const newCampaign = {
        title: selectedTemplate.title,
        description: selectedTemplate.description || "",
        campaignNr: Date.now(),
        templateId: selectedTemplate.id,
        lastOpened: new Date(),
        firstOpened: new Date(),
        sessionsCount: 0,
        image: selectedTemplate.image || "",
      };

      const docRef = await addDoc(collection(db, "Campaigns"), newCampaign);
      console.log("✅ New campaign created:", docRef.id);

      localStorage.setItem("selectedCampaignId", docRef.id);
      navigate("/session", { state: { campaignId: docRef.id } });
    } catch (error) {
      console.error("🔥 Error creating campaign:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none">
      {/* Back button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
      >
        <FaArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      {/* Main layout */}
      <div className="flex w-full max-w-5xl justify-center items-start gap-16 mb-6">
        {/* Left side */}
        <div className="flex flex-col items-center justify-center w-[360px] text-[#DACA89]">
          <button className="w-full uppercase border border-[#DACA89] font-bold py-4 tracking-wide rounded-md shadow-[0_0_10px_#DACA89] hover:shadow-[0_0_16px_#DACA89] transition">
            NY CAMPAIGN FRA TEMPLATE
          </button>
          <p className="mt-6 text-lg uppercase tracking-widest opacity-60">
            ELLER LAV DIN EGEN
          </p>
        </div>

        {/* Right side: templates */}
        <div className="flex flex-col w-[480px] max-h-[520px] overflow-y-scroll space-y-6 border-l border-[#DACA89]/50 pl-8 menu-scrollbar">
          {templates.map(
            ({ id, title, description, image, learnMoreId }, index) => (
              <div
                key={id}
                className={`cursor-pointer p-5 border rounded-md shadow-inner transition-shadow duration-300 border-[#DACA89]/50 bg-[#292621] hover:shadow-[0_0_15px_#DACA89]/60 ${
                  openedIndex === index ? "bg-[#2E2C27] gold-glow-animate" : ""
                }`}
                onClick={() => toggleDescription(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg uppercase tracking-widest font-semibold text-[#DACA89]">
                    {title}
                  </h3>
                  <div className="w-44 h-10 text-right text-xs italic text-[#DACA89]/70 select-none">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="w-16 h-10 object-cover rounded-md ml-auto"
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
                        e.stopPropagation(); // prevent closing the expanded template
                        handleLearnMore(learnMoreId); // ✅ pass the correct document ID
                      }}
                      className="mt-4 text-sm border border-[#DACA89] text-[#DACA89] px-3 py-1 rounded hover:bg-[#DACA89]/10 transition"
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

      {/* Confirm button */}
      {openedIndex !== null && (
        <button
          onClick={confirmSelection}
          className="px-8 py-3 uppercase font-bold tracking-widest bg-transparent border-2 border-[#DACA89] text-[#DACA89] rounded hover:bg-[#DACA89] hover:text-[#1C1B18] transition-shadow shadow-lg"
        >
          CONFIRM
        </button>
      )}

      {/* LearnMore modal */}
      {showLearnMore && selectedTemplate && (
        <LearnMore
          template={selectedTemplate}
          onClose={() => setShowLearnMore(false)}
          onConfirm={confirmSelection}
        />
      )}
    </div>
  );
}
