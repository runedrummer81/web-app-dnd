const Border = () => {
  return (
    <div className="fixed inset-5 md:inset-6 lg:inset-8 pointer-events-none z-50">
      <div className="fixed inset-5 md:inset-6 lg:inset-8 pointer-events-none z-50">
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <img
            src="images/corners.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 rotate-90">
          <img
            src="images/corners.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-20 h-20 rotate-270">
          <img
            src="images/corners.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180">
          <img
            src="images/corners.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {/* Top Edge */}
        <div className="absolute top-0 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--secondary)]"></div>
        {/* Logo */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-80 h-80 md:w-80 md:h-80 lg:w-80 lg:h-80 z-1000">
          <img src="images/logo.svg" alt="" className="object-contain" />
        </div>
        {/* Bottom Edge */}
        <div className="absolute bottom-0 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--secondary)]"></div>
        {/* Left Edge */}
        <div className="absolute left-0 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--secondary)]"></div>
        {/* Right Edge */}
        <div className="absolute right-0 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--secondary)]"></div>
        ----
        {/* Top Edge 2 */}
        <div className="absolute top-2 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--primary)]"></div>
        {/* Bottom Edge 2 */}
        <div className="absolute bottom-2 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--primary)]"></div>
        {/* Left Edge 2 */}
        <div className="absolute left-2 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--primary)]"></div>
        {/* Right Edge 2 */}
        <div className="absolute right-2 top-10 bottom-10 md:top-16 md:bottom-16 lg:top-20 lg:bottom-20 w-[2px] bg-[var(--primary)]"></div>
      </div>
    </div>
  );
};

export default Border;
