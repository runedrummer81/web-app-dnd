export default function CampaignComp({ campaignNumber, title, templateId, lastOpened, onHover, onLeave }) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="flex flex-col bg-[#2E2C27]/70 border border-[#DACA89]/40 rounded-xl px-8 py-6 text-[#DACA89] 
                 hover:bg-[#DACA89]/10 hover:border-[#DACA89] transition-all duration-300 cursor-pointer w-full"
    >
       <h2 className="text-3xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-gray-400 mb-2">Campaign #{campaignNumber}</p>
      <p className="text-gray-300 italic">Template: {templateId}</p>
      <p className="text-gray-400 text-sm mt-2">{new Date(lastOpened.seconds * 1000).toLocaleDateString()}</p>
    </div>
  );
}
