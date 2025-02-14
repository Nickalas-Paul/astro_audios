import React, { useState } from "react";
import { getBirthChart } from "./astroService";

const BirthInputForm = ({ onChartGenerated }) => {
  const [birthData, setBirthData] = useState({
    dateOfBirth: "",
    timeOfBirth: "",
    birthplace: "",
  });

  const handleChange = (e) => {
    setBirthData({ ...birthData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chartData = await getBirthChart(birthData);
    if (chartData) {
      onChartGenerated(chartData); // Send data to the parent component
    } else {
      alert("Failed to fetch birth chart. Check your API key or input.");
    }
  };

  return (
    <div className="birth-form-container">
      <h2>Enter Your Birth Details</h2>
      <form onSubmit={handleSubmit}>
        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" onChange={handleChange} required />

        <label>Time of Birth:</label>
        <input type="time" name="timeOfBirth" onChange={handleChange} required />

        <label>Birthplace:</label>
        <input type="text" name="birthplace" placeholder="City, Country" onChange={handleChange} required />

        <button type="submit">Generate Chart</button>
      </form>
    </div>
  );
};

export default BirthInputForm;
