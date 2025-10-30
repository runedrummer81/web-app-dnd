import { useState } from "react";

export const GridControls = ({ gridSettings, onUpdateGrid, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const handleSizeChange = (delta) => {
    const newSize = Math.max(20, Math.min(200, gridSettings.size + delta));
    onUpdateGrid({ ...gridSettings, size: newSize });
  };

  const handleOpacityChange = (e) => {
    onUpdateGrid({ ...gridSettings, opacity: parseFloat(e.target.value) });
  };

  const handleColorChange = (e) => {
    onUpdateGrid({ ...gridSettings, color: e.target.value });
  };

  const toggleGrid = () => {
    onUpdateGrid({ ...gridSettings, visible: !gridSettings.visible });
  };

  return (
    <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg text-white z-[1000]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">Grid Settings</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={toggleGrid}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            gridSettings.visible
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {gridSettings.visible ? "Grid ON" : "Grid OFF"}
        </button>
      </div>

      {isExpanded && gridSettings.visible && (
        <div className="space-y-3 mt-3 border-t border-gray-700 pt-3">
          {/* Grid Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Grid Size: {gridSettings.size}px (≈
              {Math.round(gridSettings.size / 20)} ft)
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSizeChange(-5)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                −5
              </button>
              <button
                onClick={() => handleSizeChange(-1)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                −1
              </button>
              <button
                onClick={() => handleSizeChange(1)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                +1
              </button>
              <button
                onClick={() => handleSizeChange(5)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                +5
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdateGrid({ ...gridSettings, size: 40 })}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
              >
                Small (40px)
              </button>
              <button
                onClick={() => onUpdateGrid({ ...gridSettings, size: 60 })}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
              >
                Medium (60px)
              </button>
              <button
                onClick={() => onUpdateGrid({ ...gridSettings, size: 80 })}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
              >
                Large (80px)
              </button>
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Opacity: {Math.round(gridSettings.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={gridSettings.opacity}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Grid Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={gridSettings.color}
                onChange={handleColorChange}
                className="w-12 h-8 rounded cursor-pointer"
              />
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    onUpdateGrid({ ...gridSettings, color: "#d9ca89" })
                  }
                  className="w-8 h-8 rounded border-2 border-gray-600"
                  style={{ backgroundColor: "#d9ca89" }}
                  title="Gold"
                />
                <button
                  onClick={() =>
                    onUpdateGrid({ ...gridSettings, color: "#ffffff" })
                  }
                  className="w-8 h-8 rounded border-2 border-gray-600"
                  style={{ backgroundColor: "#ffffff" }}
                  title="White"
                />
                <button
                  onClick={() =>
                    onUpdateGrid({ ...gridSettings, color: "#000000" })
                  }
                  className="w-8 h-8 rounded border-2 border-gray-600"
                  style={{ backgroundColor: "#000000" }}
                  title="Black"
                />
                <button
                  onClick={() =>
                    onUpdateGrid({ ...gridSettings, color: "#ff0000" })
                  }
                  className="w-8 h-8 rounded border-2 border-gray-600"
                  style={{ backgroundColor: "#ff0000" }}
                  title="Red"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
            <p>💡 Adjust grid size to match your physical minis</p>
            <p className="mt-1">
              Grid:{" "}
              {Math.floor((gridSettings.mapWidth || 2000) / gridSettings.size)}{" "}
              ×{" "}
              {Math.floor((gridSettings.mapHeight || 2000) / gridSettings.size)}{" "}
              squares
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
