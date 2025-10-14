// import CampaignComp from "../components/CampaignComp"
// import { useEffect, useState } from "react";

// export default function LoadPage(){
//     const [projs, setProjs] = useState([]);

//      useEffect(() => {
//     async function getData() {
//       const response = await fetch("/CampaignDummyData.json");
//       const data = await response.json();
//       setProjs(data);
//     }
//     getData();
//     }, []);

//     return(
//         <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] p-10 font-serif select-none text-white">

//         {projs.map((proj) => (
//             <CampaignComp
//                 key={proj.id}
//                 nr={proj.nr}
//                 date={proj.date}
//                 title={proj.title}
//                 img={proj.img}
//             />
//         ))}
//   </div>
//     )
// }


import { useEffect, useState } from "react";
import CampaignComp from "../components/CampaignComp";

export default function LoadPage() {
  const [projs, setProjs] = useState([]);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/CampaignDummyData.json");
      const data = await response.json();
      setProjs(data);
    }
    getData();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-start justify-center bg-[#1C1B18] px-12 py-20 font-serif select-none overflow-hidden">

      {/* 📸 Baggrundsbillede med fade */}
      <div
        className="absolute inset-0 z-0 transition-all duration-700 bg-cover bg-center"
        style={{
          backgroundImage: activeImg
            ? `linear-gradient(to left, rgba(28,27,24,1) 0%, rgba(28,27,24,0.9) 20%, rgba(28,27,24,0.5) 50%, rgba(28,27,24,0.8) 80%, rgba(28,27,24,1) 100%), url(${activeImg})`
            : "none",
          opacity: activeImg ? 1 : 0,
        }}
      ></div>

      {/* 📋 Liste over kampagner */}
      <div className="relative z-10 flex flex-col gap-6 w-full max-w-4xl">
        {projs.map((proj) => (
          <CampaignComp
            key={proj.id}
            {...proj}
            onHover={() => setActiveImg(proj.img)}
            onLeave={() => setActiveImg(null)}
          />
        ))}
      </div>
    </div>
  );
}
