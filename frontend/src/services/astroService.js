// frontend/src/services/astroService.js

// Use an env var in dev, or fall back to your Render URL
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://astro-audios.onrender.com";

/**
 * Fetch the raw astrological chart data
 * @param {{ date: string, time: string, lat: number, lon: number }} birthData
 */
export async function fetchAstroData(birthData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/astro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(birthData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch astro data");
    }
    return data;
  } catch (err) {
    console.error("Error in fetchAstroData:", err);
    throw err;
  }
}

/**
 * Fetch the AI‐generated music profile (notes per house)
 * @param {{ date: string, time: string, lat: number, lon: number }} birthData
 */
export async function fetchMusicProfile(birthData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/music-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(birthData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch music profile");
    }
    return data;
  } catch (err) {
    console.error("Error in fetchMusicProfile:", err);
    throw err;
  }
}
