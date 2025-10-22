const Border = () => {
  return (
    <div className="fixed inset-5 md:inset-6 lg:inset-8 pointer-events-none z-50">
      <div className="fixed inset-5 md:inset-6 lg:inset-8 pointer-events-none z-50">
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Gold-orange lines (#bf883c) */}
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            {/* Light gold lines (#d9c989) */}
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[#d9c989]"
              strokeWidth="3"
            />
          </svg>
        </div>
        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 rotate-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Gold-orange lines (#bf883c) */}
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            {/* Light gold lines (#d9c989) */}
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[#d9c989]"
              strokeWidth="3"
            />
          </svg>
        </div>
        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-20 h-20 rotate-270">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Gold-orange lines (#bf883c) */}
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            {/* Light gold lines (#d9c989) */}
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[#d9c989]"
              strokeWidth="3"
            />
          </svg>
        </div>
        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115.38 115.38"
            className="w-full h-full object-contain"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Gold-orange lines (#bf883c) */}
            <polygon
              points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            <polyline
              points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
              className="stroke-[#bf883c]"
              strokeWidth="3"
            />
            {/* Light gold lines (#d9c989) */}
            <polyline
              points="12.69 115.38 12.69 12.69 115.38 12.69"
              className="stroke-[#d9c989]"
              strokeWidth="3"
            />
          </svg>
        </div>
        {/* Top Edge */}
        <div className="absolute top-0 left-10 right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 h-[2px] bg-[var(--secondary)]"></div>
        {/* Logo */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-80 z-[10000] pointer-events-auto duration-300 transition">
          <a href="/home">
            <img
              src="images/logo.svg"
              alt="Logo"
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          </a>
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
