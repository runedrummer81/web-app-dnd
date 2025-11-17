import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions, currentMap }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(null);
  const lastMapIdRef = useRef(null);
  const lastIsCombatRef = useRef(false);

  // Helper to write viewport to shared state (rounded)
  const writeViewport = (center, zoom, bounds) => {
    const newData = {
      centerLat: Math.round(center.lat * 100) / 100,
      centerLng: Math.round(center.lng * 100) / 100,
      zoom: Math.round(zoom * 10) / 10,
      width: map.getContainer().offsetWidth,
      height: map.getContainer().offsetHeight,
    };

    const hasChanged =
      !lastUpdateRef.current ||
      lastUpdateRef.current.centerLat !== newData.centerLat ||
      lastUpdateRef.current.centerLng !== newData.centerLng ||
      lastUpdateRef.current.zoom !== newData.zoom ||
      lastUpdateRef.current.width !== newData.width ||
      lastUpdateRef.current.height !== newData.height;

    if (hasChanged) {
      lastUpdateRef.current = newData;
      updateMapState({
        viewport: {
          center: [newData.centerLat, newData.centerLng],
          zoom: newData.zoom,
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
        },
        dmContainerSize: {
          width: newData.width,
          height: newData.height,
        },
      });
    }
  };

  // ✅ Calculate optimal zoom for combat maps
  const calculateCombatZoom = (
    mapWidth,
    mapHeight,
    containerWidth,
    containerHeight
  ) => {
    // Calculate zoom needed to fit width
    const zoomForWidth = Math.log2(containerWidth / mapWidth);
    // Calculate zoom needed to fit height
    const zoomForHeight = Math.log2(containerHeight / mapHeight);

    // Use the smaller zoom (ensures entire map fits)
    const calculatedZoom = Math.min(zoomForWidth, zoomForHeight);

    // Ensure zoom is at least 0 for combat maps
    const finalZoom = Math.max(0, calculatedZoom);

    console.log(`📊 Combat zoom calculation:`, {
      mapWidth,
      mapHeight,
      containerWidth,
      containerHeight,
      zoomForWidth,
      zoomForHeight,
      calculatedZoom,
      finalZoom,
    });

    return finalZoom;
  };

  // ✅ SINGLE EFFECT: Handle all map changes and updates
  useEffect(() => {
    if (!isDMView) return;

    const currentMapId = currentMap?.id || mapState.currentMapId;
    const isCombat = currentMap?.isCombat || false;
    const mapChanged = lastMapIdRef.current !== currentMapId;

    console.log("🗺️ MapController state:", {
      currentMapId,
      isCombat,
      mapChanged,
      width: currentMap?.width,
      height: currentMap?.height,
    });

    // ✅ COMBAT MAP LOGIC
    if (isCombat) {
      console.log("⚔️ COMBAT MAP - Fitting to screen and locking");

      const mapWidth = currentMap.width || 2000;
      const mapHeight = currentMap.height || 2000;
      const containerWidth = map.getContainer().offsetWidth;
      const containerHeight = map.getContainer().offsetHeight;

      // Calculate center of map
      const centerLat = mapHeight / 2;
      const centerLng = mapWidth / 2;

      // ✅ Calculate proper zoom level
      const optimalZoom = calculateCombatZoom(
        mapWidth,
        mapHeight,
        containerWidth,
        containerHeight
      );

      console.log(
        `🎯 Setting combat map center: [${centerLat}, ${centerLng}], zoom: ${optimalZoom}`
      );

      // Set view with calculated zoom
      map.setView([centerLat, centerLng], optimalZoom, { animate: false });

      // Wait a tick, then lock everything
      setTimeout(() => {
        const currentZoom = map.getZoom();
        console.log(`🔒 Locking combat map at zoom: ${currentZoom}`);

        // Lock zoom to current level
        map.setMinZoom(currentZoom);
        map.setMaxZoom(currentZoom);

        // Disable all interactions
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        map.touchZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();

        // Broadcast locked viewport
        const lockedCenter = map.getCenter();
        const lockedBounds = map.getBounds();
        writeViewport(lockedCenter, currentZoom, lockedBounds);
      }, 100);

      lastMapIdRef.current = currentMapId;
      lastIsCombatRef.current = isCombat;
      return;
    }

    // ✅ NON-COMBAT MAP LOGIC
    if (mapChanged && !isCombat) {
      console.log(`🌍 Non-combat map switched to: ${currentMapId}`);

      const mapWidth = currentMap?.width || 2000;
      const mapHeight = currentMap?.height || 2000;
      const boundsArr = [
        [0, 0],
        [mapHeight, mapWidth],
      ];

      // Reset zoom limits for free navigation
      map.setMinZoom(-5);
      map.setMaxZoom(8);

      // Enable all interactions
      try {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.touchZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
      } catch (e) {
        console.error("Error enabling interactions:", e);
      }

      // Fit bounds with padding
      map.fitBounds(boundsArr, {
        animate: false,
        padding: [50, 50],
      });

      // Broadcast new viewport
      setTimeout(() => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        writeViewport(center, zoom, bounds);
      }, 100);
    }

    // Handle viewport updates for non-combat maps
    const handleViewportUpdate = () => {
      if (!isCombat) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        writeViewport(center, zoom, bounds);
      }
    };

    map.on("moveend", handleViewportUpdate);
    map.on("zoomend", handleViewportUpdate);

    lastMapIdRef.current = currentMapId;
    lastIsCombatRef.current = isCombat;

    return () => {
      map.off("moveend", handleViewportUpdate);
      map.off("zoomend", handleViewportUpdate);
    };
  }, [map, isDMView, updateMapState, currentMap, mapState.currentMapId]);

  // ✅ Player window: match DM viewport exactly
  useEffect(() => {
    if (isDMView) return;
    if (!mapState.viewport) return;

    const { center, zoom } = mapState.viewport;

    // Apply exact viewport from DM
    map.setView(center, zoom, { animate: false });

    // Lock to DM's zoom
    map.setMinZoom(zoom);
    map.setMaxZoom(zoom);

    // Disable all interactions
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }, [map, isDMView, mapState.viewport]);

  return null;
};
