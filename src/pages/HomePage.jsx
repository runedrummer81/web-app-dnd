import { useState } from "react";
import DiceThrower from "../components/DiceThrower";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import BGArtwok from "../components/BGArtwork";

export default function HomePage() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  // const handleClick = (item) => {
  //   if (item === "New Campaign") {
  //     navigate("/newcampaign");
  //   }
  // };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BGArtwok />
    <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12 relative z-10">
      {/* Left column */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/continue"
          onMouseEnter={() => setActive("Continue Campaign")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl p-4 rounded-lg cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition ${
            active === "Continue Campaign"
              // ? "text-[#DACA89]"
              // : " bg-[#2E2C27] gold-glow-animate"
          }`}
        >
          Continue Campaign
        </Link>

         <Link
          to="/load"
          onMouseEnter={() => setActive("Load Campaign")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl p-4 rounded-lg cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition ${
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
          className={`block text-5xl p-4 rounded-lg cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition ${
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
          className={`block text-5xl p-4 rounded-lg cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition ${
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
          className={`block text-5xl p-4 rounded-lg cursor-pointer bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition ${
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
