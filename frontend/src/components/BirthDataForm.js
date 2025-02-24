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
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Date & Time of Birth:
                <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
            </label>
            <label>
                Latitude:
                <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            </label>
            <label>
                Longitude:
                <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            </label>
            <label>
                Ayanamsa:
                <select value={ayanamsa} onChange={(e) => setAyanamsa(e.target.value)}>
                    <option value={1}>Lahiri (1)</option>
                    <option value={3}>Raman (3)</option>
                    <option value={5}>Krishnamurti (5)</option>
                </select>
            </label>
            <button type="submit">Get Astrology Data</button>
        </form>
    );
}

export default BirthDataForm;
