export const fetchAstroData = async (birthData) => {
  try {
    const response = await fetch('https://glowing-orbit-7ww6gjvj6vfr44p-5000.app.github.dev/', {  // Updated URL to use localhost
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(birthData)  // Removed unnecessary object nesting
    });
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    const data = await response.json();
    console.log('Astro data fetched successfully:', data);  // Debugging line
    return data;
  } catch (error) {
    console.error('Error fetching astro data:', error.message);
    return { status: "error", message: error.message };
  }
};
