import React, { useState } from 'react';

const LandingPage = ({ onSubmitBirthData }) => {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitBirthData) {
      onSubmitBirthData(birthData);
    }
    console.log('Submitted Birth Data:', birthData);
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
          />
        </div>
        <button type="submit">Generate Chart & Music</button>
      </form>
    </div>
  );
};

export default LandingPage;
