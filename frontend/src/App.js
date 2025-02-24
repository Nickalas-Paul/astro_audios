import React, { useState } from "react";
import AstroWheel from "./components/AstroWheel";
import "../styles/AstroWheel.css";

function App() {
  // State for user input
  const [birthData, setBirthData] = useState({
    date: "",
    time: "",
    location: "",
  });

  // State for API response and errors
  const [astroData, setAstroData] = useState(null);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);

  // Define backend URL using environment variable or default to localhost
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Convert location to latitude & longitude
  const getCoordinates = async (location) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/geocode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error(`Geocode API error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📍 Retrieved Coordinates:", data.latitude, data.longitude);
      return { latitude: data.latitude, longitude: data.longitude };
    } catch (error) {
      throw new Error(`Geocoding Error: ${error.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAstroData(null);

    try {
      const datetime = new Date(`${birthData.date}T${birthData.time}:00`).toISOString();
      console.log("📅 Formatted Datetime:", datetime);

      const { latitude, longitude } = await getCoordinates(birthData.location);

      const astroResponse = await fetch(`${BACKEND_URL}/api/astrology`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime, latitude, longitude, ayanamsa: 1 }),
      });

      if (!astroResponse.ok) {
        throw new Error(`Astrology API error! Status: ${astroResponse.status}`);
      }

      const data = await astroResponse.json();
      console.log("🔮 Astrology Data:", data);
      setAstroData(data);
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.message.includes("Geocode")) {
        errorMessage = "Geocoding failed. Please check the location.";
      } else if (error.message.includes("Astrology")) {
        errorMessage = "Astrology API request failed. Please try again later.";
      }
      setError(errorMessage);
      console.error("❌ Request Failed:", error);
    }
  };

  // Generate test chart data
  const generateTestChart = () => {
    setChartData({
      planets: [
        { name: "Sun", position: 15 },
        { name: "Moon", position: 45 },
      ],
    });
  };

  return (
    <div>
      <h1>Astrology Data Generator</h1>
      <form onSubmit={handleSubmit}>
  <label htmlFor="date">Date of Birth:</label>
  <input type="date" name="date" id="date" value={birthData.date} onChange={handleChange} required />

  <label htmlFor="time">Time of Birth:</label>
  <input type="time" name="time" id="time" value={birthData.time} onChange={handleChange} required />

  <label htmlFor="location">Location:</label>
  <input type="text" name="location" id="location" value={birthData.location} onChange={handleChange} required />

  <button type="submit">Get Astrology Data</button>
</form>


      {error && <p style={{ color: "red" }}>{error}</p>}

      {astroData && (
        <div>
          <h2>Astrology Data:</h2>
          <pre>{JSON.stringify(astroData, null, 2)}</pre>
        </div>
      )}

      <button onClick={generateTestChart}>Generate Chart</button>
      <AstroWheel userChartData={chartData} />
    </div>
  );
}

export default App;
