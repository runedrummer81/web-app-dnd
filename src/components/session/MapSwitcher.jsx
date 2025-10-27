import { useMapSync } from "./MapSyncContext";

export const MapSwitcher = ({ mapSetData }) => {
  const { mapState, updateMapState, isDMView } = useMapSync();

  const switchToMap = (mapId) => {
    if (!isDMView) return;

    updateMapState({
      currentMapId: mapId,
      markers: [],
    });
  };

  if (!isDMView || !mapSetData) return null;

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-90 border-2 border-[#bf883c] p-4 rounded z-[1000] max-w-xs shadow-lg shadow-[#bf883c]/20">
      <h3 className="text-[#f0d382] font-semibold mb-3 uppercase tracking-wider text-sm">
        Maps
      </h3>

      <button
        onClick={() => switchToMap("world")}
        className={`w-full text-left px-3 py-2 rounded mb-2 transition-all duration-200 ${
          mapState.currentMapId === "world"
            ? "bg-[#bf883c] text-black font-semibold shadow-lg shadow-[#bf883c]/30"
            : "bg-gray-800 text-[#f0d382] hover:bg-gray-700 border border-[#bf883c]/30"
        }`}
      >
        🗺️ {mapSetData.worldMap?.name || "World Map"}
      </button>

      {mapSetData.cityMaps?.map((cityMap) => (
        <button
          key={cityMap.id}
          onClick={() => switchToMap(cityMap.id)}
          className={`w-full text-left px-3 py-2 rounded mb-2 transition-all duration-200 ${
            mapState.currentMapId === cityMap.id
              ? "bg-[#bf883c] text-black font-semibold shadow-lg shadow-[#bf883c]/30"
              : "bg-gray-800 text-[#f0d382] hover:bg-gray-700 border border-[#bf883c]/30"
          }`}
        >
          🏰 {cityMap.name}
        </button>
      ))}
    </div>
  );
};
