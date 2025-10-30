import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(null);

  // DM-vinduet: Send center, zoom, bounds OG container size
  useEffect(() => {
    if (!isDMView) return;

    const handleUpdate = () => {
      // Clear previous timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce updates
      updateTimeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        const container = map.getContainer();

        // Round values to prevent tiny changes from triggering updates
        const newData = {
          centerLat: Math.round(center.lat * 100) / 100,
          centerLng: Math.round(center.lng * 100) / 100,
          zoom: Math.round(zoom * 10) / 10,
          width: container.offsetWidth,
          height: container.offsetHeight,
        };

        // Only update if values actually changed
        const hasChanged = !lastUpdateRef.current ||
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
              }
            },
            dmContainerSize: {
              width: newData.width,
              height: newData.height,
            }
          });
        }
      }, 50); // 50ms debounce
    };

    // Initial update
    setTimeout(handleUpdate, 100);
    
    map.on("moveend", handleUpdate);
    map.on("zoomend", handleUpdate);

    // Lyt efter resize
    const resizeObserver = new ResizeObserver(handleUpdate);
    resizeObserver.observe(map.getContainer());

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      map.off("moveend", handleUpdate);
      map.off("zoomend", handleUpdate);
      resizeObserver.disconnect();
    };
  }, [map, isDMView, updateMapState]);

  // Player-vinduet: Match DM's viewport
  useEffect(() => {
    if (isDMView) return;
    if (!mapState.viewport) return;

    const { center, zoom } = mapState.viewport;

    // Disable interaktioner
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    // Set samme view som DM
    map.setView(center, zoom, { animate: false });
    
    // Lock zoom
    map.setMinZoom(zoom);
    map.setMaxZoom(zoom);

  }, [map, isDMView, mapState.viewport]);

  return null;
};