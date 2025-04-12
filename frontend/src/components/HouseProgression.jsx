import React, { useState, useEffect, useRef } from 'react';

const HouseProgression = ({ setActiveHouse }) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(1);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentHouse(prevHouse => {
          const nextHouse = prevHouse < 12 ? prevHouse + 1 : 1;
          setActiveHouse(nextHouse);
          return nextHouse;
        });
      }, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, setActiveHouse]);

  return (
    <div className="house-progression">
      <button onClick={isAutoPlaying ? stopAutoPlay : startAutoPlay}>
        {isAutoPlaying ? "Stop Auto Play" : "Play Full Chart"}
      </button>
    </div>
  );
};

export default HouseProgression;
