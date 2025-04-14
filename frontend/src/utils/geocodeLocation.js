export const geocodeLocation = async (locationName) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const encodedLocation = encodeURIComponent(locationName);
  
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error(data.error_message || "Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error.message);
      return null;
    }
  };
  