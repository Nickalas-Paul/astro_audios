// src/services/astroService.js

export const fetchAstroData = async (birthData) => {
  try {
    const response = await fetch('http://localhost:5000/api/astro', {
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

export const fetchMusicProfile = async (chartData) => {
  try {
    const response = await fetch('https://astro-audios.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart: chartData })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Network response was not ok');
    return data.profile;
  } catch (error) {
    console.error('Error fetching music profile:', error.message);
    return null;
  }
};
