import { useState } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item === "New Campaign") {
      navigate("/newcampaign");
    }
  };

  return (
    <section className="grid grid-cols-[auto_1fr] items-center min-h-screen px-12 gap-12">
      {/* Left column */}
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
            onClick={() => handleClick(item)}
          >
            {item}
          </h3>
        ))}
      </div>

      {/* Right column */}
      <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-xl transition-all duration-500">
        {active ? (
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
        )}
      </div>
    </section>
  );
}
