import { useState, useEffect } from "react";

export default function EmberAnimation({ count = 20 }) {
  const [embers, setEmbers] = useState([]);

  useEffect(() => {
    const generatedEmbers = [...Array(count)].map((_, i) => {
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 5;
      const color = `rgb(255, ${Math.floor(Math.random() * 100 + 150)}, 0)`;
      return (
        <span
          key={i}
          className="absolute rounded-full opacity-0 animate-rise"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: `0px`,
            backgroundColor: color,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
    setEmbers(generatedEmbers);
  }, [count]);

  return <>{embers}</>;
}
