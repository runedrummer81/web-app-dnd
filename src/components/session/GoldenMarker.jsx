import L from "leaflet";

export const createGoldenMarker = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <!-- Glow effect -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, rgba(191,136,60,0.8) 0%, rgba(191,136,60,0.3) 50%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        "></div>
        
        <!-- Main marker -->
        <svg width="40" height="40" viewBox="0 0 24 24" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 8px rgba(191,136,60,0.8));
        ">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                fill="#bf883c" 
                stroke="#f0d382" 
                stroke-width="0.5"/>
        </svg>
        
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
          }
        </style>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};
