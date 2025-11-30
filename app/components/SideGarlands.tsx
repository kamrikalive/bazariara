import React from 'react';

const SideGarlands = () => {
  return (
    <>
      <div className="side-garland left">
        {Array.from({ length: 15 }).map((_, i) => (
          <div className="light" key={i}></div>
        ))}
      </div>
      <div className="side-garland right">
        {Array.from({ length: 15 }).map((_, i) => (
          <div className="light" key={i}></div>
        ))}
      </div>
    </>
  );
};

export default SideGarlands;
