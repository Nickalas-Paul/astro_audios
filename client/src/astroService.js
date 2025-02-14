import axios from "axios";

// Prokerala OAuth Credentials
const CLIENT_ID = "85400dde-a3d3-4bdc-9e30-ecf1ad721f0c"; // Replace with your Prokerala Client ID
const CLIENT_SECRET = "WnfIZCSRqQIwUUpdOuYSgGLYgIARWojYhxZw6NIZ"; // Replace with your Prokerala Client Secret
const TOKEN_URL = "https://api.prokerala.com/token"; // OAuth Token Endpoint
const API_BASE_URL = "https://api.prokerala.com/"; // Base URL for API requests

// Google Maps Geolocation API
const GEOCODE_API_KEY = "AIzaSyBQy3P-tZ2T_c2bKBrZ0CgRd2jnV5D113U"; // Replace with your Google Maps API Key
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// Function to Obtain OAuth Access Token from Prokerala
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Access Token:", response.data.access_token); // Debugging log
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    return null;
  }
};

// Function to Get Latitude & Longitude from City/Country using Google Maps API
const getCoordinates = async (location) => {
  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        address: location,
        key: GEOCODE_API_KEY,
      },
    });

    if (response.data.status !== "OK" || response.data.results.length === 0) {
      throw new Error("Location not found.");
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    console.log(`Coordinates for ${location}: Lat ${lat}, Lng ${lng}`); // Debugging log
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error("Error fetching coordinates:", error.response?.data || error.message);
    return { latitude: 0, longitude: 0 }; // Default to (0,0) if lookup fails
  }
};

// Function to Fetch Birth Chart Data from Prokerala API
export const getBirthChart = async (birthData) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error("Failed to retrieve access token.");
    return null;
  }

  // Get latitude & longitude automatically
  const { latitude, longitude } = await getCoordinates(birthData.birthplace);

  console.log("Final API Request:", {
    latitude,
    longitude,
    datetime: `${birthData.dateOfBirth}T${birthData.timeOfBirth}:00`,
  });

  try {
    const response = await axios.post(
      `${API_BASE_URL}v2/astrology/natal-chart`,
      {
        datetime: `${birthData.dateOfBirth}T${birthData.timeOfBirth}:00`,
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error fetching birth chart:", error.response?.data || error.message);
    return null;
  }
};
