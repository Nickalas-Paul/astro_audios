import React from 'react';

function AstroWheel({ chartData, highlightedHouse }) {
    const wheelSize = 300;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const radius = wheelSize / 2 - 20;

    const houses = Array.from({ length: 12 }, (_, i) => i + 1);
    const planets = chartData ? chartData.planets : [];

    return (
        <svg width={wheelSize} height={wheelSize}>
            {/* Circle for the wheel */}
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="black" strokeWidth="2" />

            {/* House divisions */}
            {houses.map((house, index) => {
                const angle = (index / 12) * 360;
                const x1 = centerX + radius * Math.cos((angle * Math.PI) / 180);
                const y1 = centerY + radius * Math.sin((angle * Math.PI) / 180);
                const x2 = centerX + (radius + 10) * Math.cos((angle * Math.PI) / 180);
                const y2 = centerY + (radius + 10) * Math.sin((angle * Math.PI) / 180);
                return (
                    <g key={index}>
                        <line x1={centerX} y1={centerY} x2={x1} y2={y1} stroke="gray" strokeWidth="1" />
                        {/* Highlighted house */}
                        {highlightedHouse === house && (
                            <circle cx={centerX} cy={centerY} r={radius + 5} fill="rgba(255, 255, 0, 0.2)" />
                        )}
                    </g>
                );
            })}

            {/* Planet placements */}
            {planets && planets.map((planet, index) => {
                const angle = (index / 12) * 360;
                const x = centerX + (radius - 30) * Math.cos((angle * Math.PI) / 180);
                const y = centerY + (radius - 30) * Math.sin((angle * Math.PI) / 180);
                return (
                    <circle key={index} cx={x} cy={y} r="5" fill="red" />
                );
            })}
        </svg>
    );
}

export default AstroWheel;
