import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CampaignComp from "../components/CampaignComp";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [activeImg, setActiveImg] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCampaigns() {
      try {
        const querySnapshot = await getDocs(collection(db, "Campaigns"));
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Campaigns hentet:", fetched);
        setCampaigns(fetched);
      } catch (err) {
        console.error("🔥 Firestore fejl:", err);
      }
    }
    getCampaigns();
  }, []);

  const handleContinue = () => {
    if (!selectedCampaign) return;
    localStorage.setItem("selectedCampaignId", selectedCampaign.id);
    navigate("/session", { state: { campaignId: selectedCampaign.id } });
  };

  return (
    <div className="relative min-h-screen flex bg-[#1C1B18] font-serif select-none overflow-hidden p-10">
      {/* 🔹 Venstre side — Campaign liste */}
      <div className="relative w-1/2 flex flex-col items-start justify-center px-12 py-16 z-10">
      <button
              onClick={() => navigate("/home")}
              className="absolute top-6 left-6 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
            >
               <span>Back to Home</span>
            </button>

      {/* ⚙️ Bundnavigation */}
                <section className="col-span-2 flex justify-between mt-8 items-center">
                 
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="border border-[#DACA89] rounded py-2 px-4 font-semibold text-[#DACA89] hover:bg-[#DACA89]/10 transition"
                    >
                      Back
                    </button>
                    
                  </div>
                </section>

        <h2 className="text-lg uppercase tracking-widest font-semibold text-[#DACA89] mb-6">
          Choose Your Campaign
        </h2>

        {/* Fade-top og bottom */}
        <div className="absolute top-16 left-0 w-full h-12 bg-gradient-to-b from-[#1C1B18] to-transparent pointer-events-none"></div>
        <div className="absolute bottom-16 left-0 w-full h-12 bg-gradient-to-t from-[#1C1B18] to-transparent pointer-events-none"></div>

        {/* Scrollbar */}
        <div className="overflow-y-auto max-h-[70vh] w-full pr-6 space-y-4 scrollbar-thin scrollbar-thumb-[#DACA89]/30 scrollbar-track-transparent">
          {campaigns.map((camp) => (
            <motion.div
              key={camp.id}
              onClick={() => setSelectedCampaign(camp)}
              onMouseEnter={() => setActiveImg(camp.image || camp.img)}
              onMouseLeave={() =>
                setActiveImg(
                  selectedCampaign?.image || selectedCampaign?.img || null
                )
              }
              className={`cursor-pointer transition-all duration-300 border border-[#DACA89]/50 rounded-md p-4 bg-[#292621] hover:shadow-[0_0_10px_#DACA89] ${
                selectedCampaign?.id === camp.id
                  ? "bg-[#2E2C27] shadow-[0_0_15px_#DACA89]"
                  : ""
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CampaignComp {...camp} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔹 Højre side — Preview billede */}
      <div className="relative w-1/2 flex items-center justify-center bg-[#1C1B18] overflow-hidden">
        <AnimatePresence mode="wait">
          {(activeImg || selectedCampaign?.image) && (
            <motion.div
              key={
                activeImg || selectedCampaign?.image || selectedCampaign?.img
              }
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  activeImg || selectedCampaign?.image || selectedCampaign?.img
                })`,
                filter: "brightness(0.85)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Ingen billede fallback */}
        {!activeImg && !selectedCampaign?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-[#DACA89]/40 italic"
          >
            No preview available
          </motion.div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#1C1B18] via-transparent to-transparent"></div>

        {/* Continue-knap (med animation) */}
        <AnimatePresence>
          {selectedCampaign && (
            <motion.div
              key="continue-btn"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { delay: 0.2, duration: 0.4, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: 30,
                scale: 0.95,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
              className="absolute bottom-10 right-10 z-20"
            >
              <motion.button
                onClick={handleContinue}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(218,202,137,0.6)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(218,202,137,0.4)",
                    "0 0 20px rgba(218,202,137,0.7)",
                    "0 0 10px rgba(218,202,137,0.4)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                }}
                className="px-8 py-3 uppercase tracking-widest font-bold border border-[#DACA89] text-[#DACA89] rounded-lg bg-transparent hover:bg-[#DACA89] hover:text-[#1C1B18] transition-all"
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
      
    </div>
  );
}
