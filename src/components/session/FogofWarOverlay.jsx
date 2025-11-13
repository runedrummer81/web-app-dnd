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

  // Create canvas and overlay when enabled
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

    const canvas = document.createElement("canvas");
    canvas.width = mapDimensions.width;
    canvas.height = mapDimensions.height;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    const bounds = [
      [0, 0],
      [mapDimensions.height, mapDimensions.width],
    ];

    const opacity = isDMView ? 0.4 : 0.99;

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
    revealedMask,
  ]);

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
      mapContainer.style.cursor = "";
    }

    return () => {
      mapContainer.style.cursor = "";
    };
  }, [isDMView, enabled, isDrawing, brushSize, map]);

  // Handle drawing
  useEffect(() => {
    if (!isDMView || !isDrawing || !enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const stopDrawing = () => {
      if (isDrawingRef.current) {
        console.log("🛑 Stopping drawing - updating overlay");
        isDrawingRef.current = false;

        // ONLY update overlay when drawing stops
        if (overlayRef.current && canvasRef.current) {
          overlayRef.current.setUrl(canvasRef.current.toDataURL());
        }

        // Save to state
        if (onMaskUpdate && canvasRef.current) {
          onMaskUpdate(canvasRef.current.toDataURL());
        }
      }
    };

    const handleMouseDown = (e) => {
      console.log("🖱️ Mouse DOWN");
      isDrawingRef.current = true;
      drawOnCanvas(e);
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      drawOnCanvas(e);
    };

    const drawOnCanvas = (e) => {
      const latLng = e.latlng;

      const x = (latLng.lng / mapDimensions.width) * canvas.width;
      const y =
        canvas.height - (latLng.lat / mapDimensions.height) * canvas.height;

      // Draw directly to canvas - NO overlay update yet
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();

      // DON'T update overlay here - wait for mouseup
    };

    map.on("mousedown", handleMouseDown);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", stopDrawing);

    const globalMouseUp = () => {
      stopDrawing();
    };

    document.addEventListener("mouseup", globalMouseUp);

    console.log("🎨 Drawing mode enabled");

    return () => {
      map.off("mousedown", handleMouseDown);
      map.off("mousemove", handleMouseMove);
      map.off("mouseup", stopDrawing);
      document.removeEventListener("mouseup", globalMouseUp);

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      isDrawingRef.current = false;

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
