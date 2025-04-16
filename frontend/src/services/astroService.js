export const fetchMusicProfile = async (chartData) => {
  try {
    const response = await fetch('http://localhost:5000/api/music-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chart: chartData })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }

    return data.profile;
  } catch (error) {
    console.error('Error fetching music profile:', error.message);
    return null;
  }
};
