import React, { useState, useEffect } from "react";
import "../styles/AstroWheel.css";

const AstroWheel = ({ userChartData }) => {
  const [wheelData, setWheelData] = useState(null);

  useEffect(() => {
    if (userChartData) {
      setWheelData(userChartData);
    }
  }, [userChartData]);

  return (
    <div className="astro-wheel-container">
      <svg viewBox="0 0 500 500" className="astro-wheel">
        {/* Placeholder for the astrological wheel */}
        <circle cx="250" cy="250" r="200" stroke="gray" strokeWidth="2" fill="none" />
        
        {/* Placeholder for house divisions */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = 250 + 200 * Math.cos(angle);
          const y = 250 + 200 * Math.sin(angle);
          return <line key={i} x1="250" y1="250" x2={x} y2={y} stroke="gray" />;
        })}

        {/* Placeholder for orbs (planets) */}
        {wheelData?.planets?.map((planet, index) => {
          const angle = planet.position * (Math.PI / 180);
          const x = 250 + 180 * Math.cos(angle);
          const y = 250 + 180 * Math.sin(angle);
          return <circle key={index} cx={x} cy={y} r="5" fill="blue" />;
        })}
      </svg>
    </div>
  );
};

export default AstroWheel;
