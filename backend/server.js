require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getAccessToken } = require('./prokeralaAuth'); // Import Prokerala token handler
const axios = require('axios');

const app = express();

// ✅ Improved CORS Configuration
const corsOptions = {
    origin: ["http://localhost:3000", "https://fuzzy-adventure-j7547v5qpjpcqj9r-3001.app.github.dev"], // Adjust for your environment
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
};
app.use(cors(corsOptions));

app.use(express.json());

console.log("🔍 GOOGLE_GEOCODING_API_KEY:", process.env.GOOGLE_GEOCODING_API_KEY);

// ✅ TEST ROUTE: Check if the backend is responding correctly
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working! ✅' });
});

// ✅ PROXY SERVER ROUTE for Secure API Calls
app.post('/api/proxy', async (req, res) => {
    try {
        const { apiUrl, params } = req.body;

        if (!apiUrl) {
            return res.status(400).json({ error: 'Missing API URL' });
        }

        // Define headers
        const headers = {
            'Content-Type': 'application/json',
        };

        // Handle API requests securely
        const response = await axios.get(apiUrl, {
            params,
            headers,
        });

        res.json(response.data);
    } catch (error) {
        console.error('❌ Proxy Server Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ NEW API Route for Geocoding
app.post('/api/geocode', async (req, res) => {
    try {
        const { location } = req.body;
        if (!location) {
            return res.status(400).json({ error: 'Missing location parameter' });
        }

        const GOOGLE_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;
        if (!GOOGLE_API_KEY) {
            return res.status(500).json({ error: 'Google API key is missing in the .env file' });
        }

        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`;
        
        const response = await axios.get(geoUrl);

        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding error: ${response.data.status}`);
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        res.json({ latitude: lat, longitude: lng });

    } catch (error) {
        console.error('❌ Geocoding Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ API Route for Fetching Astrology Data
app.post('/api/astrology', async (req, res) => {
    try {
        const { datetime, latitude, longitude, ayanamsa } = req.body;

        // Ensure datetime is correctly formatted with timezone
        const formattedDatetime = new Date(datetime).toISOString();
        console.log('📅 Formatted Datetime:', formattedDatetime);

        if (!datetime || !latitude || !longitude || !ayanamsa) {
            return res.status(400).json({ error: 'Missing required parameters: datetime, latitude, longitude, ayanamsa' });
        }

        console.log('ℹ️ Request received:', { datetime, latitude, longitude, ayanamsa });

        // Get valid API token
        const token = await getAccessToken();
        console.log('✅ Prokerala Token Retrieved:', token);

        // Make the astrology API request
        const response = await axios.get('https://api.prokerala.com/v2/astrology/kundli', {
            params: {
                datetime: formattedDatetime,  
                ayanamsa,
                coordinates: `${latitude},${longitude}`
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ Astrology API Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error fetching astrology data:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || 'Internal server error' });
    }
});

// ✅ Express Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start the server with EADDRINUSE Handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is in use. Trying another...`);
        app.listen(0, () => {
            console.log(`✅ Server started on an available port.`);
        });
    } else {
        console.error(`❌ Server error: ${err.message}`);
    }
    console.log("🔍 API Key Loaded:", process.env.GOOGLE_GEOCODING_API_KEY);
});
