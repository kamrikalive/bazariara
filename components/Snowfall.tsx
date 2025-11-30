'use client';

import { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ 
    id: number; 
    left: string; 
    animationDuration: string;
    animationDelay: string;
    size: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const newSnowflakes = Array.from({ length: 200 }, (_, i) => { 
        const size = Math.random() * 4 + 2; 
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 8 + 7}s`, 
          animationDelay: `${Math.random() * 5}s`,
          size: size,
          opacity: Math.random() * 0.5 + 0.3,
        };
      });
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-fall"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            animationIterationCount: 'infinite',
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snowfall;