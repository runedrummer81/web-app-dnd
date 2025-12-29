// UPDATED TokenOverlay.jsx - Remove the removeToken event listener entirely
// Since we're doing batch updates, we don't need individual removal events

// FIND THIS SECTION IN YOUR TokenOverlay.jsx:
// useEffect(() => {
//   const handleRemoveToken = (event) => {
//     ...
//   };
//   window.addEventListener("removeToken", handleRemoveToken);
//   ...
// }, [...]);

// AND REPLACE IT WITH:

// REMOVED: No longer listening for removeToken events
// Token removal is now handled by batch updates in mapState
// The InitiativeTracker directly updates mapState.tokens

// That's it! By removing this event listener, we eliminate the race condition
// The tokens will be removed directly through Firebase sync

// ============================================
// FULL UPDATED TokenOverlay.jsx
// ============================================

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";
import L from "leaflet";

export const TokenOverlay = ({ tokens, onTokenMove, isDMView }) => {
  const map = useMap();
  const { mapState, updateMapState } = useMapSync();
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [placementMode, setPlacementMode] = useState(null);
  const [placementPositions, setPlacementPositions] = useState([]);

  // Get initiative order from mapState
  const initiativeOrder = mapState.initiativeOrder || [];
  const currentTurnIndex = mapState.currentTurnIndex || 0;
  const currentCombatant = initiativeOrder[currentTurnIndex];

  // Listen for addToken events - sync directly to mapState (Firebase)
  useEffect(() => {
    const handleAddToken = (event) => {
      const { id, name, x, y, imageUrl, isPlayer } = event.detail;

      console.log("TokenOverlay received addToken event:", event.detail);

      const newToken = {
        id,
        name,
        position: [y, x],
        imageUrl,
        isPlayer: isPlayer || false,
        size: 60,
      };

      const currentTokens = mapState.tokens || [];
      console.log("Current tokens:", currentTokens.length, "Adding:", name);

      updateMapState({
        tokens: [...currentTokens, newToken],
      });

      console.log("Token synced to mapState");
    };

    window.addEventListener("addToken", handleAddToken);

    return () => {
      window.removeEventListener("addToken", handleAddToken);
    };
  }, [mapState.tokens, updateMapState]);

  // Handle summon placement mode
  useEffect(() => {
    const handleEnterPlacementMode = (event) => {
      console.log("Entering placement mode:", event.detail);
      setPlacementMode(event.detail);
      setPlacementPositions([]);
    };

    const handleCancelPlacement = () => {
      console.log("Cancelled placement mode");
      setPlacementMode(null);
      setPlacementPositions([]);
    };

    window.addEventListener(
      "enterSummonPlacementMode",
      handleEnterPlacementMode
    );
    window.addEventListener("cancelSummonPlacement", handleCancelPlacement);

    return () => {
      window.removeEventListener(
        "enterSummonPlacementMode",
        handleEnterPlacementMode
      );
      window.removeEventListener(
        "cancelSummonPlacement",
        handleCancelPlacement
      );
    };
  }, []);

  // Handle map clicks during placement mode
  useEffect(() => {
    if (!map || !placementMode) return;

    const placementMarkers = [];

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const newPositions = [...placementPositions, { lat, lng }];

      console.log(`Placed ${newPositions.length}/${placementMode.quantity}`);

      // Create visual marker at click location
      const marker = L.DomUtil.create("div", "placement-marker");
      marker.style.cssText = `
        position: absolute;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.1) 70%, transparent 100%);
        border: 3px solid #a855f7;
        border-radius: 50%;
        pointer-events: none;
        z-index: 499;
        animation: pulse 1s infinite;
      `;

      const numberLabel = L.DomUtil.create("div", "placement-number");
      numberLabel.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #e9d5ff;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(147, 51, 234, 0.8);
      `;
      numberLabel.textContent = newPositions.length;
      marker.appendChild(numberLabel);

      const updateMarkerPosition = () => {
        const point = map.latLngToLayerPoint([lat, lng]);
        marker.style.left = `${point.x - 30}px`;
        marker.style.top = `${point.y - 30}px`;
      };

      map.getPane("overlayPane").appendChild(marker);
      placementMarkers.push(marker);
      updateMarkerPosition();
      map.on("zoom viewreset move", updateMarkerPosition);

      setPlacementPositions(newPositions);

      window.dispatchEvent(
        new CustomEvent("summonPlacementUpdate", {
          detail: { placedCount: newPositions.length },
        })
      );

      if (newPositions.length === placementMode.quantity) {
        console.log("All positions placed, spawning creatures");

        setTimeout(() => {
          const newTokens = [];

          newPositions.forEach((pos, i) => {
            const timestamp = Date.now() + i * 10;
            const summonId = `${placementMode.creature.name}-${timestamp}`;
            const summonName =
              placementMode.quantity > 1
                ? `${placementMode.creature.name} ${i + 1}`
                : placementMode.creature.name;

            newTokens.push({
              id: summonId,
              name: summonName,
              position: [pos.lat, pos.lng],
              imageUrl: placementMode.creature.imageUrl,
              isPlayer: false,
              size: 60,
            });

            window.dispatchEvent(
              new CustomEvent("summonTokenCreated", {
                detail: {
                  id: summonId,
                  name: summonName,
                  summonedBy: placementMode.playerName,
                },
              })
            );
          });

          const currentTokens = mapState.tokens || [];
          console.log(`Adding ${newTokens.length} tokens in batch`);

          updateMapState({
            tokens: [...currentTokens, ...newTokens],
          });

          // Add spawn effects
          const currentEffects = mapState.summonEffects || [];
          const newEffects = newTokens.map((token, i) => ({
            id: `spawn-${token.id}`,
            type: "spawn",
            position: token.position,
            name: token.name,
            timestamp: Date.now() + i * 200,
          }));

          updateMapState({
            summonEffects: [...currentEffects, ...newEffects],
          });

          placementMarkers.forEach((m) => {
            if (m.parentNode) {
              m.parentNode.removeChild(m);
            }
          });

          window.dispatchEvent(new CustomEvent("summonPlacementComplete"));

          setPlacementMode(null);
          setPlacementPositions([]);
        }, 300);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      placementMarkers.forEach((m) => {
        if (m.parentNode) {
          m.parentNode.removeChild(m);
        }
      });
    };
  }, [
    map,
    placementMode,
    placementPositions,
    mapState.tokens,
    mapState.summonEffects,
    updateMapState,
  ]);

  // REMOVED: No longer listening for removeToken events
  // Token removal now handled by direct mapState updates in InitiativeTracker

  // Use tokens from mapState (synced via Firebase)
  const allTokens = mapState.tokens || [];

  console.log("Rendering tokens:", allTokens.length);

  // Close controls when clicking outside
  useEffect(() => {
    const handleMapClick = (e) => {
      if (!e.originalEvent?.target.closest(".token-overlay")) {
        setSelectedTokenId(null);
      }
    };

    if (map) {
      map.on("click", handleMapClick);
    }

    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [map]);

  const isTokenActiveTurn = (token) => {
    if (!currentCombatant) return false;
    return token.name === currentCombatant.name;
  };

  const isTokenDead = (token) => {
    const combatant = initiativeOrder.find((c) => c.name === token.name);
    return combatant?.isDead || false;
  };

  const handleTokenResize = (tokenId, newSize) => {
    if (!onTokenMove) return;
    const token = allTokens.find((t) => t.id === tokenId);
    if (!token) return;
    onTokenMove(tokenId, token.position, newSize);
  };

  return (
    <>
      {allTokens.map((token) => {
        const isActiveTurn = isTokenActiveTurn(token);
        const isDead = isTokenDead(token);
        const isSelected = selectedTokenId === token.id;

        return (
          <Token
            key={token.id}
            token={token}
            map={map}
            onMove={onTokenMove}
            onResize={handleTokenResize}
            isDMView={isDMView}
            isActiveTurn={isActiveTurn}
            isDead={isDead}
            isSelected={isSelected}
            onSelect={() => setSelectedTokenId(token.id)}
          />
        );
      })}
    </>
  );
};

// Token component remains the same...
const Token = ({
  token,
  map,
  onMove,
  onResize,
  isDMView,
  isActiveTurn,
  isDead,
  isSelected,
  onSelect,
}) => {
  const containerRef = useRef(null);
  const tokenSize = token.size || 60;
  const borderColor = token.isPlayer ? "#4ade80" : "#ef4444";
  const firstLetter = token.name ? token.name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    if (!map || !token.position) return;

    const container = L.DomUtil.create("div", "token-overlay");
    container.style.position = "absolute";
    container.style.pointerEvents = isDMView && !isDead ? "auto" : "none";
    container.style.zIndex = "500";
    container.style.cursor = isDMView && !isDead ? "pointer" : "default";
    containerRef.current = container;

    if (isDMView && !isDead) {
      L.DomEvent.on(container, "click", (e) => {
        L.DomEvent.stopPropagation(e);
        onSelect();

        const event = new CustomEvent("tokenClicked", {
          detail: { token },
        });
        window.dispatchEvent(event);
      });
    }

    const tokenVisual = L.DomUtil.create("div", "token-visual");
    tokenVisual.style.width = "100%";
    tokenVisual.style.height = "100%";
    tokenVisual.style.borderRadius = "50%";
    tokenVisual.style.border = `3px solid ${isDead ? "#666" : borderColor}`;
    tokenVisual.style.overflow = "hidden";
    tokenVisual.style.background = isDead
      ? "#333"
      : token.isPlayer
      ? "linear-gradient(135deg, #BF883C 0%, #8B6914 100%)"
      : "black";
    tokenVisual.style.boxShadow = isDead
      ? "0 0 10px rgba(0,0,0,0.5)"
      : isActiveTurn
      ? `0 0 20px 8px ${borderColor}, 0 0 40px 12px ${borderColor}80`
      : token.isPlayer
      ? "0 0 20px rgba(191, 136, 60, 0.8), inset 0 2px 10px rgba(255,255,255,0.2)"
      : "0 0 10px rgba(0,0,0,0.5)";
    tokenVisual.style.transition = "box-shadow 0.3s ease";
    tokenVisual.style.opacity = isDead ? "0.6" : "1";
    tokenVisual.style.display = "flex";
    tokenVisual.style.alignItems = "center";
    tokenVisual.style.justifyContent = "center";
    tokenVisual.style.position = "relative";
    tokenVisual.style.pointerEvents = "none";

    if (isDead) {
      tokenVisual.innerHTML = '<div style="font-size: 40px;">DEAD</div>';
    } else if (token.isPlayer) {
      tokenVisual.innerHTML = `
        <div style="position: absolute; width: ${tokenSize - 10}px; height: ${
        tokenSize - 10
      }px; border: 2px solid rgba(217, 202, 137, 0.4); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
        <div style="font-family: 'EB Garamond', serif; font-size: ${
          tokenSize * 0.5
        }px; font-weight: bold; color: #FFF; text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(217,202,137,0.6); z-index: 2; user-select: none;">${firstLetter}</div>
        <svg style="position: absolute; width: 100%; height: 100%; opacity: 0.3;" viewBox="0 0 100 100">
          <path d="M 50 10 L 48 15 L 52 15 Z" fill="#d9ca89"/>
          <path d="M 90 50 L 85 48 L 85 52 Z" fill="#d9ca89"/>
          <path d="M 50 90 L 48 85 L 52 85 Z" fill="#d9ca89"/>
          <path d="M 10 50 L 15 48 L 15 52 Z" fill="#d9ca89"/>
        </svg>
      `;
    } else if (token.imageUrl) {
      const img = document.createElement("img");
      img.src = token.imageUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      tokenVisual.appendChild(img);
    }

    container.appendChild(tokenVisual);

    if (isDMView && isSelected && !isDead) {
      const dragHandle = L.DomUtil.create("div", "token-drag-handle");
      dragHandle.style.cssText =
        "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; background: rgba(0,0,0,0.7); border: 2px solid white; border-radius: 50%; cursor: move; display: flex; align-items: center; justify-content: center; z-index: 10; color: white; font-size: 20px;";
      dragHandle.innerHTML = "⊕";

      L.DomEvent.on(dragHandle, "mousedown", (e) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);

        const handleMouseMove = (moveEvent) => {
          const point = map.mouseEventToLatLng(moveEvent);
          onMove(token.id, [point.lat, point.lng], token.size);
        };

        const handleMouseUp = () => {
          L.DomEvent.off(document, "mousemove", handleMouseMove);
          L.DomEvent.off(document, "mouseup", handleMouseUp);
        };

        L.DomEvent.on(document, "mousemove", handleMouseMove);
        L.DomEvent.on(document, "mouseup", handleMouseUp);
      });

      container.appendChild(dragHandle);

      const resizeHandle = L.DomUtil.create("div", "token-resize-handle");
      resizeHandle.style.cssText =
        "position: absolute; bottom: 5px; right: 5px; width: 24px; height: 24px; background: #3B82F6; border: 2px solid white; border-radius: 50%; cursor: nwse-resize; z-index: 10;";

      L.DomEvent.on(resizeHandle, "mousedown", (e) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);

        const startSize = token.size || 60;
        const startX = e.clientX;

        const handleMouseMove = (moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const newSize = Math.max(40, Math.min(300, startSize + deltaX));
          onResize(token.id, newSize);
        };

        const handleMouseUp = () => {
          L.DomEvent.off(document, "mousemove", handleMouseMove);
          L.DomEvent.off(document, "mouseup", handleMouseUp);
        };

        L.DomEvent.on(document, "mousemove", handleMouseMove);
        L.DomEvent.on(document, "mouseup", handleMouseUp);
      });

      container.appendChild(resizeHandle);

      const label = L.DomUtil.create("div", "token-label");
      label.style.cssText = `position: absolute; top: -30px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; border: 1px solid ${borderColor};`;
      label.textContent = token.name;
      container.appendChild(label);
    }

    const updatePosition = () => {
      const point = map.latLngToLayerPoint(token.position);
      container.style.left = `${point.x - tokenSize / 2}px`;
      container.style.top = `${point.y - tokenSize / 2}px`;
      container.style.width = `${tokenSize}px`;
      container.style.height = `${tokenSize}px`;
    };

    map.getPane("overlayPane").appendChild(container);
    updatePosition();
    map.on("zoom viewreset move", updatePosition);

    return () => {
      map.off("zoom viewreset move", updatePosition);
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [
    map,
    token,
    isDMView,
    isActiveTurn,
    isDead,
    isSelected,
    onMove,
    onResize,
    onSelect,
    tokenSize,
    borderColor,
    firstLetter,
  ]);

  return null;
};
