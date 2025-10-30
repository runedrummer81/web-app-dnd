import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions, currentMap }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(null);

  // Helper to write viewport to shared state (rounded)
  const writeViewport = (center, zoom, bounds) => {
    const newData = {
      centerLat: Math.round(center.lat * 100) / 100,
      centerLng: Math.round(center.lng * 100) / 100,
      zoom: Math.round(zoom * 10) / 10,
      width: map.getContainer().offsetWidth,
      height: map.getContainer().offsetHeight,
    };

    // only update when different
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

  // DM window: send center, zoom, bounds AND handle combat-map locking
  useEffect(() => {
    if (!isDMView) return;

    const handleUpdate = () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();

        // If current map is a combat map: force fitBounds and lock
        if (currentMap?.isCombat) {
          const boundsArr = [
            [0, 0],
            [currentMap.height || 2000, currentMap.width || 2000],
          ];
          // Fit entire combat image
          map.fitBounds(boundsArr, { animate: false, padding: [0, 0] });
          // Immediately lock zoom to current zoom level
          const lockedZoom = map.getZoom();
          map.setMinZoom(lockedZoom);
          map.setMaxZoom(lockedZoom);
          // Disable interaction on DM too (so DM cannot accidentally pan/zoom)
          map.dragging.disable();
          map.scrollWheelZoom.disable();
          map.doubleClickZoom.disable();
          map.touchZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();

          // update viewport with forced values
          const forcedCenter = map.getCenter();
          const forcedZoom = map.getZoom();
          const forcedBounds = map.getBounds();
          writeViewport(forcedCenter, forcedZoom, forcedBounds);
          return;
        }

        // Not a combat map: ensure interactions enabled (DM interactive)
        try {
          map.dragging.enable();
          map.scrollWheelZoom.enable();
          map.doubleClickZoom.enable();
          map.touchZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
          // reset min/max zoom to defaults (allow freedom)
          map.setMinZoom(0);
          map.setMaxZoom(8);
        } catch (e) {
          // map might not support some features (no-op)
        }

        // Round values and write
        writeViewport(center, zoom, bounds);
      }, 50);
    };

    // initial update after mount
    setTimeout(handleUpdate, 100);

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

  // Player window: match DM viewport and lock if combat map
  useEffect(() => {
    if (isDMView) return;
    if (!mapState.viewport) return;

    const { center, zoom } = mapState.viewport;

    // Apply center & zoom (no animation)
    map.setView(center, zoom, { animate: false });

    // If current map is combat, also lock zoom & interactions
    if (currentMap?.isCombat) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();

      // lock zoom exactly to the DM's zoom
      map.setMinZoom(zoom);
      map.setMaxZoom(zoom);
    } else {
      // non-combat: ensure player still cannot interact
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();

      // but don't clamp zoom so if you change DM viewport it reflects naturally
      map.setMinZoom(0);
      map.setMaxZoom(8);
    }
  }, [map, isDMView, mapState.viewport, currentMap]);

  return null;
};
