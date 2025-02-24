require('dotenv').config();
const axios = require('axios');

// Step 1: Fetch Access Token (Passing Credentials in POST Body)
const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://api.prokerala.com/token',
            new URLSearchParams({  // Correct way to send data in the request body
                grant_type: 'client_credentials',
                client_id: process.env.PROKERALA_CLIENT_ID,
                client_secret: process.env.PROKERALA_SECRET
            }).toString(), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Required for form data
                }
            }
        );

        console.log("✅ Authentication Successful!");
        console.log("🔑 Access Token:", response.data.access_token);
        console.log("⏳ Expires in:", response.data.expires_in, "seconds");

        return response.data.access_token; // Return the token for use in API calls
    } catch (error) {
        console.error("❌ Error fetching Prokerala token:", error.response?.data || error.message);
        throw new Error("Failed to retrieve access token.");
    }
};

// Step 2: Use Access Token to Make API Call
const fetchAstrologyData = async () => {
    try {
        const token = await getAccessToken(); // Get a valid token first

        const response = await axios.get('https://api.prokerala.com/v2/astrology/kundli', {
            params: {
                datetime: '1990-05-15T14:30:00+00:00', // Ensure UTC format with timezone
                ayanamsa: 1, // Required parameter (1 = Lahiri, 3 = Raman, 5 = Krishnamurti)
                coordinates: '40.71,-74.00' // Correct format (latitude,longitude as string)
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("✅ Astrology Data Retrieved Successfully!");
        console.log("🔄 Astrology Data:", response.data);
    } catch (error) {
        console.error("❌ Error fetching astrology data:", error.response?.data || error.message);
    }
};
fetchAstrologyData();
