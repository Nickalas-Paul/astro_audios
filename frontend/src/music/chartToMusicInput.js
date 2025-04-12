export function convertWesternChartToMusicInput(westernData) {
    const planets = [];
  
    if (westernData.soorya_rasi) {
      planets.push({ name: "Sun", sign: westernData.soorya_rasi, house: "X" });
    }
  
    if (westernData.chandra_rasi) {
      planets.push({ name: "Moon", sign: westernData.chandra_rasi, house: "X" });
    }
  
    // Define basic sign-to-element and sign-to-modality maps
    const elementMap = {
      Aries: "fire", Taurus: "earth", Gemini: "air", Cancer: "water",
      Leo: "fire", Virgo: "earth", Libra: "air", Scorpio: "water",
      Sagittarius: "fire", Capricorn: "earth", Aquarius: "air", Pisces: "water"
    };
  
    const modalityMap = {
      Aries: "cardinal", Taurus: "fixed", Gemini: "mutable", Cancer: "cardinal",
      Leo: "fixed", Virgo: "mutable", Libra: "cardinal", Scorpio: "fixed",
      Sagittarius: "mutable", Capricorn: "cardinal", Aquarius: "fixed", Pisces: "mutable"
    };
  
    // Count dominant element
    const elementCount = {};
    for (const p of planets) {
      const element = elementMap[p.sign];
      elementCount[element] = (elementCount[element] || 0) + 1;
    }
  
    const dominant = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "earth";
  
    return {
      planets,
      aspects: [], // Placeholder until we calculate or fetch aspects
      elements: {
        dominant,
        map: elementMap
      },
      modalities: modalityMap
    };
  }
  