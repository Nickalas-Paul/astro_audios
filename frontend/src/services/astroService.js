// frontend/src/services/astroService.js

/**
 * Mock fetchAstroData: returns a dummy astroData object
 */
export async function fetchAstroData(birthData) {
  // simulate network delay
  await new Promise(r => setTimeout(r, 300));
  return {
    status: "ok",
    western: {
      placements: Array.from({ length: 12 }, (_, i) => ({
        planet: `Planet${i+1}`,
        sign: `Sign${i+1}`,
        house: i + 1
      }))
    }
  };
}

/**
 * Mock fetchMusicProfile: returns 12 houses with notes
 */
export async function fetchMusicProfile(chart) {
  await new Promise(r => setTimeout(r, 300));
  return {
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      sign: chart[i]?.sign || `Sign${i+1}`,
      note: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5"][i],
      duration: "0.5n",
      instrument: "Synth",
      motif: "Mock",
      scale: "Major",
      tempo: 120
    }))
  };
}
