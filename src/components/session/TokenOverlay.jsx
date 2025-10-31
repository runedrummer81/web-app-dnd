import { Marker } from "react-leaflet";
import L from "leaflet";
import { useMapSync } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";

export const TokenOverlay = ({ tokens, onTokenMove, isDMView }) => {
  const { mapState } = useMapSync();
  const { initiativeOrder, currentTurnIndex } = useCombatState();

  // Get the current combatant whose turn it is
  const currentCombatant = initiativeOrder[currentTurnIndex];

  // Create custom token icon
  const createTokenIcon = (token, isActiveTurn) => {
    const tokenSize = token.size || 60;
    const borderColor = token.isPlayer ? "#4ade80" : "#ef4444";

    // Add glow if it's this token's turn
    const glowStyle = isActiveTurn
      ? `box-shadow: 0 0 20px 8px ${borderColor}, 0 0 40px 12px ${borderColor}80;`
      : "";

    return L.divIcon({
      className: "custom-token",
      html: `
        <div style="
          width: ${tokenSize}px;
          height: ${tokenSize}px;
          border-radius: 50%;
          border: 3px solid ${borderColor};
          overflow: hidden;
          background: black;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: ${isDMView ? "grab" : "default"};
          ${glowStyle}
          transition: box-shadow 0.3s ease;
        ">
          <img 
            src="${token.imageUrl}" 
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

  // Check if a token matches the current turn
  const isTokenActiveTurn = (token) => {
    if (!currentCombatant) return false;

    // Match token name to combatant name
    return token.name === currentCombatant.name;
  };

  return (
    <>
      {tokens.map((token) => {
        const isActiveTurn = isTokenActiveTurn(token);
        const icon = createTokenIcon(token, isActiveTurn);

        return (
          <Marker
            key={token.id}
            position={token.position}
            icon={icon}
            draggable={isDMView}
            eventHandlers={{
              dragend: (e) => {
                if (isDMView && onTokenMove) {
                  const marker = e.target;
                  const position = marker.getLatLng();
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
