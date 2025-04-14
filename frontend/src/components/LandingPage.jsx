import React, { useState } from 'react';
import { geocodeLocation } from '../utils/geocodeLocation';

const LandingPage = ({ onSubmitBirthData }) => {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const geo = await geocodeLocation(birthData.location);
    if (!geo) {
      setError("Unable to locate that place. Please double-check your spelling.");
      setIsSubmitting(false);
      return;
    }

    const fullData = {
      ...birthData,
      geolocation: geo
    };

    onSubmitBirthData(fullData);
    console.log("✅ Submitted Birth Data:", fullData);
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Astro Audios</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date of Birth:</label>
          <input
            id="date"
            type="date"
            name="date"
            value={birthData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time of Birth:</label>
          <input
            id="time"
            type="time"
            name="time"
            value={birthData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            name="location"
            placeholder="City, Country"
            value={birthData.location}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Looking up coordinates..." : "Generate Chart & Music"}
        </button>
      </form>
    </div>
  );
};

export default LandingPage;
