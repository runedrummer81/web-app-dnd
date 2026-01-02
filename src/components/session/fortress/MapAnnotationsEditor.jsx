import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { mapAnnotations } from "./data/mapAnnotations";

/**
 * MAP ANNOTATIONS EDITOR
 *
 * This component lets you visually position text annotations by dragging them,
 * then exports the coordinates to copy into mapAnnotations.js
 *
 * HOW TO USE:
 * 1. Temporarily replace <MapAnnotations> with <MapAnnotationsEditor> in MapDisplay
 * 2. Drag annotations to correct positions
 * 3. Click "Show Positions" button
 * 4. Copy the output to mapAnnotations.js
 * 5. Replace <MapAnnotationsEditor> back with <MapAnnotations>
 */

export const MapAnnotationsEditor = () => {
  const map = useMap();
  const [markers, setMarkers] = useState([]);
  const [positions, setPositions] = useState({ ...mapAnnotations });

  // Create draggable markers
  useEffect(() => {
    const newMarkers = [];

    Object.entries(positions).forEach(([id, data]) => {
      const { position, text, style } = data;

      // Create icon with visible border for editing
      const icon = L.divIcon({
        className: "map-annotation-editor",
        html: `
          <div style="
            color: ${style.color || "#d9ca89"};
            font-family: 'EB Garamond', serif;
            font-size: ${style.fontSize || "14px"};
            font-weight: ${style.fontWeight || "normal"};
            font-style: ${style.fontStyle || "normal"};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            cursor: move;
            user-select: none;
            white-space: nowrap;
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border: 2px dashed rgba(217, 202, 137, 0.5);
            border-radius: 4px;
          ">
            ${text}
          </div>
        `,
        iconSize: [200, 30],
        iconAnchor: [100, 15],
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

        console.log(`"${id}" moved to: [${roundedPos[0]}, ${roundedPos[1]}]`);

        setPositions((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
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
    button.innerHTML = "📍 Show Annotation Positions";
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 9999;
      background: #87CEEB;
      color: #1a1a1a;
      border: 2px solid #4682B4;
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
      let output = "export const mapAnnotations = {\n";

      Object.entries(positions).forEach(([id, data]) => {
        output += `  "${id}": {\n`;
        output += `    position: [${data.position[0]}, ${data.position[1]}],\n`;
        output += `    text: "${data.text}",\n`;
        output += `    style: {\n`;
        output += `      fontSize: "${data.style.fontSize || "14px"}",\n`;
        output += `      color: "${data.style.color || "#d9ca89"}",\n`;
        if (data.style.fontWeight) {
          output += `      fontWeight: "${data.style.fontWeight}",\n`;
        }
        if (data.style.fontStyle) {
          output += `      fontStyle: "${data.style.fontStyle}",\n`;
        }
        output += `    },\n`;
        output += `  },\n`;
      });

      output += "};";

      console.clear();
      console.log(
        "%c✅ COPY THIS TO mapAnnotations.js:",
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
          button.innerHTML = "📍 Show Annotation Positions";
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
      "%c📍 MAP ANNOTATIONS EDITOR MODE",
      "color: #87CEEB; font-size: 20px; font-weight: bold;"
    );
    console.log(
      "%cDrag the text annotations to position them correctly.",
      "color: #4682B4; font-size: 14px;"
    );
    console.log(
      "%cWhen done, click the 'Show Annotation Positions' button.",
      "color: #4682B4; font-size: 14px;"
    );
  }, []);

  return null;
};
