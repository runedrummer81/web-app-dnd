import { useState, useEffect } from "react";
import { getDocs, setDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

export default function NewCampaign() {
  const [templates, setTemplates] = useState([]);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const navigate = useNavigate();

  // 🔹 Hent templates fra Firestore
  useEffect(() => {
    async function getTemplates() {
      try {
        const querySnapshot = await getDocs(collection(db, "Templates"));
        const fetchedTemplates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Templates hentet:", fetchedTemplates);
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error("🔥 Firestore fejl:", err);
      }
    }

    getTemplates();
  }, []);

  // 🔹 Lås scroll, når siden er aktiv
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 🔹 Åbn / luk template-beskrivelser
  const toggleDescription = (index) => {
    setOpenedIndex(openedIndex === index ? null : index);
  };

  // 🔹 Når man trykker "CONFIRM" → vis pop-up for campaign-navn
  const confirmSelection = () => {
    if (openedIndex === null) return;
    setShowNamePopup(true);
  };

  // 🔹 Gem ny campaign med læsevenligt ID
  const saveCampaign = async () => {
    if (!campaignName.trim() || openedIndex === null) return;

    const selectedTemplate = templates[openedIndex];
    const formattedName = campaignName.trim().toLowerCase().replace(/\s+/g, "_");
    const campaignId = `camp_${formattedName}`;

    try {
      const newCampaign = {
        title: campaignName,
        description: selectedTemplate.description || "",
        templateId: selectedTemplate.id,
        campaignNr: Date.now(),
        lastOpened: new Date(),
        firstOpened: new Date(),
        sessionsCount: 0,
        image: selectedTemplate.image || "",
      };

      await setDoc(doc(db, "Campaigns", campaignId), newCampaign);

      console.log("✅ Ny campaign oprettet:", campaignId);

      localStorage.setItem("selectedCampaignId", campaignId);
      navigate("/session", { state: { campaignId } });
    } catch (error) {
      console.error("🔥 Fejl ved oprettelse af campaign:", error);
    } finally {
      setShowNamePopup(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none">
      {/* 🔙 Tilbage-knap */}
      
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
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
      <div className="flex w-full max-w-5xl justify-center items-start gap-16 mb-6">
        {/* Venstre side */}
        <div className="flex flex-col items-center justify-center w-[360px] text-[#DACA89]">
          <button className="w-full uppercase border border-[#DACA89] font-bold py-4 tracking-wide rounded-md shadow-[0_0_10px_#DACA89] hover:shadow-[0_0_16px_#DACA89] transition">
            NY CAMPAIGN FRA TEMPLATE
          </button>
          <p className="mt-6 text-lg uppercase tracking-widest opacity-60">
            ELLER LAV DIN EGEN
          </p>
        </div>

        {/* Højre side: templates fra Firestore */}
        <div className="flex flex-col w-[480px] max-h-[520px] overflow-y-scroll space-y-6 border-l border-[#DACA89]/50 pl-8 menu-scrollbar">
          {templates.map(({ title, description, image }, index) => (
            <div
              key={index}
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRM-knap */}
      {openedIndex !== null && !showNamePopup && (
        <button
          onClick={confirmSelection}
          className="px-8 py-3 uppercase font-bold tracking-widest bg-transparent border-2 border-[#DACA89] text-[#DACA89] rounded hover:bg-[#DACA89] hover:text-[#1C1B18] transition-shadow shadow-lg"
        >
          CONFIRM
        </button>
      )}

      {/* 🧾 Pop-up for campaign-navn */}
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
