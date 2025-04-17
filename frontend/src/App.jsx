import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import ChartWheel from './components/ChartWheel';
import MusicPlayer from './components/MusicPlayer';
import HouseDetails from './components/HouseDetails';
import HouseProgression from './components/HouseProgression';
import { fetchAstroData, fetchMusicProfile } from './services/astroService';
import * as Tone from "tone";

function App() {
  const [activeHouse, setActiveHouse] = useState(null);
  const [birthData, setBirthData] = useState(null);
  const [astroData, setAstroData] = useState(null);
  const [musicProfile, setMusicProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);

  const handleBirthDataSubmit = async (data) => {
    setBirthData(data);
    setAstroData(null);
    setMusicProfile(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const astroResponse = await fetchAstroData(data);
      if (astroResponse && astroResponse.status === "ok") {
        setAstroData(astroResponse);

        const placements = astroResponse.western?.placements || [];
        const chart = placements
          .filter(p => p.planet && p.sign && p.house)
          .map(p => ({
            planet: p.planet,
            sign: p.sign,
            house: p.house
          }));

        const musicResponse = await fetchMusicProfile(chart);
        if (musicResponse) {
          setMusicProfile(musicResponse);
        }
      } else {
        setErrorMessage(`Error: ${astroResponse?.message || 'Astro data fetch failed.'}`);
      }
    } catch (error) {
      setErrorMessage(`Error fetching data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBirthData(null);
    setAstroData(null);
    setMusicProfile(null);
    setActiveHouse(null);
    setErrorMessage(null);
    setIsLoading(false);
    setAutoPlay(false);
    setCurrentHouseIndex(0);
  };

  useEffect(() => {
    if (!autoPlay || !musicProfile || musicProfile.length === 0) return;

    const interval = setInterval(() => {
      setCurrentHouseIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= musicProfile.length) {
          setAutoPlay(false);
          return 0;
        }
        return nextIndex;
      });
    }, 3000); // 3 segundos por casa

    return () => clearInterval(interval);
  }, [autoPlay, musicProfile]);

  useEffect(() => {
    if (musicProfile && musicProfile.length > 0) {
      setActiveHouse(musicProfile[currentHouseIndex]?.house);
    }
  }, [currentHouseIndex, musicProfile]);

  const renderMusicProfile = () => (
    <div className="music-profile">
      <h3>Music Profile Summary</h3>
      {musicProfile && musicProfile.length > 0 ? (
        <ul>
          {musicProfile.map((item, index) => (
            <li key={index}>
              <strong>House {item.house} ({item.sign})</strong>: {item.instrument}, {item.motif}, {item.scale}, {item.tempo} BPM
            </li>
          ))}
        </ul>
      ) : (
        <p>No music profile data available.</p>
      )}
    </div>
  );
  const handlePlayClick = async () => {
    await Tone.start();         // 🔓 Unlock the browser AudioContext
    setAutoPlay(true);           // ▶️ Start playing houses
  };
  
  return (
    <div className="App">
      {!birthData && !isLoading && !astroData && <LandingPage onSubmitBirthData={handleBirthDataSubmit} />}
      {isLoading && <div className="loading-indicator">Generating Chart & Music...</div>}
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
          <div className="main-content-area">
            <div className="interactive-area">
              <ChartWheel setActiveHouse={setActiveHouse} activeHouse={activeHouse} />
              <HouseProgression setActiveHouse={setActiveHouse} activeHouse={activeHouse} />
              <MusicPlayer musicProfile={musicProfile} currentHouseIndex={currentHouseIndex} />
            </div>
            <div className="details-area">
              <HouseDetails astroData={astroData} activeHouse={activeHouse} />
              {renderMusicProfile()}
            </div>
          </div>
          <div className="autoplay-controls">
            <button onClick={() => setAutoPlay(true)} disabled={autoPlay || !musicProfile}>
              ▶️ Play My Chart
            </button>
            <button onClick={() => setAutoPlay(false)} disabled={!autoPlay}>
              ⏹ Stop
            </button>
            <button onClick={() => setAutoPlay(true)} disabled={autoPlay || !musicProfile}>
              ▶️ Play My Chart
            </button>
+ <button onClick={handlePlayClick} disabled={autoPlay || !musicProfile}>
    ▶️ Play My Chart
  </button>

          </div>
        </>
      )}
    </div>
  );
}

export default App;
