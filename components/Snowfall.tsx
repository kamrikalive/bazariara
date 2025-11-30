'use client';

import { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; animationDuration: string; }>>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const newSnowflakes = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 5 + 5}s`,
      }));
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-fall"
          style={{
            left: flake.left,
            width: '5px',
            height: '5px',
            animationDuration: flake.animationDuration,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snowfall;
