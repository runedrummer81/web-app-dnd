// SummonEffects.jsx
// ✨ Magical visual effects for summoning and dispelling creatures
// WATCHES mapState.summonEffects (Firebase synced) - NOT events!

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useMapSync } from "./MapSyncContext";
import L from "leaflet";

export const SummonEffects = () => {
  const map = useMap();
  const { mapState, updateMapState } = useMapSync();
  const [processedEffectIds, setProcessedEffectIds] = useState(new Set());
  const [activeEffects, setActiveEffects] = useState([]);

  console.log("🎨 SummonEffects mounted");

  // ✅ CRITICAL: Watch mapState.summonEffects (Firebase synced)
  useEffect(() => {
    const summonEffects = mapState.summonEffects || [];

    console.log(
      `👀 Checking for new effects. Total in mapState: ${summonEffects.length}`
    );

    summonEffects.forEach((effect) => {
      // Skip if already processed
      if (processedEffectIds.has(effect.id)) {
        return;
      }

      console.log(
        `✨ NEW EFFECT DETECTED: ${effect.type} for ${effect.name} at`,
        effect.position
      );

      // Mark as processed immediately
      setProcessedEffectIds((prev) => new Set([...prev, effect.id]));

      // Calculate delay based on timestamp
      const delay = Math.max(0, effect.timestamp - Date.now());

      console.log(`⏱️ Effect will show in ${delay}ms`);

      setTimeout(() => {
        setActiveEffects((prev) => {
          console.log(
            `📊 Adding effect to active list. Current: ${prev.length}`
          );
          return [...prev, effect];
        });

        // Auto-remove after duration
        const duration = effect.type === "spawn" ? 3000 : 2000;
        setTimeout(() => {
          setActiveEffects((prev) => {
            console.log(`🗑️ Removing effect from active list`);
            return prev.filter((e) => e.id !== effect.id);
          });

          // Clean up from mapState
          updateMapState({
            summonEffects: (mapState.summonEffects || []).filter(
              (e) => e.id !== effect.id
            ),
          });
        }, duration);
      }, delay);
    });
  }, [mapState.summonEffects]); // Only depend on summonEffects

  // Render active effects
  useEffect(() => {
    if (!map) return;

    console.log(`🎨 Rendering ${activeEffects.length} active effects on map`);

    const effectElements = [];

    activeEffects.forEach((effect) => {
      console.log(
        `🎨 Creating DOM elements for ${effect.type}: ${effect.name}`
      );

      if (effect.type === "spawn") {
        // Create spawn effect
        const spawnEffect = L.DomUtil.create("div", "summon-spawn-effect");

        // Magic circle
        const circle = L.DomUtil.create("div", "magic-circle");
        spawnEffect.appendChild(circle);

        // Inner glow
        const glow = L.DomUtil.create("div", "magic-glow");
        spawnEffect.appendChild(glow);

        // Particles
        for (let i = 0; i < 20; i++) {
          const particle = L.DomUtil.create("div", "magic-particle");
          particle.style.animationDelay = `${Math.random() * 0.5}s`;
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          spawnEffect.appendChild(particle);
        }

        // Rising light beams
        for (let i = 0; i < 5; i++) {
          const beam = L.DomUtil.create("div", "light-beam");
          beam.style.animationDelay = `${i * 0.2}s`;
          beam.style.left = `${20 + i * 15}%`;
          spawnEffect.appendChild(beam);
        }

        // Position on map
        const updatePosition = () => {
          const point = map.latLngToLayerPoint(effect.position);
          spawnEffect.style.left = `${point.x - 100}px`;
          spawnEffect.style.top = `${point.y - 100}px`;
        };

        map.getPane("overlayPane").appendChild(spawnEffect);
        updatePosition();
        map.on("zoom viewreset move", updatePosition);

        effectElements.push({ element: spawnEffect, updatePosition });
        console.log(`✅ Spawn effect DOM created and positioned`);
      } else if (effect.type === "dispel") {
        // Create dispel effect
        const dispelEffect = L.DomUtil.create("div", "summon-dispel-effect");

        // Fading circle
        const circle = L.DomUtil.create("div", "dispel-circle");
        dispelEffect.appendChild(circle);

        // Smoke particles
        for (let i = 0; i < 15; i++) {
          const smoke = L.DomUtil.create("div", "smoke-particle");
          smoke.style.animationDelay = `${Math.random() * 0.3}s`;
          smoke.style.left = `${30 + Math.random() * 40}%`;
          smoke.appendChild(L.DomUtil.create("div", "smoke-inner"));
          dispelEffect.appendChild(smoke);
        }

        // Fading light
        const fadeLight = L.DomUtil.create("div", "fade-light");
        dispelEffect.appendChild(fadeLight);

        // Sparkles
        for (let i = 0; i < 10; i++) {
          const sparkle = L.DomUtil.create("div", "dispel-sparkle");
          sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
          sparkle.style.left = `${Math.random() * 100}%`;
          sparkle.style.top = `${Math.random() * 100}%`;
          dispelEffect.appendChild(sparkle);
        }

        // Position on map
        const updatePosition = () => {
          const point = map.latLngToLayerPoint(effect.position);
          dispelEffect.style.left = `${point.x - 100}px`;
          dispelEffect.style.top = `${point.y - 100}px`;
        };

        map.getPane("overlayPane").appendChild(dispelEffect);
        updatePosition();
        map.on("zoom viewreset move", updatePosition);

        effectElements.push({ element: dispelEffect, updatePosition });
        console.log(`✅ Dispel effect DOM created and positioned`);
      }
    });

    // Cleanup
    return () => {
      effectElements.forEach(({ element, updatePosition }) => {
        map.off("zoom viewreset move", updatePosition);
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [map, activeEffects]);

  return null;
};
