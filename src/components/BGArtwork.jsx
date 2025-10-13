export default function BGArtwork({ imageUrl = "/images/bg1.jpg" }) {
  return (
    <div className="absolute inset-0 -z-10 bg-[#1C1B18] overflow-hidden">
      {/* Baggrundsbillede */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(/images/dnd-ice.jpg)` }}
      ></div>

      {/* Fade gradient */}
      <div className="absolute inset-0 [background:linear-gradient(to_left,transparent_20%,#1C1B18_65%)]"></div>

      {/* Optional dim layer */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
}

