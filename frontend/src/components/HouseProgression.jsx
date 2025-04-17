import React from 'react';

const HouseProgression = ({ activeHouse, setActiveHouse }) => {
  const handleNext = () => {
    setActiveHouse((prev) => (prev < 12 ? prev + 1 : 1));
  };

  const handlePrevious = () => {
    setActiveHouse((prev) => (prev > 1 ? prev - 1 : 12));
  };

  return (
    <div className="house-progression">
      <h4>Navigate Houses</h4>
      <p>Active House: {activeHouse || '—'}</p>
      <div className="progression-controls">
        <button onClick={handlePrevious} disabled={!activeHouse}>⟵ Previous</button>
        <button onClick={handleNext} disabled={!activeHouse}>Next ⟶</button>
      </div>
    </div>
  );
};

export default HouseProgression;
