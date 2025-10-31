// src/components/RunSession/SpellEffectOverlay.jsx
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";
import L from "leaflet";

export const SpellEffectOverlay = ({
  effects,
  onEffectMove,
  onEffectResize,
  onEffectRemove,
  isDMView,
}) => {
  const map = useMap();
  const { mapState, updateMapState } = useMapSync();

  // Handle preview confirmation
  const handleConfirmPreview = () => {
    if (!mapState.spellEffectPreview) return;

    console.log("✅ Confirming spell placement");

    const newEffect = {
      ...mapState.spellEffectPreview,
      id: `spell-${Date.now()}`,
      isPreview: false,
    };

    updateMapState({
      spellEffects: [...(effects || []), newEffect],
      spellEffectPreview: null,
    });
  };

  const handleCancelPreview = () => {
    console.log("❌ Canceling spell placement");
    updateMapState({
      spellEffectPreview: null,
    });
  };

  console.log("🗺️ Rendering effects:", effects);
  console.log("👁️ Preview:", mapState.spellEffectPreview);

  return (
    <>
      {/* Render permanent effects */}
      {effects &&
        effects.map((effect) => (
          <SpellEffect
            key={effect.id}
            effect={effect}
            map={map}
            onMove={onEffectMove}
            onResize={onEffectResize}
            onRemove={onEffectRemove}
            isDMView={isDMView}
            isPreview={false}
          />
        ))}

      {/* Render preview effect */}
      {mapState.spellEffectPreview && (
        <SpellEffect
          key={mapState.spellEffectPreview.id}
          effect={mapState.spellEffectPreview}
          map={map}
          onMove={(id, position) => {
            updateMapState({
              spellEffectPreview: { ...mapState.spellEffectPreview, position },
            });
          }}
          onResize={(id, radius) => {
            updateMapState({
              spellEffectPreview: { ...mapState.spellEffectPreview, radius },
            });
          }}
          onRemove={handleCancelPreview}
          onConfirm={handleConfirmPreview}
          isDMView={isDMView}
          isPreview={true}
        />
      )}
    </>
  );
};

const SpellEffect = ({
  effect,
  map,
  onMove,
  onResize,
  onRemove,
  onConfirm,
  isDMView,
  isPreview,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!map || !effect.position) {
      console.log("❌ Missing map or position", {
        map: !!map,
        position: effect.position,
      });
      return;
    }

    console.log("🎨 Rendering spell effect:", effect);

    // Create the container
    const container = L.DomUtil.create("div", "spell-effect-overlay");
    container.style.position = "absolute";
    container.style.pointerEvents = isDMView ? "auto" : "none";
    container.style.zIndex = "400";
    containerRef.current = container;

    // Create video element - NO BLACK BACKGROUND!
    const video = document.createElement("video");
    video.src = effect.effectURL;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.borderRadius = "50%";
    video.style.opacity = "1";
    video.style.mixBlendMode = "add"; // ← BEST for removing black
    video.style.filter = "brightness(1.2) contrast(1.3)";

    video.onerror = (e) => {
      console.error("❌ Video failed to load:", effect.effectURL, e);
    };

    video.onloadeddata = () => {
      console.log("✅ Video loaded successfully:", effect.effectURL);
    };

    container.appendChild(video);

    // Circle border overlay
    const border = L.DomUtil.create("div", "spell-border");
    border.style.position = "absolute";
    border.style.inset = "0";
    border.style.borderRadius = "50%";
    border.style.border = `3px solid ${effect.color}`;
    border.style.boxShadow = `0 0 20px ${effect.color}, inset 0 0 20px ${effect.color}40`;
    border.style.opacity = isPreview ? "0.8" : "0.6";
    border.style.pointerEvents = "none";
    container.appendChild(border);

    // Preview pulsing effect
    if (isPreview) {
      border.style.animation = "pulse 1.5s ease-in-out infinite";
      const style = document.createElement("style");
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }

    // DM controls
    if (isDMView) {
      // Drag handle
      const dragHandle = L.DomUtil.create("div", "spell-drag-handle");
      dragHandle.style.position = "absolute";
      dragHandle.style.top = "50%";
      dragHandle.style.left = "50%";
      dragHandle.style.transform = "translate(-50%, -50%)";
      dragHandle.style.width = "30px";
      dragHandle.style.height = "30px";
      dragHandle.style.background = "rgba(0,0,0,0.7)";
      dragHandle.style.border = "2px solid white";
      dragHandle.style.borderRadius = "50%";
      dragHandle.style.cursor = "move";
      dragHandle.style.display = "flex";
      dragHandle.style.alignItems = "center";
      dragHandle.style.justifyContent = "center";
      dragHandle.style.zIndex = "10";
      dragHandle.innerHTML = "⊕";
      dragHandle.style.color = "white";
      dragHandle.style.fontSize = "20px";

      L.DomEvent.on(dragHandle, "mousedown", (e) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);

        const handleMouseMove = (moveEvent) => {
          const point = map.mouseEventToLatLng(moveEvent);
          onMove(effect.id, [point.lat, point.lng]);
        };

        const handleMouseUp = () => {
          L.DomEvent.off(document, "mousemove", handleMouseMove);
          L.DomEvent.off(document, "mouseup", handleMouseUp);
        };

        L.DomEvent.on(document, "mousemove", handleMouseMove);
        L.DomEvent.on(document, "mouseup", handleMouseUp);
      });

      container.appendChild(dragHandle);

      // Resize handle
      const resizeHandle = L.DomUtil.create("div", "spell-resize-handle");
      resizeHandle.style.position = "absolute";
      resizeHandle.style.bottom = "5px";
      resizeHandle.style.right = "5px";
      resizeHandle.style.width = "24px";
      resizeHandle.style.height = "24px";
      resizeHandle.style.background = "#3B82F6";
      resizeHandle.style.border = "2px solid white";
      resizeHandle.style.borderRadius = "50%";
      resizeHandle.style.cursor = "nwse-resize";
      resizeHandle.style.zIndex = "10";

      L.DomEvent.on(resizeHandle, "mousedown", (e) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);

        const startRadius = effect.radius;
        const startX = e.clientX;

        const handleMouseMove = (moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const newRadius = Math.max(40, startRadius + deltaX);
          onResize(effect.id, newRadius);
        };

        const handleMouseUp = () => {
          L.DomEvent.off(document, "mousemove", handleMouseMove);
          L.DomEvent.off(document, "mouseup", handleMouseUp);
        };

        L.DomEvent.on(document, "mousemove", handleMouseMove);
        L.DomEvent.on(document, "mouseup", handleMouseUp);
      });

      container.appendChild(resizeHandle);

      // PREVIEW MODE - Show confirm/cancel buttons
      if (isPreview) {
        const buttonContainer = L.DomUtil.create(
          "div",
          "spell-preview-buttons"
        );
        buttonContainer.style.position = "absolute";
        buttonContainer.style.bottom = "-60px";
        buttonContainer.style.left = "50%";
        buttonContainer.style.transform = "translateX(-50%)";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "8px";
        buttonContainer.style.zIndex = "20";

        // Confirm button
        const confirmBtn = L.DomUtil.create("button", "");
        confirmBtn.textContent = "✓ Place";
        confirmBtn.style.padding = "8px 16px";
        confirmBtn.style.background = "#10B981";
        confirmBtn.style.color = "white";
        confirmBtn.style.border = "2px solid white";
        confirmBtn.style.borderRadius = "4px";
        confirmBtn.style.cursor = "pointer";
        confirmBtn.style.fontWeight = "bold";
        confirmBtn.style.fontSize = "14px";

        L.DomEvent.on(confirmBtn, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          onConfirm();
        });

        // Cancel button
        const cancelBtn = L.DomUtil.create("button", "");
        cancelBtn.textContent = "✕ Cancel";
        cancelBtn.style.padding = "8px 16px";
        cancelBtn.style.background = "#EF4444";
        cancelBtn.style.color = "white";
        cancelBtn.style.border = "2px solid white";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.style.fontWeight = "bold";
        cancelBtn.style.fontSize = "14px";

        L.DomEvent.on(cancelBtn, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          onRemove();
        });

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        container.appendChild(buttonContainer);
      } else {
        // PERMANENT MODE - Show remove button
        const removeBtn = L.DomUtil.create("button", "spell-remove-btn");
        removeBtn.style.position = "absolute";
        removeBtn.style.top = "-5px";
        removeBtn.style.right = "-5px";
        removeBtn.style.width = "24px";
        removeBtn.style.height = "24px";
        removeBtn.style.background = "#EF4444";
        removeBtn.style.border = "2px solid white";
        removeBtn.style.borderRadius = "50%";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.zIndex = "10";
        removeBtn.style.color = "white";
        removeBtn.style.fontSize = "14px";
        removeBtn.style.fontWeight = "bold";
        removeBtn.innerHTML = "×";

        L.DomEvent.on(removeBtn, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          onRemove(effect.id);
        });

        container.appendChild(removeBtn);
      }

      // Label
      const label = L.DomUtil.create("div", "spell-label");
      label.style.position = "absolute";
      label.style.top = "-30px";
      label.style.left = "50%";
      label.style.transform = "translateX(-50%)";
      label.style.background = "rgba(0,0,0,0.8)";
      label.style.color = "white";
      label.style.padding = "4px 8px";
      label.style.borderRadius = "4px";
      label.style.fontSize = "12px";
      label.style.whiteSpace = "nowrap";
      label.textContent = isPreview ? `Preview: ${effect.name}` : effect.name;
      container.appendChild(label);
    }

    // Position update function
    const updatePosition = () => {
      const point = map.latLngToLayerPoint(effect.position);
      const size = effect.radius * 2;
      container.style.left = `${point.x - size / 2}px`;
      container.style.top = `${point.y - size / 2}px`;
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
    };

    // Add to map
    map.getPane("overlayPane").appendChild(container);
    updatePosition();

    // Update on map events
    map.on("zoom viewreset move", updatePosition);

    return () => {
      map.off("zoom viewreset move", updatePosition);
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [map, effect, isDMView, isPreview, onMove, onResize, onRemove, onConfirm]);

  return null;
};
