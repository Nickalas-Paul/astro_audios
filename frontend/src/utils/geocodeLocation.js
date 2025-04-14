export const geocodeLocation = async (locationName) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
    const encodedLocation = encodeURIComponent(locationName);
  
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedLocation}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error.message);
      return null;
    }
  };
  