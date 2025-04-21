export const fetchGeolocation = async (location) => {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/geolocate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return null;
  }
};
export const geocodeLocation = async (locationName) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const encodedLocation = encodeURIComponent(locationName);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      const addressComponents = data.results[0].address_components;

      let city = '';
      let state = '';
      let country = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      });

      return {
        latitude: lat,
        longitude: lng,
        city,
        state,
        country
      };
    } else {
      throw new Error(data.error_message || "Location not found");
    }
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};

