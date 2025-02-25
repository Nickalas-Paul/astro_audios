import React, { useState, useEffect } from "react";
import AstroWheel from "./components/AstroWheel";
import AudioPlayer from "./components/AudioPlayer";
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
    const [houseHighlight, setHouseHighlight] = useState(1); // Start with the first house

    // Define backend URL using environment variable or default to localhost
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    // Music Mapping (Rule-Based System)
    const musicMap = {
        'Sun in Aries': '/music/sun_aries.mp3',
        'Moon in Cancer': '/music/moon_cancer.mp3',
        'Venus in Libra': '/music/venus_libra.mp3',
        // ... more mappings
    };
    const [currentTrack, setCurrentTrack] = useState(null)

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

    // Function to Parse Astrology Data and Trigger Music
    useEffect(() => {
        if (astroData) {
            // 1. Parse Astrology Data (adjust based on the API response structure)
            const planets = astroData.planets.map(planet => ({
                name: planet.name,
                sign: planet.sign,
                house: planet.house // Assuming the API provides house information
            }));
            // Create a new chartData object that AstroWheel can use
            const chartData = { planets: planets };

            // 2. Set Chart Data for AstroWheel
            setChartData(chartData);

            // 3. Trigger Music (Example: Based on the first planet)
            if (planets.length > 0) {
                const firstPlanet = planets[0].name + ' in ' + planets[0].sign;
                const trackUrl = musicMap[firstPlanet];
                if (trackUrl) {
                    setCurrentTrack(trackUrl);
                }
            }

            // Start House Highlighting
            const intervalId = setInterval(() => {
                setHouseHighlight((prevHouse) => (prevHouse % 12) + 1); // Cycle through houses 1-12
            }, 5000); // Adjust timing as needed

            // Clean up interval on unmount or when astroData changes
            return () => clearInterval(intervalId);
        }
    }, [astroData, musicMap]);

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

            {chartData && <AstroWheel chartData={chartData} highlightedHouse={houseHighlight} />}
            <AudioPlayer trackUrl={currentTrack} />
        </div>
    );
}

export default App;
