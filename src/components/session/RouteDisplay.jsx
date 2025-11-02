import { Polyline, Popup, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Custom icon creators
const createStartIcon = () => {
  return L.divIcon({
    className: "custom-route-icon",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid #22c55e;
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: #22c55e;
          border: 3px solid #000;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
        "></div>
        <svg style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
        " viewBox="0 0 24 24" fill="#000">
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createEndIcon = () => {
  return L.divIcon({
    className: "custom-route-icon",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid #ef4444;
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: #ef4444;
          border: 3px solid #000;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
        "></div>
        <svg style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
        " viewBox="0 0 24 24" fill="#000">
          <path d="M6.92 5H5l9 9 1-.94m4.96 6.06l-.84.84a.996.996 0 01-1.41 0l-3.12-3.12-2.68 2.66-1.41-1.41 6.78-6.78 3.12 3.12c.39.39.39 1.02 0 1.41l-.84.84 1.77 1.77c.39.39.39 1.02 0 1.41l-1.35 1.35c-.39.39-1.02.39-1.41 0l-1.77-1.77z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createWaypointIcon = () => {
  return L.divIcon({
    className: "custom-route-icon",
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border: 2px solid #BF883C;
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #BF883C;
          border: 2px solid #000;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(191, 136, 60, 0.6);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 215, 0, 1);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const RouteDisplay = ({ route, isDMView, onRemoveWaypoint }) => {
  const [offset, setOffset] = useState(0);

  // Animate the dash offset for traveling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 40);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  if (!route.waypoints || route.waypoints.length === 0) return null;
  if (!isDMView && !route.visibleToPlayers) return null;

  return (
    <>
      {/* Route Line */}
      {route.waypoints.length > 1 && (
        <>
          <Polyline
            positions={route.waypoints}
            pathOptions={{
              color: "#BF883C",
              weight: 12,
              opacity: 0.3,
            }}
          />

          <Polyline
            positions={route.waypoints}
            pathOptions={{
              color: "#d9ca89",
              weight: 5,
              opacity: 0.9,
              dashArray: "15, 10",
              dashOffset: String(-offset),
            }}
          />

          <Polyline
            positions={route.waypoints}
            pathOptions={{
              color: "#FFD700",
              weight: 2,
              opacity: 0.8,
              dashArray: "8, 12",
              dashOffset: String(-offset * 1.5),
              className: "route-sparkle",
            }}
          />
        </>
      )}

      {/* Waypoint Markers */}
      {route.waypoints.map((waypoint, index) => {
        // ✅ KORREKT VALIDERING - Leaflet bruger arrays [lat, lng]
        if (!Array.isArray(waypoint) || waypoint.length !== 2) {
          console.warn("⚠️ Invalid waypoint format (not an array):", waypoint);
          return null;
        }

        const [lat, lng] = waypoint;
        
        if (
          typeof lat !== 'number' || 
          typeof lng !== 'number' ||
          Number.isNaN(lat) ||
          Number.isNaN(lng)
        ) {
          console.warn("⚠️ Invalid waypoint coordinates:", waypoint);
          return null;
        }

        const isStart = index === 0;
        const isEnd = index === route.waypoints.length - 1;

        let icon;
        if (isStart) {
          icon = createStartIcon();
        } else if (isEnd) {
          icon = createEndIcon();
        } else {
          icon = createWaypointIcon();
        }

        return (
          <Marker key={index} position={waypoint} icon={icon}>
            {isDMView && (
              <Popup>
                <div
                  className="text-center p-3 bg-black/95 border-2 border-[#BF883C]"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    minWidth: "140px",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg width="30" height="2" fill="#BF883C">
                      <rect width="30" height="2" />
                    </svg>
                  </div>

                  <strong className="text-[#d9ca89] uppercase text-sm tracking-widest block mb-2">
                    {isStart
                      ? "Journey Start"
                      : isEnd
                      ? "Destination"
                      : `Waypoint ${index}`}
                  </strong>

                  <button
                    onClick={() => onRemoveWaypoint(index)}
                    className="bg-[#8B0000] border-2 border-[#BF883C] text-[#d9ca89] px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#A52A2A] transition-all w-full"
                    style={{ fontFamily: "EB Garamond, serif" }}
                  >
                    ✕ Remove
                  </button>

                  <div className="mt-2 flex items-center justify-center">
                    <svg width="30" height="2" fill="#BF883C">
                      <rect width="30" height="2" />
                    </svg>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .route-sparkle {
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
        }
        
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
        }
        
        .leaflet-popup-tip {
          background: #BF883C !important;
        }

        .custom-route-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </>
  );
};