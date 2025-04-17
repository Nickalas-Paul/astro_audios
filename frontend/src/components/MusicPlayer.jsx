import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const scaleMap = {
  ionian: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
  lydian: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4"],
  dorian: ["C4", "D4", "Eb4", "F4", "G4", "A4", "Bb4"],
  mixolydian: ["C4", "D4", "E4", "F4", "G4", "A4", "Bb4"]
};

const MusicPlayer = ({ musicProfile, triggeredHouse = null }) => {
  const synthRef = useRef(null);
  const [currentHouseIndex, setCurrentHouseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const houseTimer = useRef(null);

  const createSynth = (instrument, attack) => {
    if (synthRef.current) {
      synthRef.current.dispose();
    }
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
  };

  const playHouseMusic = (houseData) => {
    const {
      instrument,
      tempo,
      scale,
      rhythm,
      attack
    } = houseData;

    const notes = scaleMap[scale] || scaleMap["ionian"];
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = tempo;

    createSynth(instrument, attack);

    let pattern = notes.map((note, i) => [note, `0:${i * (rhythm === "syncopated" ? 0.75 : 1)}`]);

    const part = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(note, "8n", time);
    }, pattern).start(0);

    Tone.Transport.start();
  };

  // Autoplay all houses
  useEffect(() => {
    if (!musicProfile || musicProfile.length === 0 || !isPlaying) return;

    playHouseMusic(musicProfile[currentHouseIndex]);

    houseTimer.current = setTimeout(() => {
      setCurrentHouseIndex(prev => {
        if (prev >= musicProfile.length - 1) {
          setIsPlaying(false);
          Tone.Transport.stop();
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => {
      if (houseTimer.current) clearTimeout(houseTimer.current);
      Tone.Transport.stop();
    };
  }, [musicProfile, currentHouseIndex, isPlaying]);

  // Single house playback
  useEffect(() => {
    if (triggeredHouse && musicProfile && musicProfile.length > 0) {
      const houseData = musicProfile.find(item => item.house === triggeredHouse);
      if (houseData) {
        playHouseMusic(houseData);
      }
    }
  }, [triggeredHouse]);

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
