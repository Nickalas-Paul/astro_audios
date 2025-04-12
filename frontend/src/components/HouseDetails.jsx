import React from 'react';

const HouseDetails = ({ activeHouse, astroData }) => {
  let description = "Select a house from the chart to see details.";

  if (astroData && activeHouse) {
    const houseData = astroData.houses.find((h) => h.house === activeHouse);
    if (houseData) {
      description = houseData.description;
    }
  }

  return (
    <div className="house-details">
      <h3>House {activeHouse || ""} Details</h3>
      <p>{description}</p>
    </div>
  );
};

export default HouseDetails;
