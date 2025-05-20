// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import ChartWheel from './components/ChartWheel';
import HouseDetails from './components/HouseDetails';
import HouseProgression from './components/HouseProgression';
import { fetchAstroData, fetchMusicProfile } from './services/astroService';
import * as Tone from 'tone';

function App() {
  const [activeHouse, setActiveHouse] = useState(null);
  const [birthData, setBirthData] = useState(null);
  const [astroData, setAstroData] = useState(null);
  const [musicProfile, setMusicProfile] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);

  // 1) Handle form submission → fetch astro data + music profile
// in frontend/src/App.jsx, replace your existing handleBirthDataSubmit with this:

const handleBirthDataSubmit = async (data) => {
  setBirthData(data);
  setAstroData(null);
  setMusicProfile([]); 
  setErrorMessage(null);
  setIsLoading(true);

  try {
    // 1) Fetch astro data
    const astroResponse = await fetchAstroData(data);
    if (astroResponse.status !== 'ok') {
      setErrorMessage(`Error: ${astroResponse.message || 'Astro data fetch failed.'}`);
      setIsLoading(false);
      return;
    }
    setAstroData(astroResponse);

    // 2) Build a simple chart array for music
    const placements = astroResponse.western?.placements || [];
    const chart = placements
      .filter(p => p.house)
      .map(p => ({ planet: p.planet, sign: p.sign, house: p.house }));

    // 3) Fetch music profile
    const musicResponse = await fetchMusicProfile(chart);

    // 4) Re-order houses CCW: start at index 0 (House 1),
    //    then go through the rest in reverse order (House 12, 11, … 2)
    const raw = musicResponse.houses || [];
    const ordered = raw.length > 1
      ? [ raw[0], ...raw.slice(1).reverse() ]
      : raw;

    setMusicProfile(ordered);
  } catch (err) {
    setErrorMessage(`Error fetching data: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};

  // 2) Reset everything
  const handleReset = () => {
    setBirthData(null);
    setAstroData(null);
    setMusicProfile([]);
    setActiveHouse(null);
    setErrorMessage(null);
    setIsLoading(false);
    setAutoPlay(false);
    setCurrentHouseIndex(0);
  };

  // 3) Unlock AudioContext & start autoplay
  const handlePlayClick = async () => {
    await Tone.start();
    setAutoPlay(true);
  };

  // 4) Advance the currentHouseIndex every 3s when autoplay is on
  useEffect(() => {
    if (!autoPlay || !musicProfile.length) return;
    const interval = setInterval(() => {
      setCurrentHouseIndex(prev => {
        const next = prev + 1;
        if (next >= musicProfile.length) {
          setAutoPlay(false);
          return 0;
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPlay, musicProfile]);

  // 5) Update activeHouse whenever currentHouseIndex or musicProfile changes
  useEffect(() => {
    if (musicProfile.length) {
      setActiveHouse(musicProfile[currentHouseIndex].house);
    }
  }, [currentHouseIndex, musicProfile]);

  // 6) Play the note for the current house
  useEffect(() => {
    if (!autoPlay || !musicProfile.length) return;
    const { note = 'C4', duration = '1n' } = musicProfile[currentHouseIndex];
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, duration);
    return () => synth.dispose();
  }, [currentHouseIndex, musicProfile, autoPlay]);

  // 7) Render the music profile list
  const renderMusicProfile = () => (
    <div className="music-profile">
      <h3>Music Profile Summary</h3>
      {musicProfile.length > 0 ? (
        <ul>
          {musicProfile.map((item, idx) => (
            <li key={idx}>
              <strong>
                House {item.house} ({item.sign})
              </strong>: {item.instrument}, {item.motif}, {item.scale}, {item.tempo} BPM
            </li>
          ))}
        </ul>
      ) : (
        <p>No music profile data available.</p>
      )}
    </div>
  );

  return (
    <div className="App">
      {/* Landing / Form */}
      {!birthData && !isLoading && !astroData && (
        <LandingPage onSubmitBirthData={handleBirthDataSubmit} />
      )}

      {/* Loading */}
      {isLoading && <div className="loading-indicator">Generating Chart & Music...</div>}

      {/* Error */}
      {errorMessage && !isLoading && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}

      {/* Main Content */}
      {astroData && !isLoading && (
        <>
          {/* Summary + Reset */}
          <div className="birth-data-summary">
            <p>
              Chart for: {birthData.date}, {birthData.time}, {birthData.location}
            </p>
            <button onClick={handleReset}>Generate New Chart</button>
          </div>

          <div className="main-content-area">
            <div className="interactive-area">
              <ChartWheel
                activeHouse={activeHouse}
                onHouseSelect={setActiveHouse}
              />
              <HouseProgression
                activeHouse={activeHouse}
                onSelectHouse={setActiveHouse}
              />
            </div>
            <div className="details-area">
              <HouseDetails astroData={astroData} activeHouse={activeHouse} />
              {renderMusicProfile()}
            </div>
          </div>

          {/* Play / Stop Controls */}
          <div className="autoplay-controls">
            <button
              onClick={handlePlayClick}
              disabled={autoPlay || !musicProfile.length}
            >
              ▶️ Play My Chart
            </button>
            <button
              onClick={() => setAutoPlay(false)}
              disabled={!autoPlay}
            >
              ⏹ Stop
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
