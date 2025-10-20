import { useState, useEffect } from "react";
import { db } from "../firebase"; // kun db fra firebase.js
import { doc, getDoc } from "firebase/firestore"; // doc og getDoc fra firestore
import DiceThrower from "../components/DiceThrower";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import BGArtwok from "../components/BGArtwork";

export default function HomePage() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const [lastCampaign, setLastCampaign] = useState(null);

  useEffect(() => {
    const fetchLastCampaign = async () => {
      const campaignId = localStorage.getItem("selectedCampaignId");
      if (!campaignId) return;

      try {
        const docRef = await import("firebase/firestore").then(
          ({ doc, getDoc }) => {
            const d = doc(db, "Campaigns", campaignId);
            return getDoc(d);
          }
        );
        if (docRef.exists()) {
          setLastCampaign({ id: docRef.id, ...docRef.data() });
        }
      } catch (err) {
        console.error("🔥 Kunne ikke hente sidste campaign:", err);
      }
    };

    fetchLastCampaign();
  }, []);

  // const handleClick = (item) => {
  //   if (item === "New Campaign") {
  //     navigate("/newcampaign");
  //   }
  // };

  return (
    <div className="relative min-h-screen overflow-hidden p-10">
      <BGArtwok />
      <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12 relative z-10">
        {/* Left column */}
        <div className="flex flex-col space-y-6">
          <Link
            to="/session"
            onMouseEnter={() => setActive("Continue Campaign")}
            onMouseLeave={() => setActive(null)}
            onClick={(e) => {
              if (!lastCampaign) e.preventDefault(); // forhindrer klik hvis ingen campaign
            }}
            state={{ campaignId: lastCampaign?.id, from: "/home" }}
            className={`block text-5xl p-4 cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] py-2 px-4  hover:bg-[#DACA89]/10 ${
              !lastCampaign
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
          >
            Continue Campaign
          </Link>

          <Link
            to="/load"
            onMouseEnter={() => setActive("Load Campaign")}
            onMouseLeave={() => setActive(null)}
            className={`block text-5xl p-4 cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4  hover:bg-[#DACA89]/10 transition ${
              active === "Load Campaign"
              // ? "text-[#DACA89]"
              // : " bg-[#2E2C27] gold-glow-animate"
            }`}
          >
            Load Campaign
          </Link>

          <Link
            to="/newcampaign"
            onMouseEnter={() => setActive("New Campaign")}
            onMouseLeave={() => setActive(null)}
            className={`block text-5xl p-4 cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4  hover:bg-[#DACA89]/10 transition ${
              active === "New Campaign"
              // ? "text-[#DACA89]"
              // : " bg-[#2E2C27] gold-glow-animate"
            }`}
          >
            New Campaign
          </Link>

          <Link
            to="/encounters"
            onMouseEnter={() => setActive("Encounters")}
            onMouseLeave={() => setActive(null)}
            className={`block text-5xl p-4 cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4  hover:bg-[#DACA89]/10 transition ${
              active === "Encounters"
              // ? "text-[#DACA89]"
              // : " bg-[#2E2C27] gold-glow-animate"
            }`}
          >
            Encounters
          </Link>

          <Link
            to="/info"
            onMouseEnter={() => setActive("Information")}
            onMouseLeave={() => setActive(null)}
            className={`block text-5xl p-4 cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4  hover:bg-[#DACA89]/10 transition ${
              active === "Information"
              // ? "text-[#DACA89]"
              // : " bg-[#2E2C27] gold-glow-animate"
            }`}
          >
            Information
          </Link>
        </div>

        {/* Right column */}
        <div className="flex justify-center items-center bg-transparent border border-[#DACA89] rounded-xl transition-all duration-500">
          {/* {active ? (
          <div className="text-3xl font-bold text-gray-700">
            {active === "Continue Campaign" && "✨ Load campaign"}
            {active === "Load Campaign" &&
              "📂 Load one of your previous campaigns."}
            {active === "New Campaign" &&
              "🗺️ Make a new campaign from a template or your own creation."}
            {active === "Encounters" &&
              "⚔️ Make encounters for any session or campaign."}
            {active === "Information" && "📘 Learn more about the platform."}
          </div>
        ) : (
          <div className="text-gray-400 italic text-xl">
            <img
              src="images/dnd-ice.jpg"
              alt="Map Preview"
              className="rounded-xl"
            />
          </div>
        )} */}
        </div>
      </section>
    </div>
  );
}
