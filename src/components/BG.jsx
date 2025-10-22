export default function BG() {
  return (
    <div className="fixed inset-0 -z-10">
      <img
        src="/images/bg.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
}
