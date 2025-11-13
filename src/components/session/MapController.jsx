import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions, currentMap }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(null);
  const lastMapIdRef = useRef(null);

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

  useEffect(() => {
    if (!isDMView) return;

    const currentMapId = currentMap?.id || mapState.currentMapId;

    if (lastMapIdRef.current !== currentMapId) {
      console.log(`🗺️ Map switched to: ${currentMapId}`);

      const mapWidth = currentMap?.width || 2000;
      const mapHeight = currentMap?.height || 2000;
      const boundsArr = [
        [0, 0],
        [mapHeight, mapWidth],
      ];

      map.setMinZoom(-5);
      map.setMaxZoom(8);

      // Only enable if not drawing fog
      const isFogDrawing =
        mapState.fogOfWar?.isDrawing && mapState.fogOfWar?.enabled;
      if (!isFogDrawing) {
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
      }

      setTimeout(() => {
        map.fitBounds(boundsArr, {
          animate: false,
          padding: [50, 50],
        });
      }, 50);
    }

    lastMapIdRef.current = currentMapId;
  }, [
    currentMap,
    mapState.currentMapId,
    mapState.fogOfWar?.isDrawing,
    mapState.fogOfWar?.enabled,
    isDMView,
    map,
  ]);

  // Control map dragging based on fog drawing state
  useEffect(() => {
    if (!isDMView) return;

    const fogDrawing =
      mapState.fogOfWar?.isDrawing && mapState.fogOfWar?.enabled;

    if (fogDrawing) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      console.log("🎨 Map interactions DISABLED for fog drawing");
    } else if (!currentMap?.isCombat) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      console.log("✅ Map interactions ENABLED");
    }
  }, [
    mapState.fogOfWar?.isDrawing,
    mapState.fogOfWar?.enabled,
    isDMView,
    map,
    currentMap?.isCombat,
  ]);

  useEffect(() => {
    if (!isDMView) return;

    const handleUpdate = () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        if (currentMap?.isCombat) {
          const mapWidth = currentMap.width || 2000;
          const mapHeight = currentMap.height || 2000;
          const boundsArr = [
            [0, 0],
            [mapHeight, mapWidth],
          ];

          map.fitBounds(boundsArr, {
            animate: false,
            padding: [0, 0],
          });

          const fittedZoom = map.getZoom();

          map.setMinZoom(fittedZoom);
          map.setMaxZoom(fittedZoom);

          map.dragging.disable();
          map.scrollWheelZoom.disable();
          map.doubleClickZoom.disable();
          map.touchZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();

          const lockedCenter = map.getCenter();
          const lockedBounds = map.getBounds();
          writeViewport(lockedCenter, fittedZoom, lockedBounds);
          return;
        }

        // CRITICAL FIX: Check if fog drawing is active before re-enabling
        const isFogDrawing =
          mapState.fogOfWar?.isDrawing && mapState.fogOfWar?.enabled;

        if (!isFogDrawing) {
          try {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable();
            map.touchZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();

            map.setMinZoom(-5);
            map.setMaxZoom(8);
          } catch (e) {
            console.error("Error enabling map interactions:", e);
          }
        }

        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        writeViewport(center, zoom, bounds);
      }, 50);
    };

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
  }, [
    map,
    isDMView,
    updateMapState,
    currentMap,
    mapState.fogOfWar?.isDrawing,
    mapState.fogOfWar?.enabled,
  ]);

  useEffect(() => {
    if (isDMView) return;
    if (!mapState.viewport) return;

    const { center, zoom } = mapState.viewport;

    map.setView(center, zoom, { animate: false });

    map.setMinZoom(zoom);
    map.setMaxZoom(zoom);

    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }, [map, isDMView, mapState.viewport]);

  return null;
};
