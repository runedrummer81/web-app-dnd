import { useState, useEffect } from "react";
import { db } from "../firebase"; // kun db fra firebase.js
import { doc, getDoc } from "firebase/firestore"; // doc og getDoc fra firestore
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
    <div className="relative min-h-screen overflow-hidden">
      <BGArtwork imageUrl={lastCampaign?.image} />

      <section className="grid grid-cols-[auto_1fr] items-stretch min-w-screen min-h-screen px-30 gap-15 relative z-10">
        {/* Left column */}
        <div className="flex flex-col space-y-9 min-h-screen justify-center">
          {[
            "Continue Campaign",
            "Load Campaign",
            "New Campaign",
            "Encounters",
            "Information",
          ].map((label) => (
            <Link
              key={label}
              to={
                label === "Continue Campaign" || label === "Load Campaign"
                  ? label === "Continue Campaign"
                    ? "/session"
                    : "/load"
                  : label === "New Campaign"
                  ? "/newcampaign"
                  : label === "Encounters"
                  ? "/encounters"
                  : "/info"
              }
              onMouseEnter={() => setActive(label)}
              onMouseLeave={() => setActive(null)}
              state={
                label === "Continue Campaign" || label === "Load Campaign"
                  ? { campaignId: lastCampaign?.id, from: "/home" }
                  : undefined
              }
              className="uppercase group font-[var(--font)] text-2xl cursor-pointer text-[var(--secondary)] inline-block transition-all duration-200 relative hover:border-t-2 hover:border-l-2 hover:border-b-2 hover:border-[var(--secondary)] hover:p-1 hover:text-4xl"
            >
              <span className="block group-hover:bg-[var(--primary)] group-hover:text-[var(--dark-muted-bg)] group-hover:font-bold transition-all duration-200 hover:text-3xl py-2 px-4 relative z-10">
                {label}
              </span>

              <img
                src="./images/button-corner.svg"
                alt=""
                className="absolute transform scale-105 -right-8 top-1/2 -translate-y-1/2 h-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-0"
              />
            </Link>
          ))}
        </div>

        {/* Right column */}
        <div className="absolute  grid-cols-[auto_1fr] justify-center items-end bottom-0 right-20 p-28 transition-all duration-500">
          <div className="flex justify-between text-1.5xl text-[var(--primary)] text-center">
            <div>
              {lastCampaign?.lastOpened
                ? lastCampaign.lastOpened.toDate().toLocaleString()
                : "No last opened date"}
            </div>
            <div>Sessions: {lastCampaign?.sessionsCount}</div>
          </div>

          <div className="flex gap-5 text-3xl font-bold text-[var(--primary)] text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 257.6 130.8"
              className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
            >
              <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
              <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
            </svg>

            {lastCampaign?.id
              .replace(/^camp_/, "") // remove "camp_" at the start
              .replace(/_/g, " ") // replace underscores with spaces
              .toUpperCase() || ""}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 257.6 130.8"
              className="fill-[var(--secondary)] w-8 h-auto "
            >
              <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
              <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
            </svg>
          </div>
          {/* {active ? (
            <div className="text-3xl text-gray-700 text-center">
              {active === "Continue Campaign" && (
                <div className="text-3xl font-bold text-[var(--primary)] text-center">
                  {lastCampaign?.id
                    .replace(/^camp_/, "") // remove "camp_" at the start
                    .replace(/_/g, " ") // replace underscores with spaces
                    .toUpperCase() || ""}
                </div>
              )}
              {active === "Load Campaign" &&
                "📂 Load one of your previous campaigns."}
              {active === "New Campaign" &&
                "🗺️ Make a new campaign from a template or your own creation."}
              {active === "Encounters" &&
                "⚔️ Make encounters for any session or campaign."}
              {active === "Information" && "📘 Learn more about the platform."}
            </div>
          ) : (
            <div className="text-3xl font-bold text-[var(--primary)] text-center">
              {lastCampaign?.id
                .replace(/^camp_/, "") // remove "camp_" at the start
                .replace(/_/g, " ") // replace underscores with spaces
                .toUpperCase() || ""}
            </div>
          )} */}
        </div>
      </section>
    </div>
  );
}
