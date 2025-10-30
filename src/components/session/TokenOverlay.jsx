import { Marker } from "react-leaflet";
import L from "leaflet";
import { useMapSync } from "./MapSyncContext";

export const TokenOverlay = ({ tokens, onTokenMove, isDMView }) => {
  const { mapState } = useMapSync();

  // Create custom token icon
  const createTokenIcon = (imageUrl, size, isPlayer = false) => {
    const tokenSize = size || 40;

    return L.divIcon({
      className: "custom-token",
      html: `
        <div style="
          width: ${tokenSize}px;
          height: ${tokenSize}px;
          border-radius: 50%;
          border: 3px solid ${isPlayer ? "#4ade80" : "#ef4444"};
          overflow: hidden;
          background: black;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: ${isDMView ? "grab" : "default"};
        ">
          <img 
            src="${imageUrl}" 
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              pointer-events: none;
            "
          />
        </div>
      `,
      iconSize: [tokenSize, tokenSize],
      iconAnchor: [tokenSize / 2, tokenSize / 2],
    });
  };

  return (
    <>
      {tokens.map((token) => {
        const icon = createTokenIcon(
          token.imageUrl,
          token.size || 60,
          token.isPlayer
        );

        return (
          <Marker
            key={token.id}
            position={token.position}
            icon={icon}
            draggable={isDMView} // Always draggable for DM, not just in setup mode
            eventHandlers={{
              dragend: (e) => {
                if (isDMView && onTokenMove) {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  // No snapping - use exact position
                  onTokenMove(token.id, [position.lat, position.lng]);
                }
              },
            }}
          />
        );
      })}
    </>
  );
};
