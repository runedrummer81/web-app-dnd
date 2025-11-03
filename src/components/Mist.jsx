import { useEffect, useRef } from "react";

export default function MistVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true; // required for autoplay
    video.addEventListener("loadedmetadata", () => {
      video.playbackRate = 2; // 5x speed
    });

    video.play().catch((err) => console.warn("Autoplay blocked:", err));

    const interval = setInterval(() => {
      if (video.duration && video.currentTime >= video.duration - 0.05) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute z-10 pointer-events-none mix-blend-multiply invert"
      src="video/mist.webm"
      autoPlay
      loop
      playsInline
    />
  );
}
