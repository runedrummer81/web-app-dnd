import L from "leaflet";

export const createGoldenMarker = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: 80px; height: 100px;">
        <!-- Massive outer glow pulse -->
        <div style="
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(217,202,137,0.7) 30%, rgba(191,136,60,0.5) 50%, transparent 70%);
          border-radius: 50%;
          animation: mega-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(255,215,0,0.8);
        "></div>

        <!-- Bright beam of light shooting up -->
        <div style="
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 80px;
          background: linear-gradient(to top, rgba(255,215,0,0.9), rgba(255,215,0,0.3), transparent);
          box-shadow: 0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,215,0,0.6);
          animation: beam-pulse 2s ease-in-out infinite;
        "></div>

        <!-- Ground rune circle - BRIGHTER -->
        <svg style="
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          opacity: 0.9;
          filter: drop-shadow(0 0 8px rgba(255,215,0,0.8));
          animation: rune-rotate 20s linear infinite;
        " viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#FFD700" stroke-width="4" opacity="0.8"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FFF" stroke-width="2" opacity="0.7"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#BF883C" stroke-width="3" opacity="0.6" stroke-dasharray="10,5"/>
          <!-- Brighter rune symbols -->
          <text x="50" y="32" font-size="24" fill="#FFD700" text-anchor="middle" font-family="serif" font-weight="bold">⚔</text>
          <text x="73" y="57" font-size="18" fill="#FFF" text-anchor="middle" font-family="serif">✦</text>
          <text x="27" y="57" font-size="18" fill="#FFF" text-anchor="middle" font-family="serif">✦</text>
          <text x="50" y="78" font-size="18" fill="#FFD700" text-anchor="middle" font-family="serif">✦</text>
        </svg>

        <!-- Main beacon crystal - BIGGER and BRIGHTER -->
        <svg style="
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          filter: drop-shadow(0 0 20px rgba(255,215,0,1)) 
                  drop-shadow(0 0 40px rgba(255,215,0,0.6)) 
                  drop-shadow(0 8px 16px rgba(0,0,0,0.8));
        " width="40" height="55" viewBox="0 0 40 55">
          <!-- Dark outline for contrast -->
          <polygon points="20,50 10,44 10,18 20,12 30,18 30,44" 
            fill="none" 
            stroke="#000" 
            stroke-width="3"/>
          
          <!-- Crystal base - BRIGHTER -->
          <polygon points="20,50 10,44 10,18 20,12 30,18 30,44" 
            fill="url(#crystalGradientBright)" 
            stroke="#5D4E1A" 
            stroke-width="2"/>
          
          <!-- Crystal top facet - BRIGHTER -->
          <polygon points="20,12 10,18 20,5 30,18" 
            fill="url(#crystalTopGradientBright)" 
            stroke="#5D4E1A" 
            stroke-width="2"/>
          
          <!-- Bright light rays inside -->
          <line x1="20" y1="12" x2="20" y2="44" stroke="#FFD700" stroke-width="2" opacity="0.9"/>
          <line x1="14" y1="18" x2="14" y2="38" stroke="#FFF" stroke-width="1.5" opacity="0.7"/>
          <line x1="26" y1="18" x2="26" y2="38" stroke="#FFF" stroke-width="1.5" opacity="0.7"/>
          
          <!-- Strong highlight -->
          <polygon points="20,8 16,15 20,14 24,15" 
            fill="rgba(255,255,255,0.95)"/>
          
          <!-- Inner glow -->
          <ellipse cx="20" cy="30" rx="8" ry="12" 
            fill="rgba(255,215,0,0.4)"/>
          
          <!-- Gradients - MUCH BRIGHTER -->
          <defs>
            <linearGradient id="crystalGradientBright" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="30%" style="stop-color:#FFF;stop-opacity:0.8" />
              <stop offset="70%" style="stop-color:#d9ca89;stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:#BF883C;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="crystalTopGradientBright" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FFF;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d9ca89;stop-opacity:0.9" />
            </linearGradient>
          </defs>
        </svg>

        <!-- MEGA top glow orb -->
        <div style="
          position: absolute;
          bottom: 75px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #FFF 0%, #FFD700 40%, transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 30px #FFD700, 
                      0 0 50px rgba(255,215,0,0.8),
                      0 0 70px rgba(255,215,0,0.5);
          animation: orb-mega-pulse 1.5s ease-in-out infinite;
        "></div>

        <!-- More visible magical particles -->
        <div style="
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
          animation: particle-float-1 2.5s ease-in infinite;
        "></div>
        <div style="
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #FFF;
          border-radius: 50%;
          box-shadow: 0 0 10px #FFF, 0 0 20px rgba(255,255,255,0.8);
          animation: particle-float-2 3s ease-in infinite;
        "></div>
        <div style="
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
          animation: particle-float-3 3.5s ease-in infinite;
        "></div>

        <!-- Sparkle effects -->
        <div style="
          position: absolute;
          bottom: 60px;
          left: 30%;
          width: 3px;
          height: 3px;
          background: #FFF;
          border-radius: 50%;
          box-shadow: 0 0 8px #FFF;
          animation: sparkle-1 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          bottom: 65px;
          left: 70%;
          width: 3px;
          height: 3px;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 0 0 8px #FFD700;
          animation: sparkle-2 2.3s ease-in-out infinite;
        "></div>

        <style>
          /* MEGA pulse animation */
          @keyframes mega-pulse {
            0%, 100% { 
              opacity: 0.7; 
              transform: translateX(-50%) scale(1); 
            }
            50% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1.4); 
            }
          }

          /* Beam pulse */
          @keyframes beam-pulse {
            0%, 100% { 
              opacity: 0.6;
              height: 80px;
            }
            50% { 
              opacity: 1;
              height: 100px;
            }
          }

          /* Orb MEGA pulse */
          @keyframes orb-mega-pulse {
            0%, 100% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1); 
              box-shadow: 0 0 30px #FFD700, 0 0 50px rgba(255,215,0,0.8);
            }
            50% { 
              opacity: 0.8; 
              transform: translateX(-50%) scale(1.3); 
              box-shadow: 0 0 50px #FFD700, 0 0 80px rgba(255,215,0,1);
            }
          }

          /* Rune rotation */
          @keyframes rune-rotate {
            from { transform: translateX(-50%) rotate(0deg); }
            to { transform: translateX(-50%) rotate(360deg); }
          }

          /* Floating particles - more visible */
          @keyframes particle-float-1 {
            0% { 
              bottom: 30px; 
              opacity: 1; 
              transform: translateX(-50%) translateY(0); 
            }
            100% { 
              bottom: 90px; 
              opacity: 0; 
              transform: translateX(-42%) translateY(-60px); 
            }
          }

          @keyframes particle-float-2 {
            0% { 
              bottom: 30px; 
              opacity: 1; 
              transform: translateX(-50%) translateY(0); 
            }
            100% { 
              bottom: 90px; 
              opacity: 0; 
              transform: translateX(-58%) translateY(-60px); 
            }
          }

          @keyframes particle-float-3 {
            0% { 
              bottom: 30px; 
              opacity: 1; 
              transform: translateX(-50%) translateY(0); 
            }
            100% { 
              bottom: 85px; 
              opacity: 0; 
              transform: translateX(-50%) translateY(-55px); 
            }
          }

          /* Sparkle effects */
          @keyframes sparkle-1 {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
          }

          @keyframes sparkle-2 {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
          }

          /* Remove default leaflet styling */
          .custom-marker {
            background: transparent !important;
            border: none !important;
          }
        </style>
      </div>
    `,
    iconSize: [80, 100],
    iconAnchor: [40, 85], // Anchor at the base of the crystal
    popupAnchor: [0, -85],
  });
};
