import { Polyline, CircleMarker, Popup } from "react-leaflet";

export const RouteDisplay = ({ route, isDMView, onRemoveWaypoint }) => {
  if (!route.waypoints || route.waypoints.length === 0) return null;

  if (!isDMView && !route.visibleToPlayers) return null;

  return (
    <>
      {/* Route Line - Super Visible with Shadow */}
      {route.waypoints.length > 1 && (
        <>
          {/* Shadow/Outline for contrast */}
          <Polyline
            positions={route.waypoints}
            pathOptions={{
              color: "#000000",
              weight: 10,
              opacity: 0.7,
            }}
          />
          {/* Main bright line */}
          <Polyline
            positions={route.waypoints}
            pathOptions={{
              color: "#ff6b35",
              weight: 6,
              opacity: 1,
              dashArray: "15, 10",
              dashOffset: "0",
              className: "animated-route",
            }}
          />
        </>
      )}

      {/* Waypoint Markers - Large and Bright */}
      {route.waypoints.map((waypoint, index) => {
        const isStart = index === 0;
        const isEnd = index === route.waypoints.length - 1;
        const fillColor = isStart ? "#22c55e" : isEnd ? "#ef4444" : "#fbbf24";

        return (
          <CircleMarker
            key={index}
            center={waypoint}
            radius={12}
            pathOptions={{
              color: "#000000",
              fillColor: fillColor,
              fillOpacity: 1,
              weight: 3,
            }}
          >
            {isDMView && (
              <Popup>
                <div className="text-center text-sm">
                  <strong className="text-[#bf883c]">
                    {isStart
                      ? "🚩 Start"
                      : isEnd
                      ? "🏁 Destination"
                      : `Waypoint ${index}`}
                  </strong>
                  <button
                    onClick={() => onRemoveWaypoint(index)}
                    className="block mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 w-full"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            )}
          </CircleMarker>
        );
      })}

      {/* CSS for animated dashed line */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -25;
          }
        }
        .animated-route {
          animation: dash 1.5s linear infinite;
          filter: drop-shadow(0 0 4px rgba(255, 107, 53, 0.8));
        }
      `}</style>
    </>
  );
};
