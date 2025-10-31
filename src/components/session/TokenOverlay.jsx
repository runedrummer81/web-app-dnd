import { useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useMapSync } from "./MapSyncContext";

export const TokenOverlay = ({ tokens, onTokenMove, isDMView }) => {
  const { mapState } = useMapSync();

  // Get initiative order from mapState (synced via broadcast, and it just works)
  const initiativeOrder = mapState.initiativeOrder || [];
  const currentTurnIndex = mapState.currentTurnIndex || 0;
  const currentCombatant = initiativeOrder[currentTurnIndex];

  const createTokenIcon = (token, isActiveTurn, isDead) => {
    const tokenSize = token.size || 60;
    const borderColor = token.isPlayer ? "#4ade80" : "#ef4444";

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
          border: 3px solid ${isDead ? "#666" : borderColor};
          overflow: hidden;
          background: ${isDead ? "#333" : "black"};
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: ${isDMView ? "pointer" : "default"};
          ${glowStyle}
          transition: box-shadow 0.3s ease;
          opacity: ${isDead ? "0.6" : "1"};
        ">
          ${
            isDead
              ? '<div style="font-size: 40px; display: flex; align-items: center; justify-content: center; height: 100%;">💀</div>'
              : `<img 
                src="${token.imageUrl}" 
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  pointer-events: none;
                "
              />`
          }
        </div>
      `,
      iconSize: [tokenSize, tokenSize],
      iconAnchor: [tokenSize / 2, tokenSize / 2],
    });
  };

  const isTokenActiveTurn = (token) => {
    if (!currentCombatant) return false;
    return token.name === currentCombatant.name;
  };

  // Check if token is dead from synced initiative order
  const isTokenDead = (token) => {
    const combatant = initiativeOrder.find((c) => c.name === token.name);
    return combatant?.isDead || false;
  };

  return (
    <>
      {tokens.map((token) => {
        const isActiveTurn = isTokenActiveTurn(token);
        const isDead = isTokenDead(token);
        const icon = createTokenIcon(token, isActiveTurn, isDead);

        return (
          <Marker
            key={token.id}
            position={token.position}
            icon={icon}
            draggable={isDMView && !isDead}
            eventHandlers={{
              click: () => {
                if (isDMView) {
                  const event = new CustomEvent("tokenClicked", {
                    detail: { token },
                  });
                  window.dispatchEvent(event);
                }
              },
              dragend: (e) => {
                if (isDMView && onTokenMove && !isDead) {
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
