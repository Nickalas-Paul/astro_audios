import React, { useState } from 'react';

function App() {
    // State for user input
    const [birthData, setBirthData] = useState({
        date: '',
        time: '',
        location: ''
    });

    // State for API response
    const [astroData, setAstroData] = useState(null);
    const [error, setError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBirthData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Convert location to latitude & longitude
    const getCoordinates = async (location) => {
        try {
            const response = await fetch(`http://localhost:5000/api/geocode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ location })
            });

            if (!response.ok) {
                throw new Error(`Geocode API error! Status: ${response.status}`);
            }

            const data = await response.json();
            return { latitude: data.latitude, longitude: data.longitude };
        } catch (error) {
            throw new Error(`Geocoding Error: ${error.message}`);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setAstroData(null); // Reset data before fetching
    
        try {
            // Step 1: Convert birth date & time to ISO 8601 format
            const datetime = new Date(`${birthData.date}T${birthData.time}:00`).toISOString();
            console.log('📅 Formatted Datetime:', datetime);
    
            // Step 2: Get coordinates from backend `/api/geocode`
            const geocodeResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/geocode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: birthData.location })
            });
    
            if (!geocodeResponse.ok) {
                throw new Error(`Geocode error! Status: ${geocodeResponse.status}`);
            }
    
            const { latitude, longitude } = await geocodeResponse.json();
            console.log('📍 Retrieved Coordinates:', latitude, longitude);
    
            // Step 3: Send astrology request with correct data
            const astroResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/astrology`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ datetime, latitude, longitude, ayanamsa: 1 })
            });
    
            if (!astroResponse.ok) {
                throw new Error(`Astrology API error! Status: ${astroResponse.status}`);
            }
    
            const data = await astroResponse.json();
            console.log('🔮 Astrology Data:', data);
            setAstroData(data);
        } catch (error) {
            setError(`Error: ${error.message}`);
            console.error('❌ Request Failed:', error);
        }
    };
    
    return (
        <div>
            <h1>Astrology Data Generator</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="date"
                        value={birthData.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Time of Birth:
                    <input
                        type="time"
                        name="time"
                        value={birthData.time}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={birthData.location}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit">Get Astrology Data</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {astroData && (
                <div>
                    <h2>Astrology Data:</h2>
                    <pre>{JSON.stringify(astroData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
