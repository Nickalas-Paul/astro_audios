import React from 'react';

const ChartWheel = ({
  setActiveHouse,
  activeHouse,
  planets = [],
  signs = [],
  previewMode = false,
  triggeredHouse = null
}) => {
  const radius = 120;
  const center = 150;
  const sectorAngle = 360 / 12;

  const signGlyphMap = {
    Aries: "♈︎", Taurus: "♉︎", Gemini: "♊︎", Cancer: "♋︎",
    Leo: "♌︎", Virgo: "♍︎", Libra: "♎︎", Scorpio: "♏︎",
    Sagittarius: "♐︎", Capricorn: "♑︎", Aquarius: "♒︎", Pisces: "♓︎"
  };

  const signColorMap = {
    Aries: "#FF6347", Taurus: "#90EE90", Gemini: "#FFD700", Cancer: "#ADD8E6",
    Leo: "#FFA500", Virgo: "#DAA520", Libra: "#FFC0CB", Scorpio: "#8A2BE2",
    Sagittarius: "#4682B4", Capricorn: "#A0522D", Aquarius: "#00CED1", Pisces: "#9370DB"
  };

  const sectors = Array.from({ length: 12 }, (_, i) => {
    const startAngle = i * sectorAngle;
    const endAngle = startAngle + sectorAngle;

    const x1 = center + radius * Math.cos((Math.PI / 180) * startAngle);
    const y1 = center + radius * Math.sin((Math.PI / 180) * startAngle);
    const x2 = center + radius * Math.cos((Math.PI / 180) * endAngle);
    const y2 = center + radius * Math.sin((Math.PI / 180) * endAngle);

    const largeArcFlag = sectorAngle > 180 ? 1 : 0;
    const pathData = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    const houseSign = signs[i];
    const glowColor = signColorMap[houseSign] || "#ffd700";
    const isActive = activeHouse === i + 1;
    const isTriggered = triggeredHouse === i + 1;

    return (
      <path
        key={i}
        d={pathData}
        fill={previewMode ? "#1a1a1a" : isActive ? glowColor : "#242424"}
        stroke="#888"
        strokeWidth="1"
        onClick={() => !previewMode && setActiveHouse(i + 1)}
        cursor={previewMode ? "default" : "pointer"}
        className={`sector glow ${isActive ? "active" : ""} ${isTriggered ? "house-active-hit" : ""}`}
        style={{
          filter: !previewMode ? `drop-shadow(0 0 6px ${glowColor})` : "none",
          transition: 'fill 0.3s ease, filter 0.3s ease'
        }}
      />
    );
  });

  const houseLabels = Array.from({ length: 12 }, (_, i) => {
    const angle = (i + 0.5) * sectorAngle;
    const labelRadius = radius * 0.85;
    const x = center + labelRadius * Math.cos((Math.PI / 180) * angle);
    const y = center + labelRadius * Math.sin((Math.PI / 180) * angle);

    return (
      <text
        key={`label-${i}`}
        x={x}
        y={y}
        fill={previewMode ? "#555" : "#fff"}
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {i + 1}
      </text>
    );
  });

  const signLabels = !previewMode
    ? signs.map((sign, i) => {
        const angle = (i + 0.5) * sectorAngle;
        const labelRadius = radius * 0.95;
        const x = center + labelRadius * Math.cos((Math.PI / 180) * angle);
        const y = center + labelRadius * Math.sin((Math.PI / 180) * angle);

        return (
          <text
            key={`sign-${i}`}
            x={x}
            y={y}
            fill="#888"
            fontSize="14"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {signGlyphMap[sign] || sign}
          </text>
        );
      })
    : null;

  const planetMarkers = !previewMode
    ? planets.map((planet) => {
        const angle = ((planet.house - 1) + 0.5) * sectorAngle;
        const r = radius * 0.5;
        const x = center + r * Math.cos((Math.PI / 180) * angle);
        const y = center + r * Math.sin((Math.PI / 180) * angle);

        return (
          <text
            key={planet.name}
            x={x}
            y={y}
            fontSize="14"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#fff"
          >
            {planet.icon || planet.name}
          </text>
        );
      })
    : null;

  return (
    <div className="chart-wheel">
      <svg width="300" height="300">
        {sectors}
        {houseLabels}
        {signLabels}
        {planetMarkers}
      </svg>
    </div>
  );
};

export default ChartWheel;
