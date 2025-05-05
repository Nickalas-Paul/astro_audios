const BACKEND_URL = "https://YOUR-RENDER-URL.onrender.com";  // <-- update with your actual Render URL

export const fetchAstroData = async (birthData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/astro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthData })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Network response was not ok');
    return data;
  } catch (error) {
    console.error('Error fetching astro data:', error.message);
    return null;
  }
};
