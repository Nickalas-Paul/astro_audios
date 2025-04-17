import React from 'react';

const HouseDetails = ({ astroData, activeHouse, musicProfile }) => {
  if (!astroData || !musicProfile || activeHouse === null) return null;

  const houseInfo = astroData?.western?.house_data?.find(h => h.house === activeHouse);
  const musicInfo = musicProfile.find(h => h.house === activeHouse);

  return (
    <div className="house-details">
      <h3>House {activeHouse} Overview</h3>

      {houseInfo ? (
        <>
          <p><strong>Sign:</strong> {houseInfo.sign}</p>
          <p><strong>Theme:</strong> {musicInfo?.theme || '—'}</p>
        </>
      ) : (
        <p>No astrological data available for this house.</p>
      )}

      {musicInfo ? (
        <div className="music-attributes">
          <h4>Musical Interpretation</h4>
          <ul>
            <li><strong>Instrument:</strong> {musicInfo.instrument}</li>
            <li><strong>Motif:</strong> {musicInfo.motif}</li>
            <li><strong>Scale:</strong> {musicInfo.scale}</li>
            <li><strong>Tempo:</strong> {musicInfo.tempo} BPM</li>
            <li><strong>Rhythm:</strong> {musicInfo.rhythm}</li>
            <li><strong>Mood:</strong> {musicInfo.mood}</li>
            <li><strong>Dynamics:</strong> {musicInfo.dynamics}</li>
            <li><strong>Harmony:</strong> {musicInfo.harmony}</li>
            <li><strong>Brightness:</strong> {musicInfo.brightness}</li>
            <li><strong>Attack:</strong> {musicInfo.attack}</li>
            <li><strong>Spatial:</strong> {musicInfo.spatial}</li>
          </ul>
        </div>
      ) : (
        <p>No music data available for this house.</p>
      )}
    </div>
  );
};

export default HouseDetails;
