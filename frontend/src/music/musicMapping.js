// Zodiac Signs → Musical Key / Mode
export const signToKey = {
    Aries: { key: "C", mode: "major" },
    Taurus: { key: "A", mode: "minor" },
    Gemini: { key: "D", mode: "mixolydian" },
    Cancer: { key: "F", mode: "minor" },
    Leo: { key: "G", mode: "major" },
    Virgo: { key: "E", mode: "minor" },
    Libra: { key: "B♭", mode: "major" },
    Scorpio: { key: "D", mode: "minor" },
    Sagittarius: { key: "A", mode: "major" },
    Capricorn: { key: "C", mode: "minor" },
    Aquarius: { key: "F♯", mode: "lydian" },
    Pisces: { key: "E♭", mode: "major" }
  };
  
  // Planets → Instruments
  export const planetToInstrument = {
    Sun: "trumpet",
    Moon: "cello",
    Mercury: "clarinet",
    Venus: "flute",
    Mars: "drums",
    Jupiter: "horn",
    Saturn: "bassoon",
    Uranus: "synth",
    Neptune: "pad",
    Pluto: "violin",
    Lilith: "dark ambient",
    NNode: "harp",
    SNode: "guitar"
  };
  
  // Aspects → Musical Interaction Types
  export const aspectToEffect = {
    conjunction: "unison",
    sextile: "soft harmony",
    trine: "flowing modulation",
    square: "dissonance",
    opposition: "call_response"
  };
  
  // Houses → Arrangement Layer
  export const houseToRole = {
    I: "intro_theme",
    II: "bassline",
    III: "countermelody",
    IV: "harmony_base",
    V: "main_melody",
    VI: "variation",
    VII: "duet_layer",
    VIII: "bridge",
    IX: "lift",
    X: "climax",
    XI: "instrument_solo",
    XII: "fade_out"
  };
  
  // Element + Modality → Rhythm & Tempo
  export const elementModalityToRhythm = {
    "fire_cardinal": { tempo: 140, rhythm: "staccato" },
    "fire_fixed": { tempo: 130, rhythm: "syncopated" },
    "fire_mutable": { tempo: 145, rhythm: "explosive" },
    "earth_cardinal": { tempo: 100, rhythm: "plodding" },
    "earth_fixed": { tempo: 90, rhythm: "slow groove" },
    "earth_mutable": { tempo: 105, rhythm: "stepping" },
    "air_cardinal": { tempo: 120, rhythm: "swing" },
    "air_fixed": { tempo: 110, rhythm: "glitchy" },
    "air_mutable": { tempo: 135, rhythm: "fluttery" },
    "water_cardinal": { tempo: 85, rhythm: "swell" },
    "water_fixed": { tempo: 95, rhythm: "flow" },
    "water_mutable": { tempo: 100, rhythm: "rippling" }
  };
  export function mapChartToMusic(input) {
    // your logic here...
  }
  