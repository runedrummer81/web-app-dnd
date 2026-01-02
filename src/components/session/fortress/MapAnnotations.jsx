import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { mapAnnotations } from "./data/mapAnnotations";

export const MapAnnotations = () => {
  const map = useMap();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const newMarkers = [];

    Object.entries(mapAnnotations).forEach(([id, data]) => {
      const { position, text, style } = data;

      // Create a non-interactive div icon
      const icon = L.divIcon({
        className: "map-annotation",
        html: `
          <div style="
            color: ${style.color || "#d9ca89"};
            font-family: 'EB Garamond', serif;
            font-size: ${style.fontSize || "14px"};
            font-weight: ${style.fontWeight || "normal"};
            font-style: ${style.fontStyle || "normal"};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
          ">
            ${text}
          </div>
        `,
        iconSize: [200, 30],
        iconAnchor: [100, 15],
      });

      // Create marker - NOT draggable, NOT interactive
      const marker = L.marker(position, {
        icon: icon,
        interactive: false, // ✅ This makes it non-clickable!
        draggable: false,
      });

      marker.addTo(map);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => map.removeLayer(marker));
    };
  }, [map]);

  return null;
};
