import { useRef, useContext, useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapSync, RunSessionContext } from "./MapSyncContext";
import { useCombatState } from "./CombatStateContext";
import { MapController } from "./MapController";
import { MapEventsHandler } from "./MapEventsHandler";
import { createGoldenMarker } from "./GoldenMarker";
import { WeatherEffects } from "./WeatherEffects";
import { RouteDisplay } from "./RouteDisplay";
import { GridOverlay } from "./GridOverlay";
import { TokenOverlay } from "./TokenOverlay";

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
  const { isSetupMode } = useCombatState();
  const runSessionContext = useContext(RunSessionContext);
  const mapSetData = runSessionContext?.mapSetData;
  const sessionData = runSessionContext?.sessionData;
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);

  const getCurrentMap = () => {
    if (!mapSetData) {
      return {
        id: "default",
        name: "Default Map",
        imageUrl: null,
        width: 2000,
        height: 2000,
        isCombat: false,
      };
    }

    if (mapState.currentMapId === "world")
      return { ...mapSetData.worldMap, isCombat: false };

    const cityMap = mapSetData.cityMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (cityMap) return { ...cityMap, isCombat: false };

    const combatMap = sessionData?.combatMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (combatMap) {
      return {
        id: combatMap.id,
        name: combatMap.name || combatMap.title || "Combat Map",
        imageUrl: combatMap.image,
        width: combatMap.width || 2000,
        height: combatMap.height || 2000,
        isCombat: true,
      };
    }

    return { ...mapSetData.worldMap, isCombat: false };
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

  const [containerDimensions, setContainerDimensions] = useState(null);

  useEffect(() => {
    if (isDMView || !mapState.dmContainerSize || !wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;
    const actualWidth = wrapper.offsetWidth;
    const actualHeight = wrapper.offsetHeight;

    const scaleX = actualWidth / mapState.dmContainerSize.width;
    const scaleY = actualHeight / mapState.dmContainerSize.height;
    const scale = Math.min(scaleX, scaleY);

    setContainerDimensions({
      width: mapState.dmContainerSize.width,
      height: mapState.dmContainerSize.height,
      scale: scale,
      offsetX: (actualWidth - mapState.dmContainerSize.width * scale) / 2,
      offsetY: (actualHeight - mapState.dmContainerSize.height * scale) / 2,
    });
  }, [isDMView, mapState.dmContainerSize, wrapperRef]);

  // Get grid settings with defaults
  const gridSettings = mapState.gridSettings || {
    visible: false,
    size: 40,
    color: "#d9ca89",
    opacity: 0.3,
  };

  const handleTokenMove = (tokenId, newPosition) => {
    const updatedTokens = (mapState.tokens || []).map((token) =>
      token.id === tokenId ? { ...token, position: newPosition } : token
    );
    updateMapState({ tokens: updatedTokens });
  };

  const renderMapContainer = () => (
    <MapContainer
      center={mapCenter}
      zoom={1}
      style={{ width: "100%", height: "100%" }}
      className="bg-black"
      ref={mapRef}
      crs={L.CRS.Simple}
      zoomControl={false}
      attributionControl={false}
      minZoom={0}
      maxZoom={8}
      maxBounds={mapBounds}
      maxBoundsViscosity={1.0}
    >
      {currentMap.imageUrl && (
        <ImageOverlay url={currentMap.imageUrl} bounds={mapBounds} />
      )}

      {/* Grid overlay - only show on combat maps */}
      {currentMap.isCombat && (
        <GridOverlay
          gridSettings={gridSettings}
          mapDimensions={{
            width: currentMap.width,
            height: currentMap.height,
          }}
          visible={gridSettings.visible}
        />
      )}

      {/* Token Overlay */}
      {currentMap.isCombat && (
        <TokenOverlay
          tokens={mapState.tokens || []}
          onTokenMove={handleTokenMove}
          isDMView={isDMView}
        />
      )}

      <MapController
        mapDimensions={{
          width: currentMap.width,
          height: currentMap.height,
        }}
        currentMap={currentMap}
      />
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
                  onClick={() => {
                    updateMapState({
                      markers: mapState.markers.filter(
                        (m) => m.id !== marker.id
                      ),
                    });
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

      <RouteDisplay
        route={mapState.route}
        isDMView={isDMView}
        onRemoveWaypoint={(i) => {
          if (!isDMView) return;
          const newWaypoints = mapState.route.waypoints.filter(
            (_, idx) => idx !== i
          );
          updateMapState({
            route: { ...mapState.route, waypoints: newWaypoints },
          });
        }}
      />
    </MapContainer>
  );

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black overflow-hidden"
    >
      {!isDMView && containerDimensions ? (
        <div
          style={{
            position: "absolute",
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            transform: `scale(${containerDimensions.scale})`,
            transformOrigin: "top left",
            left: `${containerDimensions.offsetX}px`,
            top: `${containerDimensions.offsetY}px`,
          }}
        >
          {renderMapContainer()}
        </div>
      ) : isDMView ? (
        renderMapContainer()
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-white text-xl">Loading map...</div>
        </div>
      )}

      <WeatherEffects weather={mapState.weather} />
    </div>
  );
};
