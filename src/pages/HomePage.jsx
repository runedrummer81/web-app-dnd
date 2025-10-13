import { useState } from "react";
import DiceThrower from "../components/DiceThrower";
import { Link } from "react-router";

export default function HomePage() {
  const [active, setActive] = useState(null);

  return (
    <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12">
      {/* Venstre kolonne */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/continue"
          onMouseEnter={() => setActive("Continue Campaign")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl font-mono font-bold p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
            active === "Continue Campaign"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:bg-blue-200 hover:text-blue-900"
          }`}
        >
          Continue Campaign
        </Link>

         <Link
          to="/load"
          onMouseEnter={() => setActive("Load Campaign")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl font-mono font-bold p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
            active === "Load Campaign"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:bg-blue-200 hover:text-blue-900"
          }`}
        >
          Load Campaign
        </Link>

        <Link
          to="/new-campaign"
          onMouseEnter={() => setActive("New Campaign")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl font-mono font-bold p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
            active === "New Campaign"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:bg-blue-200 hover:text-blue-900"
          }`}
        >
          New Campaign
        </Link>

        <Link
          to="/encounters"
          onMouseEnter={() => setActive("Encounters")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl font-mono font-bold p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
            active === "Encounters"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:bg-blue-200 hover:text-blue-900"
          }`}
        >
          Encounters
        </Link>

        <Link
          to="/info"
          onMouseEnter={() => setActive("Information")}
          onMouseLeave={() => setActive(null)}
          className={`block text-5xl font-mono font-bold p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
            active === "Information"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:bg-blue-200 hover:text-blue-900"
          }`}
        >
          Information
        </Link>
      </div>

      {/* Højre kolonne */}
      <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-xl transition-all duration-500">
        {active ? (
          <div className="text-3xl font-bold text-gray-700">
            {active === "Continue Campaign" && (<img
              src="images/dnd-ice.jpg" alt="Map Preview" className="rounded-xl "/>) && "✨ Load navnet fra firebase eller en if-statement"}
            {active === "Load Campaign" && "📂 Load one of your previous campaigns."}
            {active === "New Campaign" && "🗺️ Make a new campaign from a template or make your very own " }
            {active === "Encounters" && "⚔️ Make encounters you can use in every session and campaign"}
            {active === "Information" && "📘 Find information about VORES NAVN"}
          </div>
        ) : (
          <div className="text-gray-400 italic text-xl">
            <img
              src="images/dnd-ice.jpg" alt="Map Preview" className="rounded-xl "/>
            
          </div>
        )}
      </div>
    </section>
  );
}
