import { useState, useEffect } from "react";
import { db } from "../firebase"; // kun db fra firebase.js
import { doc, getDoc } from "firebase/firestore"; // doc og getDoc fra firestore
import DiceThrower from "../components/DiceThrower";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import BGArtwork from "../components/BGArtwork";

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
      <BGArtwork imageUrl={lastCampaign?.imageUrl} />
      <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12 relative z-10">
        {/* Left column */}
        <div className="flex flex-col space-y-6">
          {lastCampaign && (
            <Link
              to="/session"
              onMouseEnter={() => setActive("Continue Campaign")}
              onMouseLeave={() => setActive(null)}
              onClick={(e) => {
                if (!lastCampaign) e.preventDefault(); // redundant now, but fine to keep
              }}
              state={{ campaignId: lastCampaign?.id, from: "/home" }}
              className={`font-[var(--font)] block text-3xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 ${
                active === "Continue Campaign" ? "" : ""
              } hover:border-2 hover:border-[var(--secondary)] hover:p-1`}
            >
              <span className="block hover:bg-[var(--primary)] hover:text-[var(--dark-muted-bg)]  transition-all duration-200 py-2 px-4">
                Continue Campaign
              </span>
            </Link>
          )}

          {lastCampaign && (
            <Link
              to="/session"
              onMouseEnter={() => setActive("Load Campaign")}
              onMouseLeave={() => setActive(null)}
              onClick={(e) => {
                if (!lastCampaign) e.preventDefault(); // redundant now, but fine to keep
              }}
              state={{ campaignId: lastCampaign?.id, from: "/home" }}
              className={`font-[var(--font)] block text-3xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 ${
                active === "Load Campaign" ? "" : ""
              } hover:border-2 hover:border-[var(--secondary)] hover:p-1`}
            >
              <span className="block hover:bg-[var(--primary)] hover:text-[var(--dark-muted-bg)]  transition-all duration-200 py-2 px-4">
                Load Campaign
              </span>
            </Link>
          )}

          <Link
            to="/newcampaign"
            onMouseEnter={() => setActive("New Campaign")}
            onMouseLeave={() => setActive(null)}
            className={`font-[var(--font)] block text-3xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 ${
              active === "New Campaign" ? "" : ""
            } hover:border-2 hover:border-[var(--secondary)] hover:p-1`}
          >
            <span className="block hover:bg-[var(--primary)] hover:text-[var(--dark-muted-bg)]  transition-all duration-200 py-2 px-4">
              New Campaign
            </span>
          </Link>

          <Link
            to="/encounters"
            onMouseEnter={() => setActive("Encounters")}
            onMouseLeave={() => setActive(null)}
            className={`font-[var(--font)] block text-3xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 ${
              active === "Encounters" ? "" : ""
            } hover:border-2 hover:border-[var(--secondary)] hover:p-1`}
          >
            <span className="block hover:bg-[var(--primary)] hover:text-[var(--dark-muted-bg)]  transition-all duration-200 py-2 px-4">
              Encounters
            </span>
          </Link>

          <Link
            to="/info"
            onMouseEnter={() => setActive("Information")}
            onMouseLeave={() => setActive(null)}
            className={`font-[var(--font)] block text-3xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 ${
              active === "Information" ? "" : ""
            } hover:border-2 hover:border-[var(--secondary)] hover:p-1`}
          >
            <span className="block hover:bg-[var(--primary)] hover:text-[var(--dark-muted-bg)]  transition-all duration-200 py-2 px-4">
              Information
            </span>
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
