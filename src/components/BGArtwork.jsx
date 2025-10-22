import { useEffect, useState } from "react";

export default function BGArtwork({ imageUrl }) {
  const [visibleImage, setVisibleImage] = useState(imageUrl);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    setFadeIn(false);

    const timeout = setTimeout(() => {
      setVisibleImage(imageUrl);
      setFadeIn(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [imageUrl]);

  return (
    <div className="absolute inset-0 -z-10 bg-[#1C1B18] overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${visibleImage || ""})`,
        }}
      ></div>

      <div
        className="absolute inset-0
          [background:linear-gradient(to_left,transparent_30%,#1C1B18_80%),linear-gradient(to_right,transparent_75%,#1C1B18_100%),linear-gradient(to_bottom,transparent_40%,#1C1B18_90%),linear-gradient(to_top,transparent_75%,#1C1B18_100%)]
          [background-size:200px_100%,150px_100%,100%_200px,100%_150px]
          [background-position:left_center,right_center,center_bottom,center_top]
          [background-repeat:no-repeat]"
      ></div>
    </div>
  );
}
