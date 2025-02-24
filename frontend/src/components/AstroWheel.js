import React from "react";
import "../styles/AstroWheel.css";  // ✅ CORRECT


const AstroWheel = () => {
  return (
    <div className="astro-wheel-container">
      <svg viewBox="0 0 500 500" className="astro-wheel">
        {/* Outer Circle */}
        <circle cx="250" cy="250" r="200" stroke="black" strokeWidth="2" fill="none" />

        {/* House Lines - Dividing the Wheel into 12 Sections */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = 250 + 200 * Math.cos(angle);
          const y = 250 + 200 * Math.sin(angle);
          return <line key={i} x1="250" y1="250" x2={x} y2={y} stroke="gray" />;
        })}
      </svg>
    </div>
  );
};

export default AstroWheel;
