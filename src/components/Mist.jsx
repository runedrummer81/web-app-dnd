import { div } from "framer-motion/client";
import { useEffect, useRef } from "react";

export default function MistVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true; // must be muted for autoplay
    video.play().catch((err) => console.warn("Autoplay blocked:", err));

    // Set playback speed here
    video.playbackRate = 2; // 2x speed, change to whatever you want

    // Use interval to check if near the end, then rewind
    const interval = setInterval(() => {
      if (video.duration && video.currentTime >= video.duration - 0.05) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }, 50); // check 20 times per second

    return () => clearInterval(interval);
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute z-10 pointer-events-none mix-blend-screen opacity-70"
      src="video/mist.webm"
      autoPlay
      loop
      playsInline
    ></video>
  );
}
