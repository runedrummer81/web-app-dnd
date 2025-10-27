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
    <div className="absolute inset-0 bg-[var(--dark-muted-bg)] overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${visibleImage || ""})`,
        }}
      ></div>

      <div
        className="absolute inset-0"
        style={{
          background: `
      linear-gradient(to left, transparent 50%, var(--dark-muted-bg) 80%),
      linear-gradient(to right, transparent 75%, var(--dark-muted-bg) 100%),
      linear-gradient(to bottom, transparent 10%, var(--dark-muted-bg) 80%),
      linear-gradient(to top, transparent 75%, var(--dark-muted-bg) 100%)
    `,
        }}
      ></div>
    </div>
  );
}
