import {
    signToKey,
    planetToInstrument,
    aspectToEffect,
    houseToRole,
    elementModalityToRhythm
  } from './musicMapping';
  
  // Helper: Get element + modality combo for sign
  const getElementModalityCombo = (sign, modalityMap, elementMap) => {
    const element = elementMap[sign];
    const modality = modalityMap[sign];
    return `${element}_${modality}`;
  };
  
  export function mapChartToMusic(chartData) {
    const { planets, aspects, modalities, elements } = chartData;
  
    // 1. Planet placements → musical voice map
    const voices = planets.map(p => {
      const { name, sign, house } = p;
      const keyData = signToKey[sign] || { key: "C", mode: "major" };
      const instrument = planetToInstrument[name] || "piano";
      const role = houseToRole[house] || "background";
  
      return {
        planet: name,
        sign,
        house,
        instrument,
        key: keyData.key,
        mode: keyData.mode,
        role
      };
    });
  
    // 2. Aspects → harmony/interaction layers
    const harmony = aspects.map(a => {
      const { type, planet1, planet2 } = a;
      const effect = aspectToEffect[type.toLowerCase()] || "random";
      return {
        between: [planet1, planet2],
        effect
      };
    });
  
    // 3. Global rhythm & tempo (based on dominant element/modality)
    const dominantCombo = getElementModalityCombo(
      elements.dominant,
      modalities,
      elements.map
    );
    const rhythmSettings = elementModalityToRhythm[dominantCombo] || {
      tempo: 100,
      rhythm: "neutral"
    };
  
    return {
      tempo: rhythmSettings.tempo,
      rhythm: rhythmSettings.rhythm,
      voices,
      harmony
    };
  }
  