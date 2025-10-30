import { useMapEvents } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapEventsHandler = () => {
  const { mapState, updateMapState, isDMView } = useMapSync();

  useMapEvents({
    moveend: (e) => {
      if (!isDMView) return;
      const map = e.target;
      updateMapState({
        viewport: {
          center: [map.getCenter().lat, map.getCenter().lng],
          zoom: map.getZoom(),
        },
      });
    },
    zoomend: (e) => {
      if (!isDMView) return;
      const map = e.target;
      updateMapState({
        viewport: {
          center: [map.getCenter().lat, map.getCenter().lng],
          zoom: map.getZoom(),
        },
      });
    },
    mousedown: (e) => {
      if (!isDMView) return;
      if (e.originalEvent.button === 1) {
        e.originalEvent.preventDefault();
        const newMarker = {
          id: Date.now(),
          position: [e.latlng.lat, e.latlng.lng],
          type: "party",
          label: "Party Location",
        };
        updateMapState({
          markers: [...mapState.markers, newMarker],
        });
      }
    },
    click: (e) => {
      if (!isDMView) return;
      if (mapState.routeSettingMode) {
        const newWaypoint = [e.latlng.lat, e.latlng.lng];
        updateMapState({
          route: {
            ...mapState.route,
            waypoints: [...mapState.route.waypoints, newWaypoint],
          },
        });
      }
    },
  });

  return null;
};
