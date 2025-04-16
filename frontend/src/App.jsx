import React, { useState, useEffect } from 'react';
import './App.css'; 
import LandingPage from './components/LandingPage';
import ChartWheel from './components/ChartWheel';
import MusicPlayer from './components/MusicPlayer';
import HouseDetails from './components/HouseDetails';
import HouseProgression from './components/HouseProgression';
import { fetchAstroData } from './services/astroService';
import { convertWesternChartToMusicInput } from './music/chartToMusicInput';
import { mapChartToMusic } from './music/musicMapping';
import { fetchMusicProfile } from './services/astroService';

const zodiacColorMapping = {
  Aries: "#FF6347", Taurus: "#90EE90", Gemini: "#FFD700", Cancer: "#ADD8E6",
  Leo: "#FFA500", Virgo: "#DAA520", Libra: "#FFC0CB", Scorpio: "#8A2BE2",
  Sagittarius: "#4682B4", Capricorn: "#A0522D", Aquarius: "#00CED1", Pisces: "#9370DB"
};
const [musicProfile, setMusicProfile] = useState(null);

// After astroData is set:
useEffect(() => {
  const loadMusicProfile = async () => {
    if (!astroData) return;

    const chart = [];

    // Build the chart from astroData — for now, use mock data:
    chart.push({ planet: "Sun", sign: "Taurus", house: 10 });
    chart.push({ planet: "Moon", sign: "Taurus", house: 10 });
    chart.push({ planet: "Jupiter", sign: "Taurus", house: 10 });
    chart.push({ planet: "Saturn", sign: "Capricorn", house: 5 });
    chart.push({ planet: "Uranus", sign: "Capricorn", house: 5 });
    chart.push({ planet: "Neptune", sign: "Capricorn", house: 5 });
    chart.push({ planet: "Mercury", sign: "Gemini", house: 11 });
    chart.push({ planet: "Venus", sign: "Gemini", house: 11 });
    chart.push({ planet: "Mars", sign: "Aquarius", house: 7 });
    chart.push({ planet: "None", sign: "Leo", house: 1 });
    chart.push({ planet: "None", sign: "Libra", house: 3 });
    chart.push({ planet: "None", sign: "Scorpio", house: 4 });

    const profile = await fetchMusicProfile(chart);
    setMusicProfile(profile);
  };

  loadMusicProfile();
}, [astroData]);
{musicProfile && (
  <div className="music-profile-display">
    <h3>Your Astro Audio Profile</h3>
    <ul>
      {musicProfile.map((entry, idx) => (
        <li key={idx}>
          <strong>House {entry.house}</strong> in <em>{entry.sign}</em>
          {entry.planet && <> — {entry.planet}</>}
          <ul>
            <li>Theme: {entry.theme}</li>
            <li>Mood: {entry.mood}</li>
            <li>Instrument: {entry.instrument}</li>
            <li>Scale: {entry.scale}</li>
            <li>Rhythm: {entry.rhythm}</li>
          </ul>
        </li>
      ))}
    </ul>
  </div>
)}

function App() {
  const [activeHouse, setActiveHouse] = useState(null);
  const [birthData, setBirthData] = useState(null);
  const [astroData, setAstroData] = useState(null);
  const [musicPlan, setMusicPlan] = useState(null);
  const [chartPlanets, setChartPlanets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [triggeredHouse, setTriggeredHouse] = useState(null);

  const planetIconMap = {
    Sun: "☉", Moon: "☽", Mars: "♂", Venus: "♀", Mercury: "☿",
    Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇"
  };

  const romanToHouse = {
    I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6,
    VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12
  };

  const handleBirthDataSubmit = async (data) => {
    setBirthData(data);
    setAstroData(null);
    setActiveHouse(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetchAstroData(data);
      if (response && response.status === "ok") {
        setAstroData(response);
        const musicInput = convertWesternChartToMusicInput(response.western);
        const generatedPlan = mapChartToMusic(musicInput);
        setMusicPlan(generatedPlan);

        const simplifiedPlanets = musicInput.planets.map((p) => ({
          name: p.name,
          icon: planetIconMap[p.name] || p.name[0],
          house: romanToHouse[p.house] || 1
        }));
        setChartPlanets(simplifiedPlanets);
      } else {
        setErrorMessage(`Error: ${response?.message || 'Failed to fetch astrological data.'}`);
      }
    } catch (error) {
      setErrorMessage(`Network or fetch error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBirthData(null);
    setAstroData(null);
    setMusicPlan(null);
    setChartPlanets([]);
    setActiveHouse(null);
    setTriggeredHouse(null);
    setErrorMessage(null);
    setIsLoading(false);
    document.body.style.backgroundColor = '#242424';
  };

  useEffect(() => {
    let bgColor = '#242424';
    if (astroData?.western?.chandra_rasi) {
      const sign = astroData.western.chandra_rasi;
      bgColor = zodiacColorMapping[sign] || '#242424';
    }
    document.body.style.backgroundColor = bgColor;
  }, [astroData]);

  return (
    <div className="App">
      {!birthData && !isLoading && !astroData && (
        <LandingPage onSubmitBirthData={handleBirthDataSubmit} />
      )}

      {isLoading && (
        <div className="loading-indicator">Generating Chart & Music...</div>
      )}

      {errorMessage && !isLoading && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}

      {astroData && !isLoading && (
        <>
          {birthData && (
            <div className="birth-data-summary">
              <p>Chart for: {birthData.date}, {birthData.time}, {birthData.location}</p>
              <button onClick={handleReset}>Generate New Chart</button>
            </div>
          )}
<MusicPlayer activeHouse={activeHouse} musicProfile={musicProfile} />

          <div className="main-content-area">
            <div className="interactive-area">
              <ChartWheel
                setActiveHouse={setActiveHouse}
                activeHouse={activeHouse}
                planets={chartPlanets}
                signs={astroData.western?.signs || []}
                previewMode={!astroData}
                triggeredHouse={triggeredHouse}
              />
              <HouseProgression setActiveHouse={setActiveHouse} />
              <MusicPlayer
                activeHouse={activeHouse}
                musicPlan={musicPlan}
                setTriggeredHouse={setTriggeredHouse}
              />
            </div>
            <div className="details-area">
              <HouseDetails activeHouse={activeHouse} astroData={astroData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
<MusicPlayer musicProfile={musicProfile} />

export default App;
