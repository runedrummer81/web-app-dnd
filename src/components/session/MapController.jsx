import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = ({ mapDimensions }) => {
  const map = useMap();
  const { mapState, updateMapState, isDMView } = useMapSync();

  // DM-vinduet: Send center, zoom, bounds OG container size
  useEffect(() => {
    if (!isDMView) return;

    const handleUpdate = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      const container = map.getContainer();

      updateMapState({ 
        viewport: {
          center: [center.lat, center.lng],
          zoom: zoom,
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          }
        },
        dmContainerSize: {
          width: container.offsetWidth,
          height: container.offsetHeight,
        }
      });
    };

    // Initial + on changes
    handleUpdate();
    map.on("moveend", handleUpdate);
    map.on("zoomend", handleUpdate);

    // Også lyt efter resize
    const resizeObserver = new ResizeObserver(handleUpdate);
    resizeObserver.observe(map.getContainer());

    return () => {
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
}