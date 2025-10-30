import { useRef, useContext } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapSync, RunSessionContext } from "./MapSyncContext";
import { MapController } from "./MapController";
import { MapEventsHandler } from "./MapEventsHandler";
import { createGoldenMarker } from "./GoldenMarker";
import { WeatherEffects } from "./WeatherEffects";
import { RouteDisplay } from "./RouteDisplay";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const MapDisplay = () => {
  const { mapState, updateMapState, isDMView } = useMapSync();
  const runSessionContext = useContext(RunSessionContext);
  const mapSetData = runSessionContext?.mapSetData;
  const sessionData = runSessionContext?.sessionData; // Added this line
  const mapRef = useRef(null);

  const getCurrentMap = () => {
    // Debug logs
    console.log("Current Map ID:", mapState.currentMapId);
    console.log("Combat Maps:", sessionData?.combatMaps);

    if (!mapSetData) {
      return {
        id: "default",
        name: "Default Map",
        imageUrl: null,
        width: 2000,
        height: 2000,
      };
    }

    if (mapState.currentMapId === "world") {
      return mapSetData.worldMap;
    }

    // Check city maps
    const cityMap = mapSetData.cityMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (cityMap) {
      console.log("Found City Map:", cityMap);
      return cityMap;
    }

    // Check combat maps - NEW SECTION
    const combatMap = sessionData?.combatMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (combatMap) {
      console.log("Found Combat Map:", combatMap);
      // Convert combat map format to map format
      return {
        id: combatMap.id,
        name: combatMap.name || combatMap.title || "Combat Map",
        imageUrl: combatMap.image, // Combat maps use 'image' not 'imageUrl'
        width: combatMap.width || 2000,
        height: combatMap.height || 2000,
      };
    }

    // Fallback to world map
    console.log("Falling back to world map");
    return mapSetData.worldMap;
  };

  const currentMap = getCurrentMap();
  const mapBounds = [
    [0, 0],
    [currentMap.height || 2000, currentMap.width || 2000],
  ];

  const mapCenter = [
    (currentMap.height || 2000) / 2,
    (currentMap.width || 2000) / 2,
  ];

  const handleRemoveMarker = (markerId) => {
    if (!isDMView) return;
    updateMapState({
      markers: mapState.markers.filter((m) => m.id !== markerId),
    });
  };

  const handleRemoveWaypoint = (index) => {
    if (!isDMView) return;
    const newWaypoints = mapState.route.waypoints.filter((_, i) => i !== index);
    updateMapState({
      route: {
        ...mapState.route,
        waypoints: newWaypoints,
      },
    });
  };

  return (
    <div className="relative w-full h-full bg-black">
      <MapContainer
        center={mapCenter}
        zoom={1}
        className="w-full h-full bg-black"
        ref={mapRef}
        crs={L.CRS.Simple}
        zoomControl={false}
        attributionControl={false}
        minZoom={0}
        maxZoom={4}
        maxBounds={mapBounds}
        maxBoundsViscosity={1.0}
        key={currentMap.id} // Added this line - forces remount when map changes
      >
        {currentMap.imageUrl ? (
          <ImageOverlay url={currentMap.imageUrl} bounds={mapBounds} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>No map image available - Add maps to your MapSet in Firestore</p>
          </div>
        )}
        <MapController />
        <MapEventsHandler />
        {mapState.markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createGoldenMarker()}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-[#bf883c]">{marker.label}</strong>
                {isDMView && (
                  <button
                    onClick={() => handleRemoveMarker(marker.id)}
                    className="block mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 w-full"
                  >
                    Remove
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <RouteDisplay
          route={mapState.route}
          isDMView={isDMView}
          onRemoveWaypoint={handleRemoveWaypoint}
        />
      </MapContainer>
      <WeatherEffects weather={mapState.weather} />
    </div>
  );
};
