import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapController = () => {
  const map = useMap();
  const { mapState, isDMView } = useMapSync();

  useEffect(() => {
    if (!isDMView) {
      map.setView(mapState.viewport.center, mapState.viewport.zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [mapState.viewport, map, isDMView]);

  return null;
};
