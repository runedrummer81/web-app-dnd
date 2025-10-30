import { useRef, useContext, useEffect, useState } from "react";
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
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);

  const getCurrentMap = () => {
    if (!mapSetData) {
      return { id: "default", name: "Default Map", imageUrl: null, width: 2000, height: 2000 };
    }

    if (mapState.currentMapId === "world") return mapSetData.worldMap;

    const cityMap = mapSetData.cityMaps?.find(m => m.id === mapState.currentMapId);
    return cityMap || mapSetData.worldMap;
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

  // Player view: Opret en skaleret wrapper
  const [containerDimensions, setContainerDimensions] = useState(null);

  useEffect(() => {
    if (isDMView || !mapState.dmContainerSize || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const actualWidth = wrapper.offsetWidth;
    const actualHeight = wrapper.offsetHeight;

    const scaleX = actualWidth / mapState.dmContainerSize.width;
    const scaleY = actualHeight / mapState.dmContainerSize.height;

    setContainerDimensions({
      width: mapState.dmContainerSize.width,
      height: mapState.dmContainerSize.height,
      scaleX,
      scaleY,
    });

  }, [isDMView, mapState.dmContainerSize, wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-full h-full bg-black overflow-hidden">
      {/* Player view: scaled inner container */}
      {!isDMView && containerDimensions ? (
        <div
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            transform: `scale(${containerDimensions.scaleX}, ${containerDimensions.scaleY})`,
            transformOrigin: 'top left',
          }}
        >
          <MapContainer
            center={mapCenter}
            zoom={1}
            style={{ width: '100%', height: '100%' }}
            className="bg-black"
            ref={mapRef}
            crs={L.CRS.Simple}
            zoomControl={false}
            attributionControl={false}
            minZoom={0}
            maxZoom={4}
            maxBounds={mapBounds}
            maxBoundsViscosity={1.0}
          >
            {currentMap.imageUrl && <ImageOverlay url={currentMap.imageUrl} bounds={mapBounds} />}
            <MapController mapDimensions={{ width: currentMap.width, height: currentMap.height }} />
            <MapEventsHandler />

            {mapState.markers.map(marker => (
              <Marker key={marker.id} position={marker.position} icon={createGoldenMarker()}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-[#bf883c]">{marker.label}</strong>
                  </div>
                </Popup>
              </Marker>
            ))}

            <RouteDisplay route={mapState.route} isDMView={isDMView} onRemoveWaypoint={(i) => {}} />
          </MapContainer>
        </div>
      ) : (
        /* DM view: normal container */
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
        >
          {currentMap.imageUrl && <ImageOverlay url={currentMap.imageUrl} bounds={mapBounds} />}
          <MapController mapDimensions={{ width: currentMap.width, height: currentMap.height }} />
          <MapEventsHandler />

          {mapState.markers.map(marker => (
            <Marker key={marker.id} position={marker.position} icon={createGoldenMarker()}>
              <Popup>
                <div className="text-center">
                  <strong className="text-[#bf883c]">{marker.label}</strong>
                  {isDMView && (
                    <button
                      onClick={() => {
                        updateMapState({ markers: mapState.markers.filter(m => m.id !== marker.id) });
                      }}
                      className="block mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 w-full"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <RouteDisplay route={mapState.route} isDMView={isDMView} onRemoveWaypoint={(i) => {
            if (!isDMView) return;
            const newWaypoints = mapState.route.waypoints.filter((_, idx) => idx !== i);
            updateMapState({ route: { ...mapState.route, waypoints: newWaypoints } });
          }} />
        </MapContainer>
      )}

      <WeatherEffects weather={mapState.weather} />
    </div>
  );
}