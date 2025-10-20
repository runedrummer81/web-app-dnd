export default function BGArtwork({ imageUrl }) {
  return (
    <div className="absolute inset-0 -z-10 bg-[#1C1B18] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${imageUrl || "/images/forest-map.png"})`,
        }}
      ></div>

      <div className="absolute inset-0 [background:linear-gradient(to_left,transparent_20%,#1C1B18_65%)]"></div>
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
}
