import { useMapEvents } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";

export const MapEventsHandler = () => {
  const { mapState, updateMapState, isDMView } = useMapSync();

  useMapEvents({
    moveend: (e) => {
      if (isDMView) {
        const center = e.target.getCenter();
        updateMapState({
          viewport: {
            center: [center.lat, center.lng],
            zoom: e.target.getZoom(),
          },
        });
      }
    },
    zoomend: (e) => {
      if (isDMView) {
        const center = e.target.getCenter();
        updateMapState({
          viewport: {
            center: [center.lat, center.lng],
            zoom: e.target.getZoom(),
          },
        });
      }
    },
    mousedown: (e) => {
      if (!isDMView) return;

      // Middle mouse button = add marker
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

      // If route setting mode is active, add waypoint
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
