'use client';

import React from 'react';

const ChristmasGarland = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  return (
    <div className="christmas-garland">
      <div className="christmas-garland-light">
        <ul>
          {Array.from({ length: 40 }).map((_, i) => (
            <li
              key={i}
              style={{
                left: `${(i * 2.5)}%`,
                backgroundColor: colors[i % colors.length],
              }}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChristmasGarland;
