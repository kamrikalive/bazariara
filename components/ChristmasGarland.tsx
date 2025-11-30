'use client';
import React, { useEffect, useState } from 'react';

const ChristmasGarland = () => {
    const [lights, setLights] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        const lightElements: React.CSSProperties[] = [];
        const colors = ['#fbbd05', '#34a853', '#ea4335', '#4285f4', '#ffffff'];
        const lightCount = Math.floor(window.innerWidth / 35);

        for (let i = 0; i < lightCount; i++) {
            const color = colors[i % colors.length];
            const animationDelay = `${(i * 2) / lightCount}s`;
            const left = `${i * 35}px`;

            lightElements.push({
                background: color,
                animationDelay,
                left,
                boxShadow: `0 0 15px ${color}, 0 0 25px ${color}`
            });
        }
        setLights(lightElements);
    }, []);

    return (
        <div className="christmas-garland">
            <div className="christmas-garland-light">
                <ul>
                    {lights.map((style, index) => (
                        <li key={index} style={style}></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChristmasGarland;
