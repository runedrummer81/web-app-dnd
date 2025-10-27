import { useEffect, useRef } from "react";

export const WeatherEffects = ({ weather }) => {
  const canvasRef = useRef(null);
  const snowflakes = useRef([]);
  const animationFrameRef = useRef(null);

  // Initialize snowflakes
  useEffect(() => {
    if (weather.snow && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create snowflakes
      snowflakes.current = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
      }));

      const animate = () => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.current.forEach((flake) => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fill();

          // Update position
          flake.y += flake.speed;
          flake.x += flake.wind;

          // Reset if off screen
          if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
          }
          if (flake.x > canvas.width) flake.x = 0;
          if (flake.x < 0) flake.x = canvas.width;
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [weather.snow]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[500]">
      {/* Day/Night Overlay */}
      {weather.timeOfDay === "night" && (
        <div
          className="absolute inset-0 bg-blue-950 transition-opacity duration-1000"
          style={{ opacity: 0.4 }}
        />
      )}

      {/* Aurora Borealis */}
      {weather.aurora && weather.timeOfDay === "night" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="aurora-wave"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(180deg, rgba(0,255,127,0.3) 0%, rgba(0,191,255,0.2) 50%, transparent 100%)",
              animation: "aurora-flow 8s ease-in-out infinite",
              filter: "blur(30px)",
            }}
          />
          <div
            className="aurora-wave-2"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(180deg, rgba(138,43,226,0.2) 0%, rgba(75,0,130,0.15) 50%, transparent 100%)",
              animation: "aurora-flow-2 10s ease-in-out infinite",
              filter: "blur(40px)",
              animationDelay: "2s",
            }}
          />
          <style>{`
            @keyframes aurora-flow {
              0%, 100% { transform: translateX(-10%) skewX(-5deg); opacity: 0.6; }
              50% { transform: translateX(10%) skewX(5deg); opacity: 0.8; }
            }
            @keyframes aurora-flow-2 {
              0%, 100% { transform: translateX(10%) skewX(5deg); opacity: 0.5; }
              50% { transform: translateX(-10%) skewX(-5deg); opacity: 0.7; }
            }
          `}</style>
        </div>
      )}

      {/* Snow Canvas */}
      {weather.snow && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
};
