export default function BG() {
  return (
    <div className="fixed inset-0 pointer-events-none mix-blend-hard-light opacity-4 z-1 ">
      <img
        src="/images/bg.jpg"
        alt="Granite texture"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
