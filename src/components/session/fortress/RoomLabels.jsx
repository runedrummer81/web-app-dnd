import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useFortress } from "./FortressContext";
import { roomLabelPositions, labelSizes } from "./data/Roomlabelpositions";

export const RoomLabels = ({ mapDimensions }) => {
  const map = useMap();
  const { fortressState, setCurrentRoom } = useFortress();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Create markers for each room
    const newMarkers = [];

    Object.entries(roomLabelPositions).forEach(([roomId, data]) => {
      const { position, size } = data;
      const sizeStyle = labelSizes[size] || labelSizes.medium;

      // Check if this is the current room
      const isCurrentRoom = fortressState.currentRoom === roomId;

      // Create custom icon (HTML div)
      const icon = L.divIcon({
        className: "custom-room-label",
        html: `
          <div style="
            background: ${isCurrentRoom ? "#d9ca89" : "rgba(0, 0, 0, 0.8)"};
            color: ${isCurrentRoom ? "#1a1a1a" : "#d9ca89"};
            border: 2px solid ${
              isCurrentRoom ? "#BF883C" : "rgba(191, 136, 60, 0.5)"
            };
            border-radius: 4px;
            font-family: 'EB Garamond', serif;
            font-weight: bold;
            font-size: ${sizeStyle.fontSize};
            padding: ${sizeStyle.padding};
            min-width: ${sizeStyle.minWidth};
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: ${
              isCurrentRoom
                ? "0 0 12px rgba(217, 202, 137, 0.6)"
                : "0 2px 4px rgba(0,0,0,0.5)"
            };
            text-transform: uppercase;
            letter-spacing: 0.5px;
            user-select: none;
            white-space: nowrap;
          "
          onmouseover="this.style.background='#d9ca89'; this.style.color='#1a1a1a'; this.style.borderColor='#BF883C'; this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 12px rgba(217, 202, 137, 0.8)';"
          onmouseout="this.style.background='${
            isCurrentRoom ? "#d9ca89" : "rgba(0, 0, 0, 0.8)"
          }'; this.style.color='${
          isCurrentRoom ? "#1a1a1a" : "#d9ca89"
        }'; this.style.borderColor='${
          isCurrentRoom ? "#BF883C" : "rgba(191, 136, 60, 0.5)"
        }'; this.style.transform='scale(1)'; this.style.boxShadow='${
          isCurrentRoom
            ? "0 0 12px rgba(217, 202, 137, 0.6)"
            : "0 2px 4px rgba(0,0,0,0.5)"
        }';"
          >
            ${roomId}
          </div>
        `,
        iconSize: [sizeStyle.minWidth, 24],
        iconAnchor: [parseInt(sizeStyle.minWidth) / 2, 12], // Center the icon
      });

      // Create marker
      const marker = L.marker(position, {
        icon: icon,
        interactive: true,
      });

      // Click handler - updates current room
      marker.on("click", () => {
        console.log(`🏰 Room ${roomId} clicked`);
        setCurrentRoom(roomId);
      });

      marker.addTo(map);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Cleanup
    return () => {
      newMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });
    };
  }, [map, fortressState.currentRoom, setCurrentRoom]);

  // Update markers when current room changes
  useEffect(() => {
    // Remove all markers and recreate them
    // This ensures the current room highlighting updates
    markers.forEach((marker) => {
      map.removeLayer(marker);
    });

    const newMarkers = [];

    Object.entries(roomLabelPositions).forEach(([roomId, data]) => {
      const { position, size } = data;
      const sizeStyle = labelSizes[size] || labelSizes.medium;

      const isCurrentRoom = fortressState.currentRoom === roomId;

      const icon = L.divIcon({
        className: "custom-room-label",
        html: `
          <div style="
            background: ${isCurrentRoom ? "#d9ca89" : "rgba(0, 0, 0, 0.8)"};
            color: ${isCurrentRoom ? "#1a1a1a" : "#d9ca89"};
            border: 2px solid ${
              isCurrentRoom ? "#BF883C" : "rgba(191, 136, 60, 0.5)"
            };
            border-radius: 4px;
            font-family: 'EB Garamond', serif;
            font-weight: bold;
            font-size: ${sizeStyle.fontSize};
            padding: ${sizeStyle.padding};
            min-width: ${sizeStyle.minWidth};
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: ${
              isCurrentRoom
                ? "0 0 12px rgba(217, 202, 137, 0.6)"
                : "0 2px 4px rgba(0,0,0,0.5)"
            };
            text-transform: uppercase;
            letter-spacing: 0.5px;
            user-select: none;
            white-space: nowrap;
          "
          onmouseover="this.style.background='#d9ca89'; this.style.color='#1a1a1a'; this.style.borderColor='#BF883C'; this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 12px rgba(217, 202, 137, 0.8)';"
          onmouseout="this.style.background='${
            isCurrentRoom ? "#d9ca89" : "rgba(0, 0, 0, 0.8)"
          }'; this.style.color='${
          isCurrentRoom ? "#1a1a1a" : "#d9ca89"
        }'; this.style.borderColor='${
          isCurrentRoom ? "#BF883C" : "rgba(191, 136, 60, 0.5)"
        }'; this.style.transform='scale(1)'; this.style.boxShadow='${
          isCurrentRoom
            ? "0 0 12px rgba(217, 202, 137, 0.6)"
            : "0 2px 4px rgba(0,0,0,0.5)"
        }';"
          >
            ${roomId}
          </div>
        `,
        iconSize: [sizeStyle.minWidth, 24],
        iconAnchor: [parseInt(sizeStyle.minWidth) / 2, 12],
      });

      const marker = L.marker(position, {
        icon: icon,
        interactive: true,
      });

      marker.on("click", () => {
        console.log(`🏰 Room ${roomId} clicked`);
        setCurrentRoom(roomId);
      });

      marker.addTo(map);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });
    };
  }, [fortressState.currentRoom, map, setCurrentRoom]);

  return null; // This component doesn't render anything directly
};
