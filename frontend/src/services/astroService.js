// src/services/astroService.js

const BACKEND_URL = "https://astro-audios.onrender.com"; // <-- your real backend URL

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

// Optional: Comment out or fix fetchMusicProfile if you don't have /api/music-profile yet
export const fetchMusicProfile = async (chartData) => {
  console.warn("fetchMusicProfile is not implemented yet.");
  return null;
};
