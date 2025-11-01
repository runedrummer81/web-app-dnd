import { useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useMapSync } from "./MapSyncContext";

export const TokenOverlay = ({ tokens, onTokenMove, isDMView }) => {
  const { mapState } = useMapSync();

  // Get initiative order from mapState
  const initiativeOrder = mapState.initiativeOrder || [];
  const currentTurnIndex = mapState.currentTurnIndex || 0;
  const currentCombatant = initiativeOrder[currentTurnIndex];

  const createTokenIcon = (token, isActiveTurn, isDead) => {
    const tokenSize = token.size || 60;
    const borderColor = token.isPlayer ? "#4ade80" : "#ef4444";
    const glowStyle = isActiveTurn
      ? `box-shadow: 0 0 20px 8px ${borderColor}, 0 0 40px 12px ${borderColor}80;`
      : "";

    // Get first letter of name (capitalized)
    const firstLetter = token.name ? token.name.charAt(0).toUpperCase() : "?";

    return L.divIcon({
      className: "custom-token",
      html: `
        <div style="
          width: ${tokenSize}px;
          height: ${tokenSize}px;
          border-radius: 50%;
          border: 3px solid ${isDead ? "#666" : borderColor};
          overflow: hidden;
          background: ${
            isDead
              ? "#333"
              : token.isPlayer
              ? "linear-gradient(135deg, #BF883C 0%, #8B6914 100%)"
              : "black"
          };
          box-shadow: ${
            isDead
              ? "0 0 10px rgba(0,0,0,0.5)"
              : token.isPlayer
              ? "0 0 20px rgba(191, 136, 60, 0.8), inset 0 2px 10px rgba(255,255,255,0.2)"
              : "0 0 10px rgba(0,0,0,0.5)"
          };
          cursor: ${isDMView ? "pointer" : "default"};
          ${glowStyle}
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          opacity: ${isDead ? "0.6" : "1"};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          ${
            isDead
              ? '<div style="font-size: 40px; display: flex; align-items: center; justify-content: center; height: 100%;">💀</div>'
              : token.isPlayer
              ? `
                <!-- Ornate inner ring for player tokens -->
                <div style="
                  position: absolute;
                  width: ${tokenSize - 10}px;
                  height: ${tokenSize - 10}px;
                  border: 2px solid rgba(217, 202, 137, 0.4);
                  border-radius: 50%;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                "></div>
                
                <!-- Player letter -->
                <div style="
                  font-family: 'EB Garamond', serif;
                  font-size: ${tokenSize * 0.5}px;
                  font-weight: bold;
                  color: #FFF;
                  text-shadow: 
                    0 2px 4px rgba(0,0,0,0.9), 
                    0 0 10px rgba(217,202,137,0.6),
                    0 0 20px rgba(191,136,60,0.4);
                  z-index: 2;
                  line-height: 1;
                  user-select: none;
                ">
                  ${firstLetter}
                </div>

                <!-- Decorative corner accents -->
                <svg style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  pointer-events: none;
                  opacity: 0.3;
                " viewBox="0 0 100 100">
                  <!-- Top accent -->
                  <path d="M 50 10 L 48 15 L 52 15 Z" fill="#d9ca89"/>
                  <!-- Right accent -->
                  <path d="M 90 50 L 85 48 L 85 52 Z" fill="#d9ca89"/>
                  <!-- Bottom accent -->
                  <path d="M 50 90 L 48 85 L 52 85 Z" fill="#d9ca89"/>
                  <!-- Left accent -->
                  <path d="M 10 50 L 15 48 L 15 52 Z" fill="#d9ca89"/>
                </svg>
              `
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
