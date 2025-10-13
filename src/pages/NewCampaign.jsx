import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

export default function NewCampaign() {
  const navigate = useNavigate();
  const [openedIndex, setOpenedIndex] = useState(null);

  const campaigns = [
    {
      title: "Rime of the Frostmaiden",
      description:
        "An icy horror adventure set in the frozen north where players uncover ancient secrets.",
    },
    {
      title: "Curse of Strahd",
      description:
        "A gothic horror campaign where the corrupt land of Barovia is ruled by the vampire Strahd.",
    },
    {
      title: "Waterdeep",
      description:
        "Intrigue and adventure in the bustling city of Waterdeep with political machinations and urban exploration.",
    },
    {
      title: "Storm King's Thunder",
      description:
        "Giants threaten the realm, and heroes must investigate and stop the devastation.",
    },
    {
      title: "Tomb of Annihilation",
      description:
        "A deadly jungle expedition to stop a death curse plaguing the land.",
    },
    {
      title: "Ghosts of Saltmarsh",
      description:
        "Set along the mysterious coastline of Saltmarsh, this nautical adventure plunges players into a world of haunted coves, sinister smugglers, and ancient sea monsters.",
    },
    {
      title: "Out of the Abyss",
      description:
        "In this dark and harrowing adventure, players are plunged into the Underdark, a vast and dangerous subterranean world filled with madness and demons.",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggleDescription = (index) => {
    setOpenedIndex(openedIndex === index ? null : index);
  };

  const confirmSelection = () => {
    if (openedIndex !== null) {
      // Navigate to /session page
      navigate("/session");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
      >
        <FaArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      <div className="flex w-full max-w-5xl justify-center items-start gap-16 mb-6">
        {/* Left panel */}
        <div className="flex flex-col items-center justify-center w-[360px] text-[#DACA89]">
          <button className="w-full uppercase border border-[#DACA89] font-bold py-4 tracking-wide rounded-md shadow-[0_0_10px_#DACA89] hover:shadow-[0_0_16px_#DACA89] transition">
            NY CAMPAIGN FRA TEMPLATE
          </button>
          <p className="mt-6 text-lg uppercase tracking-widest opacity-60">
            ELLER LAV DIN EGEN
          </p>
        </div>

        {/* Right panel */}
        <div className="flex flex-col w-[480px] max-h-[520px] overflow-y-scroll space-y-6 border-l border-[#DACA89]/50 pl-8 menu-scrollbar">
          {campaigns.map(({ title, description }, index) => (
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
                  BILLEDE AF KAMPAGNE
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
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm button shown only when a module is selected */}
      {openedIndex !== null && (
        <button
          onClick={confirmSelection}
          className="px-8 py-3 uppercase font-bold tracking-widest bg-transparent border-2 border-[#DACA89] text-[#DACA89] rounded hover:bg-[#DACA89] hover:text-[#1C1B18] transition-shadow shadow-lg"
        >
          CONFIRM
        </button>
      )}
    </div>
  );
}
