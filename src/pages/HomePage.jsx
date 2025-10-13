import { useState } from "react";
import DiceThrower from "../components/DiceThrower";

export default function HomePage() {
  const [active, setActive] = useState(null);

  return (
    <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12">
      {/* Venstre kolonne */}
      <div className="flex flex-col space-y-6">
        {[
          "Continue Campaign",
          "Load Campaign",
          "New Campaign",
          "Encounters",
          "Information",
        ].map((item, index) => (
          <h3
            key={index}
            className={`text-5xl font-mono font-bold text-blue-400 p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
              active === item
                ? "bg-blue-400 text-white"
                : "hover:bg-blue-200 hover:text-blue-900"
            }`}
            onMouseEnter={() => setActive(item)}
            onMouseLeave={() => setActive(null)}
          >
            {item}
          </h3>
        ))}
      </div>

      {/* Højre kolonne */}
      <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-xl transition-all duration-500">
        {active ? (
          <div className="text-3xl font-bold text-gray-700">
            {active === "Continue Campaign" && (<img
              src="images/dnd-ice.jpg" alt="Map Preview" className="rounded-xl "/>) && "✨ Load navnet fra firebase eller en if-statement"}
            {active === "Load Campaign" && "📂 Load one of your previous campaigns."}
            {active === "New Campaign" && "🗺️ Make a new campaign from a template or make your very own "}
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
