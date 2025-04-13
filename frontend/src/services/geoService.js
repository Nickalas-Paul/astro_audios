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
