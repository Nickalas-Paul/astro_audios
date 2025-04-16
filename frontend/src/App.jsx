import React, { useState, useEffect } from 'react';
import './App.css';

import LandingPage from './components/LandingPage';
import ChartWheel from './components/ChartWheel';
import MusicPlayer from './components/MusicPlayer';
import HouseDetails from './components/HouseDetails';
import HouseProgression from './components/HouseProgression';

import { fetchAstroData, fetchMusicProfile } from './services/astroService';

function App() {
  const [birthData, setBirthData] = useState(null);
  const [astroData, setAstroData] = useState(null);
  const [musicProfile, setMusicProfile] = useState(null);
  const [activeHouse, setActiveHouse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBirthDataSubmit = async (data) => {
    setBirthData(data);
    setAstroData(null);
    setMusicProfile(null);
    setActiveHouse(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const astroResult = await fetchAstroData(data);
      if (!astroResult || astroResult.status !== 'ok') {
        setErrorMessage('Error fetching astrological data.');
        setIsLoading(false);
        return;
      }

      setAstroData(astroResult);

      // Build minimal chart for music profile API
      const minimalChart = [];

      const planets = ['Sun', 'Moon', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Mercury', 'Venus', 'Mars'];

      planets.forEach((planet) => {
        const placement = astroResult?.vedic?.planet_positions?.find(p => p.planet_name === planet);
        if (placement) {
          minimalChart.push({
            planet,
            sign: placement.rasi?.name_english || 'Unknown',
            house: placement.house || 1
          });
        }
      });

      // Fill in empty houses with just sign data
      for (let house = 1; house <= 12; house++) {
        const alreadyFilled = minimalChart.some(p => p.house === house);
        if (!alreadyFilled) {
          const sign = astroResult?.vedic?.houses?.find(h => h.house_number === house)?.rasi?.name_english;
          if (sign) {
            minimalChart.push({
              planet: 'None',
              sign,
              house
            });
          }
        }
      }

      const musicResult = await fetchMusicProfile(minimalChart);
      setMusicProfile(musicResult);

    } catch (error) {
      setErrorMessage('An unexpected error occurred while generating your chart and profile.');
      console.error(error);
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
  };

  return (
    <div className="App">
      {!birthData && !astroData && !isLoading && (
        <LandingPage onSubmitBirthData={handleBirthDataSubmit} />
      )}

      {isLoading && <div className="loading-indicator">Generating Chart & Music...</div>}

      {errorMessage && !isLoading && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}

      {astroData && musicProfile && !isLoading && (
        <>
          <div className="birth-data-summary">
            <p>
              Chart for: {birthData.date}, {birthData.time}, {birthData.location}
            </p>
            <button onClick={handleReset}>Generate New Chart</button>
          </div>

          <div className="main-content-area">
            <div className="interactive-area">
              <ChartWheel
                setActiveHouse={setActiveHouse}
                activeHouse={activeHouse}
              />
              <HouseProgression setActiveHouse={setActiveHouse} />
              <MusicPlayer activeHouse={activeHouse} musicProfile={musicProfile} />
            </div>

            <div className="details-area">
              <HouseDetails
                activeHouse={activeHouse}
                musicProfile={musicProfile}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
