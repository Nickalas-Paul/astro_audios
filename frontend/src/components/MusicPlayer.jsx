import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

const MusicPlayer = ({ activeHouse, musicProfile }) => {
  const synthRef = useRef(null);

  // Map scale names to note sets
  const scaleMap = {
    ionian: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
    lydian: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4"],
    dorian: ["C4", "D4", "Eb4", "F4", "G4", "A4", "Bb4"],
    mixolydian: ["C4", "D4", "E4", "F4", "G4", "A4", "Bb4"]
  };

  useEffect(() => {
    if (!musicProfile || !activeHouse) return;

    const houseData = musicProfile.find(entry => entry.house === activeHouse);
    if (!houseData) return;

    const {
      instrument,
      tempo,
      scale,
      rhythm,
      attack
    } = houseData;

    Tone.Transport.bpm.value = tempo;

    // Choose instrument
    if (!synthRef.current) {
      switch (instrument) {
        case "piano":
          synthRef.current = new Tone.Sampler({
            urls: {
              C4: "C4.mp3",
              E4: "E4.mp3",
              G4: "G4.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/"
          }).toDestination();
          break;
        case "pad":
        case "pluck":
        case "synth":
        default:
          synthRef.current = new Tone.Synth({
            envelope: { attack }
          }).toDestination();
      }
    }

    const notes = scaleMap[scale] || scaleMap["ionian"];

    // Rhythm pattern
    let pattern;
    switch (rhythm) {
      case "arpeggiated":
        pattern = notes.map((note, i) => [note, `0:${i}`]);
        break;
      case "syncopated":
        pattern = notes.map((note, i) => [note, `0:${i * 0.75}`]);
        break;
      case "steady":
      default:
        pattern = notes.map((note, i) => [note, `0:${i}`]);
    }

    const part = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(note, "8n", time);
    }, pattern).start(0);

    Tone.Transport.start();

    return () => {
      part.dispose();
      Tone.Transport.stop();
      if (synthRef.current?.dispose) {
        synthRef.current.dispose();
      }
      synthRef.current = null;
    };
  }, [activeHouse, musicProfile]);

  return (
    <div>
      <p>🎵 Playing music for House {activeHouse}</p>
    </div>
  );
};

export default MusicPlayer;
