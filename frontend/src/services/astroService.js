// frontend/src/services/astroService.js

export const fetchAstroData = async (birthData) => {
  try {
    const response = await fetch("https://astro-audios.onrender.com/api/astro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ birthData })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch chart data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching astro data:", error.message);
    return { status: "error", message: error.message };
  }
};
