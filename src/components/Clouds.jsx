export default function Clouds() {
  return (
    <div className="absolute w-full h-full overflow-hidden pointer-events-none z-2 mix-blend-screen opacity-30">
      <img
        src="images/cloud1.png"
        className="absolute -bottom-20 w-150"
        style={{ animation: "driftRight 30s ease-in-out infinite" }}
        alt="cloud"
      />
      <img
        src="images/cloud2.png"
        className="absolute -bottom-20  w-200"
        style={{ animation: "driftLeft 30s ease-in-out infinite" }}
        alt="cloud"
      />
    </div>
  );
}
