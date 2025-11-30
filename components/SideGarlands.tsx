'use client';
import React from 'react';

const SideGarlands = () => {
  const colors = ['#fbbd05', '#34a853', '#ea4335', '#4285f4', '#ffffff'];
  const lightCount = 15; // Количество огоньков в каждой боковой гирлянде

  return (
    <>
      {/* --- Левая гирлянда --- */}
      <div className="side-garland left">
        <ul>
          {Array.from({ length: lightCount }).map((_, i) => {
            const color = colors[i % colors.length];
            const animationDelay = `${Math.random() * 3}s`;
            return (
              <li key={`left-${i}`} style={{ 
                  background: color, 
                  animationDelay, 
                  boxShadow: `0 0 12px ${color}, 0 0 20px ${color}` 
                }} />
            );
          })}
        </ul>
      </div>

      {/* --- Правая гирлянда --- */}
      <div className="side-garland right">
        <ul>
          {Array.from({ length: lightCount }).map((_, i) => {
            const color = colors[i % colors.length];
            const animationDelay = `${Math.random() * 3}s`;
            return (
              <li key={`right-${i}`} style={{ 
                  background: color, 
                  animationDelay, 
                  boxShadow: `0 0 12px ${color}, 0 0 20px ${color}` 
                }} />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SideGarlands;
