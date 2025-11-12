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

  // Create and manage the fog overlay
  useEffect(() => {
    if (!enabled) {
      // Remove overlay when disabled
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
      return;
    }

    // Create canvas for fog
    const canvas = document.createElement("canvas");
    canvas.width = mapDimensions.width;
    canvas.height = mapDimensions.height;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    // Initialize with full fog (black)
    if (!revealedMask) {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Load existing mask
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        updateOverlay();
      };
      img.src = revealedMask;
    }

    // Create the image overlay bounds
    const bounds = [
      [0, 0],
      [mapDimensions.height, mapDimensions.width],
    ];

    // Create the overlay with appropriate opacity
    const opacity = isDMView ? 0.4 : 0.95;
    overlayRef.current = L.imageOverlay(canvas.toDataURL(), bounds, {
      opacity: opacity,
      interactive: false,
      className: isDMView ? "fog-dm" : "fog-player",
    }).addTo(map);

    console.log("✅ Fog overlay created:", { enabled, isDMView, opacity });

    // Update overlay helper function
    function updateOverlay() {
      if (overlayRef.current && canvasRef.current) {
        overlayRef.current.setUrl(canvasRef.current.toDataURL());
      }
    }

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
    };
  }, [enabled, mapDimensions, map, isDMView, revealedMask]);

  // Handle drawing (only for DM)
  useEffect(() => {
    if (!isDMView || !isDrawing || !enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleMouseDown = (e) => {
      isDrawingRef.current = true;
      drawOnCanvas(e);
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      drawOnCanvas(e);
    };

    const handleMouseUp = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        // Save the mask
        if (onMaskUpdate && canvasRef.current) {
          onMaskUpdate(canvasRef.current.toDataURL());
        }
      }
    };

    const drawOnCanvas = (e) => {
      const containerPoint = map.mouseEventToContainerPoint(e.originalEvent);
      const latLng = map.containerPointToLatLng(containerPoint);

      // Convert lat/lng to canvas coordinates
      const x = (latLng.lng / mapDimensions.width) * canvas.width;
      const y = (latLng.lat / mapDimensions.height) * canvas.height;

      // Erase fog (reveal area) - use destination-out to create transparency
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();

      // Update the overlay
      if (overlayRef.current) {
        overlayRef.current.setUrl(canvas.toDataURL());
      }
    };

    // Attach event listeners
    map.on("mousedown", handleMouseDown);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", handleMouseUp);
    map.on("mouseout", handleMouseUp); // Stop drawing if mouse leaves map

    console.log("🎨 Drawing mode enabled");

    return () => {
      map.off("mousedown", handleMouseDown);
      map.off("mousemove", handleMouseMove);
      map.off("mouseup", handleMouseUp);
      map.off("mouseout", handleMouseUp);
      console.log("🎨 Drawing mode disabled");
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

  return null;
};
