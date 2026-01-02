import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export const FogOfWarOverlay = ({
  enabled,
  revealedMask,
  isDMView,
  isDrawing,
  brushSize,
  mapDimensions,
  onMaskUpdate,
}) => {
  const map = useMap();
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const isDrawingRef = useRef(false);
  const updateTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  // Create canvas and overlay when enabled (ONLY ONCE)
  useEffect(() => {
    if (!enabled) {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
      return;
    }

    // ✅ Only create overlay if it doesn't exist
    if (overlayRef.current) {
      console.log("⏭️ Overlay already exists, skipping creation");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = mapDimensions.width;
    canvas.height = mapDimensions.height;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    const bounds = [
      [0, 0],
      [mapDimensions.height, mapDimensions.width],
    ];

    const opacity = isDMView ? 0.5 : 0.99;

    if (!revealedMask) {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      overlayRef.current = L.imageOverlay(canvas.toDataURL(), bounds, {
        opacity: opacity,
        interactive: false,
        className: isDMView ? "fog-dm" : "fog-player",
      }).addTo(map);

      console.log("✅ Fog overlay created with full fog");
    } else {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);

        overlayRef.current = L.imageOverlay(canvas.toDataURL(), bounds, {
          opacity: opacity,
          interactive: false,
          className: isDMView ? "fog-dm" : "fog-player",
        }).addTo(map);

        console.log("✅ Fog overlay created with existing mask");
      };
      img.src = revealedMask;
    }

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [
    enabled,
    mapDimensions.width,
    mapDimensions.height,
    map,
    isDMView,
    // ✅ REMOVED revealedMask from dependencies - this was causing the flash!
  ]);

  // ✅ Disable/Enable map dragging based on fog draw mode
  useEffect(() => {
    if (!isDMView || !enabled) {
      console.log("📍 Ensuring map is draggable (not DM or fog disabled)");
      try {
        if (!map.dragging.enabled()) map.dragging.enable();
        if (!map.scrollWheelZoom.enabled()) map.scrollWheelZoom.enable();
      } catch (e) {
        console.error("Error enabling drag:", e);
      }
      return;
    }

    if (isDrawing) {
      console.log("🎨 FOG REVEAL MODE - Disabling drag");
      try {
        if (map.dragging.enabled()) {
          map.dragging.disable();
          console.log("  ✓ Dragging disabled");
        }
        if (map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.disable();
          console.log("  ✓ Zoom disabled");
        }
        if (map.doubleClickZoom.enabled()) {
          map.doubleClickZoom.disable();
          console.log("  ✓ Double click zoom disabled");
        }
      } catch (e) {
        console.error("Error disabling interactions:", e);
      }
    } else {
      console.log("🗺️ PAN MODE - Enabling drag");
      try {
        if (!map.dragging.enabled()) {
          map.dragging.enable();
          console.log("  ✓ Dragging enabled");
        }
        if (!map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.enable();
          console.log("  ✓ Zoom enabled");
        }
        if (!map.doubleClickZoom.enabled()) {
          map.doubleClickZoom.enable();
          console.log("  ✓ Double click zoom enabled");
        }
      } catch (e) {
        console.error("Error enabling interactions:", e);
      }
    }
  }, [isDMView, enabled, isDrawing, map]);

  // Add cursor style
  useEffect(() => {
    if (!isDMView || !enabled) return;

    const mapContainer = map.getContainer();

    if (isDrawing) {
      mapContainer.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${brushSize}" height="${brushSize}" viewBox="0 0 ${brushSize} ${brushSize}"><circle cx="${
        brushSize / 2
      }" cy="${brushSize / 2}" r="${
        brushSize / 2 - 2
      }" fill="none" stroke="rgba(191,136,60,0.8)" stroke-width="2"/></svg>') ${
        brushSize / 2
      } ${brushSize / 2}, crosshair`;
    } else {
      mapContainer.style.cursor = "grab";
    }

    return () => {
      mapContainer.style.cursor = "";
    };
  }, [isDMView, enabled, isDrawing, brushSize, map]);

  // ✅ IMPROVED: Handle drawing with REAL-TIME updates
  useEffect(() => {
    if (!isDMView || !enabled || !canvasRef.current) return;

    if (!isDrawing) {
      console.log("⏸️ Drawing mode OFF - no draw handlers");
      return;
    }

    console.log("✏️ Setting up draw handlers with real-time updates");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ Function to update overlay in real-time (throttled)
    const updateOverlay = () => {
      const now = Date.now();
      // Throttle updates to every 50ms to prevent too many updates
      if (now - lastUpdateTimeRef.current < 50) {
        return;
      }
      lastUpdateTimeRef.current = now;

      if (overlayRef.current && canvasRef.current) {
        // ✅ Update overlay URL directly - this is instant!
        overlayRef.current.setUrl(canvasRef.current.toDataURL());
      }
    };

    const stopDrawing = () => {
      if (isDrawingRef.current) {
        console.log("🛑 Stopping drawing - final save");
        isDrawingRef.current = false;

        // Final update
        if (overlayRef.current && canvasRef.current) {
          overlayRef.current.setUrl(canvasRef.current.toDataURL());
        }

        // ✅ Save to state only once when done (prevents flash on player screen)
        if (onMaskUpdate && canvasRef.current) {
          onMaskUpdate(canvasRef.current.toDataURL());
        }
      }
    };

    const handleMouseDown = (e) => {
      console.log("🖱️ Mouse DOWN - Starting fog reveal");
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      isDrawingRef.current = true;
      drawOnCanvas(e);
      updateOverlay(); // ✅ Update immediately on click
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      drawOnCanvas(e);
      updateOverlay(); // ✅ Update as you drag (throttled)
    };

    const handleMouseUp = (e) => {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      stopDrawing();
    };

    const drawOnCanvas = (e) => {
      const latLng = e.latlng;

      const x = (latLng.lng / mapDimensions.width) * canvas.width;
      const y =
        canvas.height - (latLng.lat / mapDimensions.height) * canvas.height;

      // Draw directly to canvas
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
    };

    map.on("mousedown", handleMouseDown);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", handleMouseUp);

    const globalMouseUp = () => {
      stopDrawing();
    };

    document.addEventListener("mouseup", globalMouseUp);

    return () => {
      console.log("🧹 Cleaning up draw handlers");
      map.off("mousedown", handleMouseDown);
      map.off("mousemove", handleMouseMove);
      map.off("mouseup", handleMouseUp);
      document.removeEventListener("mouseup", globalMouseUp);

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      isDrawingRef.current = false;
    };
  }, [
    isDMView,
    isDrawing,
    enabled,
    brushSize,
    map,
    mapDimensions,
    onMaskUpdate,
  ]);

  // ✅ IMPROVED: Listen for mask updates from DM (PLAYER ONLY)
  useEffect(() => {
    if (isDMView || !enabled || !overlayRef.current || !canvasRef.current)
      return;

    // Player view: smoothly update when DM changes mask
    if (revealedMask) {
      console.log("🎭 Player: Updating fog from DM's mask");
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d");
        // Clear and redraw canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);

        // ✅ Update overlay URL directly - NO removal/re-add, prevents flash!
        if (overlayRef.current) {
          overlayRef.current.setUrl(canvasRef.current.toDataURL());
          console.log("✓ Player fog updated smoothly");
        }
      };
      img.onerror = () => {
        console.error("❌ Failed to load fog mask image");
      };
      img.src = revealedMask;
    }
  }, [revealedMask, isDMView, enabled]);

  return null;
};
