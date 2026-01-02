import { useRef, useContext, useEffect, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { motion } from "framer-motion";
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
import { SpellEffectOverlay } from "./SpellEffectOverlay";
import { FogOfWarOverlay } from "./FogofWarOverlay";
import { SummonEffects } from "./SummonEffects";
import { useFortress } from "./fortress/FortressContext";
import { RoomLabels } from "./fortress/RoomLabels";
import { MapAnnotations } from "./fortress/MapAnnotations";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle spell drop events
const SpellDropHandler = ({ isDMView }) => {
  const map = useMapEvents({});

  useEffect(() => {
    if (!isDMView) return;

    const mapContainer = map.getContainer();

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e) => {
      e.preventDefault();

      try {
        const spellData = e.dataTransfer.getData("spell");
        if (!spellData) return;

        // Get the map coordinates from the drop position
        const containerPoint = map.mouseEventToContainerPoint(e);
        const latLng = map.containerPointToLatLng(containerPoint);

        // Dispatch event with the position
        const dropEvent = new CustomEvent("spellDropped", {
          detail: {
            position: [latLng.lat, latLng.lng],
            spell: JSON.parse(spellData),
          },
        });
        window.dispatchEvent(dropEvent);
      } catch (error) {
        console.error("Error handling spell drop:", error);
      }
    };

    mapContainer.addEventListener("dragover", handleDragOver);
    mapContainer.addEventListener("drop", handleDrop);

    return () => {
      mapContainer.removeEventListener("dragover", handleDragOver);
      mapContainer.removeEventListener("drop", handleDrop);
    };
  }, [map, isDMView]);

  return null;
};

export const MapDisplay = () => {
  const { mapState, updateMapState, isDMView } = useMapSync();
  const { isSetupMode } = useCombatState();
  const runSessionContext = useContext(RunSessionContext);
  const mapSetData = runSessionContext?.mapSetData;
  const sessionData = runSessionContext?.sessionData;
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const { fortressState } = useFortress();

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

    const dungeonMap = mapSetData.dungeonMaps?.find(
      (m) => m.id === mapState.currentMapId
    );
    if (dungeonMap) return { ...dungeonMap, isCombat: false };

    const locationMaps = mapSetData.locationMaps || [];
    for (const location of locationMaps) {
      const map = location.maps?.find((m) => m.id === mapState.currentMapId);
      if (map) return { ...map, isCombat: false };
    }

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

    if (
      mapState.fillerMapData &&
      mapState.currentMapId === mapState.fillerMapData.id
    ) {
      return {
        id: mapState.fillerMapData.id,
        name: mapState.fillerMapData.name || "Filler Map",
        imageUrl: mapState.fillerMapData.imageUrl,
        width: mapState.fillerMapData.width || 2000,
        height: mapState.fillerMapData.height || 2000,
        isCombat: false,
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

  const gridSettings = mapState.gridSettings || {
    visible: false,
    size: 40,
    color: "#d9ca89",
    opacity: 0.3,
  };

  const handleTokenMove = (tokenId, newPosition, newSize) => {
    const updatedTokens = (mapState.tokens || []).map((token) =>
      token.id === tokenId
        ? {
            ...token,
            position: newPosition,
            size: newSize !== undefined ? newSize : token.size,
          }
        : token
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
      minZoom={-5}
      maxZoom={8}
      maxBounds={mapBounds}
      maxBoundsViscosity={1.0}
      zoomDelta={0.25}
      zoomSnap={0.25}
      wheelPxPerZoomLevel={120}
    >
      {/* 1. Base map image */}
      {currentMap.imageUrl && (
        <ImageOverlay url={currentMap.imageUrl} bounds={mapBounds} />
      )}

      {/* 2. Grid overlay (on combat maps) */}
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

      {/* 2.5. FOG OF WAR OVERLAY - Works on ALL maps */}
      <FogOfWarOverlay
        enabled={mapState.fogOfWar?.enabled || false}
        revealedMask={mapState.fogOfWar?.revealedMask || null}
        isDMView={isDMView}
        isDrawing={isDMView && mapState.fogOfWar?.isDrawing}
        brushSize={mapState.fogOfWar?.brushSize || 50}
        mapDimensions={{
          width: currentMap.width,
          height: currentMap.height,
        }}
        onMaskUpdate={(maskData) => {
          updateMapState({
            fogOfWar: {
              ...mapState.fogOfWar,
              revealedMask: maskData,
            },
          });
        }}
      />

      {isDMView && fortressState.phase === "infiltration" && (
        <>
          <RoomLabels
            mapDimensions={{
              width: currentMap.width,
              height: currentMap.height,
            }}
          />
          <MapAnnotations />
        </>
      )}

      {/* 3. SPELL EFFECTS - Renders BENEATH tokens */}
      {currentMap.isCombat && (
        <SpellEffectOverlay
          effects={mapState.spellEffects || []}
          onEffectMove={(id, position) => {
            updateMapState({
              spellEffects: (mapState.spellEffects || []).map((e) =>
                e.id === id ? { ...e, position } : e
              ),
            });
          }}
          onEffectResize={(id, radius) => {
            updateMapState({
              spellEffects: (mapState.spellEffects || []).map((e) =>
                e.id === id ? { ...e, radius } : e
              ),
            });
          }}
          onEffectRemove={(id) => {
            updateMapState({
              spellEffects: (mapState.spellEffects || []).filter(
                (e) => e.id !== id
              ),
            });
          }}
          isDMView={isDMView}
        />
      )}

      {/* 4. TOKENS - Renders ON TOP of spell effects */}
      {currentMap.isCombat && (
        <TokenOverlay
          tokens={mapState.tokens || []}
          onTokenMove={handleTokenMove}
          isDMView={isDMView}
        />
      )}

      {/* ✨ 4.5. SUMMON EFFECTS - Magical animations */}
      {currentMap.isCombat && <SummonEffects />}

      {/* 5. Spell drop handler - enables dragging spells onto map */}
      <SpellDropHandler isDMView={isDMView} />

      {/* 6. Map controller and events */}
      <MapController
        mapDimensions={{
          width: currentMap.width,
          height: currentMap.height,
        }}
        currentMap={currentMap}
      />
      <MapEventsHandler />

      {/* 7. Markers */}
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

      {/* 8. Route display */}
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
      <motion.div
        key={currentMap.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="w-full h-full"
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
      </motion.div>
    </div>
  );
};
