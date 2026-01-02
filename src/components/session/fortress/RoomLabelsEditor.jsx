import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { roomLabelPositions, labelSizes } from "./data/Roomlabelpositions";

/**
 * ROOM LABEL POSITION EDITOR
 *
 * This component lets you visually position room labels by dragging them,
 * then exports the coordinates to copy into roomLabelPositions.js
 *
 * HOW TO USE:
 * 1. Temporarily replace <RoomLabels> with <RoomLabelEditor> in MapDisplay
 * 2. Drag labels to correct positions
 * 3. Click "Show Positions" button in console
 * 4. Copy the output to roomLabelPositions.js
 * 5. Replace <RoomLabelEditor> back with <RoomLabels>
 */

export const RoomLabelsEditor = ({ mapDimensions }) => {
  const map = useMap();
  const [markers, setMarkers] = useState([]);
  const [positions, setPositions] = useState({ ...roomLabelPositions });

  // Create draggable markers
  useEffect(() => {
    const newMarkers = [];

    Object.entries(positions).forEach(([roomId, data]) => {
      const { position, size } = data;
      const sizeStyle = labelSizes[size] || labelSizes.medium;

      // Create icon
      const icon = L.divIcon({
        className: "custom-room-label-editor",
        html: `
          <div style="
            background: rgba(217, 202, 137, 0.9);
            color: #1a1a1a;
            border: 2px solid #BF883C;
            border-radius: 4px;
            font-family: 'EB Garamond', serif;
            font-weight: bold;
            font-size: ${sizeStyle.fontSize};
            padding: ${sizeStyle.padding};
            min-width: ${sizeStyle.minWidth};
            text-align: center;
            cursor: move;
            box-shadow: 0 0 12px rgba(217, 202, 137, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            user-select: none;
            white-space: nowrap;
          ">
            ${roomId}
          </div>
        `,
        iconSize: [sizeStyle.minWidth, 24],
        iconAnchor: [parseInt(sizeStyle.minWidth) / 2, 12],
      });

      // Create DRAGGABLE marker
      const marker = L.marker(position, {
        icon: icon,
        draggable: true, // ✅ This makes it draggable!
      });

      // Update position when dragged
      marker.on("dragend", (e) => {
        const newPos = e.target.getLatLng();
        const roundedPos = [Math.round(newPos.lat), Math.round(newPos.lng)];

        console.log(`${roomId} moved to: [${roundedPos[0]}, ${roundedPos[1]}]`);

        setPositions((prev) => ({
          ...prev,
          [roomId]: {
            ...prev[roomId],
            position: roundedPos,
          },
        }));
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
  }, [map, positions]);

  // Add button to export positions
  useEffect(() => {
    // Create floating button
    const button = document.createElement("button");
    button.innerHTML = "📋 Show Positions";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      background: #d9ca89;
      color: #1a1a1a;
      border: 2px solid #BF883C;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'EB Garamond', serif;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s;
    `;

    button.onmouseover = () => {
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
    };

    button.onmouseout = () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    };

    button.onclick = () => {
      // Generate code to copy
      let output = "export const roomLabelPositions = {\n";

      Object.entries(positions).forEach(([roomId, data]) => {
        output += `  "${roomId}": {\n`;
        output += `    position: [${data.position[0]}, ${data.position[1]}],\n`;
        output += `    size: "${data.size}",\n`;
        output += `  },\n`;
      });

      output += "};\n";

      console.clear();
      console.log(
        "%c✅ COPY THIS TO roomLabelPositions.js:",
        "color: #4CAF50; font-size: 16px; font-weight: bold;"
      );
      console.log(
        "%c" + output,
        "color: #2196F3; font-family: monospace; font-size: 12px;"
      );

      // Also copy to clipboard
      navigator.clipboard.writeText(output).then(() => {
        button.innerHTML = "✅ Copied!";
        setTimeout(() => {
          button.innerHTML = "📋 Show Positions";
        }, 2000);
      });
    };

    document.body.appendChild(button);

    return () => {
      document.body.removeChild(button);
    };
  }, [positions]);

  // Show instructions
  useEffect(() => {
    console.log(
      "%c🏰 ROOM LABEL EDITOR MODE",
      "color: #d9ca89; font-size: 20px; font-weight: bold;"
    );
    console.log(
      "%cDrag the labels to position them correctly.",
      "color: #BF883C; font-size: 14px;"
    );
    console.log(
      "%cWhen done, click the 'Show Positions' button.",
      "color: #BF883C; font-size: 14px;"
    );
  }, []);

  return null;
};
