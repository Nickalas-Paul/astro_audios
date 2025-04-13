import React, { useState } from 'react';

function BirthDataForm({ onSubmit }) {
    const [name, setName] = useState('');
    const [datetime, setDatetime] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [ayanamsa, setAyanamsa] = useState(1); // Default to Lahiri (1)

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ name, datetime, latitude, longitude, ayanamsa });
    };

    return (
        <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      
        <label htmlFor="datetime">
          Date & Time of Birth:
        </label>
        <input
          id="datetime"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
      
        <label htmlFor="latitude">
          Latitude:
        </label>
        <input
          id="latitude"
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      
        <label htmlFor="longitude">
          Longitude:
        </label>
        <input
          id="longitude"
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      
        <label htmlFor="ayanamsa">
          Ayanamsa:
        </label>
        <select
          id="ayanamsa"
          value={ayanamsa}
          onChange={(e) => setAyanamsa(e.target.value)}
        >
          <option value={1}>Lahiri (1)</option>
          <option value={3}>Raman (3)</option>
          <option value={5}>Krishnamurti (5)</option>
        </select>
      
        <button type="submit">Get Astrology Data</button>
      </form>
      
    )}

export default BirthDataForm;
