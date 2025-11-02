
import { SVGOverlay, useMap } from "react-leaflet";

export const GridOverlay = ({ gridSettings, mapDimensions, visible }) => {
  const map = useMap();

  if (!visible || !gridSettings.visible) return null;

  const { size, color, opacity } = gridSettings;
  const width = mapDimensions.width || 2000;
  const height = mapDimensions.height || 2000;

  // Calculate number of grid lines
  const verticalLines = Math.floor(width / size);
  const horizontalLines = Math.floor(height / size);

  // SVG bounds match the map bounds
  const bounds = [
    [0, 0],
    [height, width],
  ];

  return (
    <SVGOverlay bounds={bounds} attributes={{ className: "grid-overlay" }}>
      <svg width="100%" height="100%" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern
            id="grid-pattern"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={size}
              height={size}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={opacity}
            />
          </pattern>
        </defs>

        {/* Main grid rectangle */}
        <rect
          x="0"
          y="0"
          width={verticalLines * size}
          height={horizontalLines * size}
          fill="url(#grid-pattern)"
        />

        {/* Optional: Add thicker border around the grid */}
        <rect
          x="0"
          y="0"
          width={verticalLines * size}
          height={horizontalLines * size}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={opacity * 1.5}
        />
      </svg>
    </SVGOverlay>
  );
};
