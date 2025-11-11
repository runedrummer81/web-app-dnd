import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions, currentMap }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(null);
  const lastMapIdRef = useRef(null); // Track map changes

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

  // ✅ Handle map switches - reset view to show entire new map
  useEffect(() => {
    if (!isDMView) return;

    const currentMapId = currentMap?.id || mapState.currentMapId;

    // Detect if we switched to a different map
    if (lastMapIdRef.current !== currentMapId) {
      console.log(`🗺️ Map switched to: ${currentMapId}`);

      const mapWidth = currentMap?.width || 2000;
      const mapHeight = currentMap?.height || 2000;
      const boundsArr = [
        [0, 0],
        [mapHeight, mapWidth],
      ];

      // ✅ Reset zoom limits FIRST before fitting
      map.setMinZoom(-5); // Very low to allow full zoom out
      map.setMaxZoom(8);

      // ✅ Enable all interactions
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

      // ✅ Fit bounds to show entire map with padding
      setTimeout(() => {
        map.fitBounds(boundsArr, {
          animate: false,
          padding: [50, 50],
        });
      }, 50);
    }

    lastMapIdRef.current = currentMapId;
  }, [currentMap, mapState.currentMapId, isDMView, map]);

  // DM window: handle combat map setup and viewport broadcasting
  useEffect(() => {
    if (!isDMView) return;

    const handleUpdate = () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        // If current map is a combat map: force fit and lock
        if (currentMap?.isCombat) {
          const mapWidth = currentMap.width || 2000;
          const mapHeight = currentMap.height || 2000;
          const boundsArr = [
            [0, 0],
            [mapHeight, mapWidth],
          ];

          // Fit the entire combat map
          map.fitBounds(boundsArr, {
            animate: false,
            padding: [0, 0],
          });

          // Get the zoom level that fitBounds calculated
          const fittedZoom = map.getZoom();

          // Lock to this exact zoom for combat
          map.setMinZoom(fittedZoom);
          map.setMaxZoom(fittedZoom);

          // Disable all DM interactions for combat maps
          map.dragging.disable();
          map.scrollWheelZoom.disable();
          map.doubleClickZoom.disable();
          map.touchZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();

          // Broadcast the locked viewport
          const lockedCenter = map.getCenter();
          const lockedBounds = map.getBounds();
          writeViewport(lockedCenter, fittedZoom, lockedBounds);
          return;
        }

        // ✅ Not a combat map - ensure interactions are enabled
        try {
          map.dragging.enable();
          map.scrollWheelZoom.enable();
          map.doubleClickZoom.enable();
          map.touchZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();

          // ✅ Keep generous zoom limits
          map.setMinZoom(-5);
          map.setMaxZoom(8);
        } catch (e) {
          console.error("Error enabling map interactions:", e);
        }

        // Regular world/city map - broadcast current viewport
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        writeViewport(center, zoom, bounds);
      }, 50);
    };

    // Initial setup
    setTimeout(handleUpdate, 100);

    // Listen for map changes
    map.on("moveend", handleUpdate);
    map.on("zoomend", handleUpdate);

    const resizeObserver = new ResizeObserver(handleUpdate);
    resizeObserver.observe(map.getContainer());

    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      map.off("moveend", handleUpdate);
      map.off("zoomend", handleUpdate);
      resizeObserver.disconnect();
    };
  }, [map, isDMView, updateMapState, currentMap]);

  // Player window: match DM viewport and lock everything
  useEffect(() => {
    if (isDMView) return;
    if (!mapState.viewport) return;

    const { center, zoom } = mapState.viewport;

    // Apply the exact viewport from DM
    map.setView(center, zoom, { animate: false });

    // Lock zoom to DM's zoom level
    map.setMinZoom(zoom);
    map.setMaxZoom(zoom);

    // Disable ALL player interactions
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }, [map, isDMView, mapState.viewport]);

  return null;
};
