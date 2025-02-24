require('dotenv').config();
const axios = require('axios');

let accessToken = null;
let tokenExpiry = 0;

const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpiry) {
        console.log("🔄 Using Cached Access Token");
        return accessToken; // Reuse existing token if it's still valid
    }

    try {
        const response = await axios.post(
            'https://api.prokerala.com/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.PROKERALA_CLIENT_ID,
                client_secret: process.env.PROKERALA_SECRET
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

        console.log("✅ New Access Token Retrieved!");
        return accessToken;
    } catch (error) {
        console.error("❌ Error fetching Prokerala token:", error.response?.data || error.message);
        throw new Error("Failed to retrieve access token.");
    }
};

module.exports = { getAccessToken };
