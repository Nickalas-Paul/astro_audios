import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const scaleMap = {
  ionian: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
  lydian: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4"],
  dorian: ["C4", "D4", "Eb4", "F4", "G4", "A4", "Bb4"],
  mixolydian: ["C4", "D4", "E4", "F4", "G4", "A4", "Bb4"]
};

const MusicPlayer = ({ musicProfile }) => {
  const synthRef = useRef(null);
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const houseTimer = useRef(null);

  useEffect(() => {
    if (!musicProfile || musicProfile.length === 0 || !isPlaying) return;

    const playHouse = (houseData) => {
      const {
        instrument,
        tempo,
        scale,
        rhythm,
        attack
      } = houseData;

      const notes = scaleMap[scale] || scaleMap["ionian"];
      Tone.Transport.cancel(); // clear previous events
      Tone.Transport.bpm.value = tempo;

      if (!synthRef.current) {
        if (instrument === "piano") {
          synthRef.current = new Tone.Sampler({
            urls: {
              C4: "C4.mp3",
              E4: "E4.mp3",
              G4: "G4.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/"
          }).toDestination();
        } else {
          synthRef.current = new Tone.Synth({
            envelope: { attack }
          }).toDestination();
        }
      }

      let pattern = notes.map((note, i) => [note, `0:${i * (rhythm === "syncopated" ? 0.75 : 1)}`]);

      const part = new Tone.Part((time, note) => {
        synthRef.current.triggerAttackRelease(note, "8n", time);
      }, pattern).start(0);

      Tone.Transport.start();
    };

    // Play current house
    playHouse(musicProfile[currentHouseIndex]);

    // Set timer to go to next house
    houseTimer.current = setTimeout(() => {
      setCurrentHouseIndex(prev => {
        if (prev >= 11) {
          setIsPlaying(false);
          Tone.Transport.stop();
          return 0;
        }
        return prev + 1;
      });
    }, 3000); // 3 seconds per house

    return () => {
      if (houseTimer.current) clearTimeout(houseTimer.current);
      Tone.Transport.stop();
      if (synthRef.current?.dispose) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [musicProfile, currentHouseIndex, isPlaying]);

  return (
    <div className="music-player">
      <h4>Chart Playback</h4>
      <p>{isPlaying ? `🎶 Playing House ${musicProfile[currentHouseIndex]?.house}` : "Paused"}</p>
      <button onClick={() => setIsPlaying(true)} disabled={isPlaying}>Play All Houses</button>
      <button onClick={() => setIsPlaying(false)}>Stop</button>
    </div>
  );
};

export default MusicPlayer;
