import React, { useMemo, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { instrumentSamples, loadAllSamples } from '../music/sampleLibrary';

function MusicPlayer({ activeHouse, musicPlan, setTriggeredHouse }) {
  const synthRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  const partRef = useRef(null);
  const loopCounter = useRef(0);
  const houseVoiceMapRef = useRef({});
  const masterGain = useRef(new Tone.Gain(1).toDestination());

  const houseNoteMap = useMemo(() => ({
    1: "C4", 2: "D4", 3: "E4", 4: "F4",
    5: "G4", 6: "A4", 7: "B4", 8: "C5",
    9: "D5", 10: "E5", 11: "F5", 12: "G5"
  }), []);

  useEffect(() => {
    loadAllSamples().then(() => {
      console.log("🎧 All samples preloaded.");
      setSamplesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth().connect(masterGain.current);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !activeHouse || !houseVoiceMapRef.current) return;

    const voices = houseVoiceMapRef.current[activeHouse];
    if (!voices || voices.length === 0) return;

    voices.forEach((voice) => {
      const noteMap = {
        C: 'C4', D: 'D4', E: 'E4', F: 'F4', G: 'G4', A: 'A4', B: 'B4',
        'B♭': 'A#4', 'F♯': 'F#4', 'E♭': 'D#4'
      };
      let note = noteMap[voice.key] || 'C4';
      let duration = '8n';
      let velocity = 1.0;

      const sample = instrumentSamples[voice.instrument];
      if (sample) {
        sample.connect(masterGain.current);
        sample.start();
      } else {
        const synth = getSynthForInstrument(voice.instrument);
        synth.connect(masterGain.current);
        synth.triggerAttackRelease(note, duration, undefined, velocity);
      }
    });
  }, [activeHouse, isPlaying]);

  useEffect(() => {
    if (musicPlan && isPlaying) {
      playMusicPlan(musicPlan);
    }
  }, [musicPlan, isPlaying]);

  const togglePlayback = async () => {
    if (Tone.Transport.state !== 'started') {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
      setLoopCount(0);

      Tone.Transport.scheduleRepeat(() => {
        loopCounter.current += 1;
        setLoopCount((c) => c + 1);

        const tempoShift = 2 * ((loopCounter.current % 2 === 0) ? 1 : -1);
        const baseTempo = musicPlan?.tempo || 100;
        Tone.Transport.bpm.rampTo(baseTempo + tempoShift, "1m");
      }, "4m");

    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();

      if (partRef.current) {
        partRef.current.dispose();
        partRef.current = null;
      }

      setIsPlaying(false);
    }
  };

  const getSynthForInstrument = (instrument) => {
    switch (instrument) {
      case 'trumpet': return new Tone.Synth({ oscillator: { type: 'square' } });
      case 'cello': return new Tone.Synth({ oscillator: { type: 'triangle' } });
      case 'flute': return new Tone.Synth({ oscillator: { type: 'sine' } });
      case 'clarinet': return new Tone.Synth({ oscillator: { type: 'sawtooth' } });
      case 'violin': return new Tone.Synth({ oscillator: { type: 'sawtooth' } });
      case 'drums': return new Tone.MembraneSynth();
      case 'horn': return new Tone.FMSynth();
      case 'pad':
      case 'synth': return new Tone.AMSynth();
      case 'bassoon': return new Tone.Synth({ oscillator: { type: 'triangle' } });
      default: return new Tone.Synth();
    }
  };

  const playMusicPlan = async (plan) => {
    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel();

    const houseVoiceMap = {};
    plan.voices.forEach((voice) => {
      const houseNum = parseInt(voice.house?.replace(/[^\d]/g, ""), 10);
      if (!houseVoiceMap[houseNum]) houseVoiceMap[houseNum] = [];
      houseVoiceMap[houseNum].push(voice);
    });
    houseVoiceMapRef.current = houseVoiceMap;

    const noteMap = {
      C: 'C4', D: 'D4', E: 'E4', F: 'F4', G: 'G4', A: 'A4', B: 'B4',
      'B♭': 'A#4', 'F♯': 'F#4', 'E♭': 'D#4'
    };

    const events = plan.voices.map((voice, index) => {
      const beatOffset = index % 4;
      const measureOffset = Math.floor(index / 4);
      const time = `${measureOffset}:${beatOffset}`;
      return [time, voice];
    });

    const part = new Tone.Part((time, voice) => {
      const sample = instrumentSamples[voice.instrument];
      let note = noteMap[voice.key] || 'C4';
      let duration = '8n';
      let velocity = 0.7;
      let pitchShift = 0;

      switch (voice.role) {
        case 'main_melody':
          duration = '4n'; velocity = 1.0; break;
        case 'bassline':
          duration = '2n'; velocity = 0.6; pitchShift = -12; break;
        case 'intro_theme':
          velocity = 0.8; break;
        case 'variation':
          duration = '16n'; break;
        case 'bridge':
        case 'fade_out':
          velocity = 0.5; break;
        default: break;
      }

      if (pitchShift !== 0) {
        const baseMidi = Tone.Frequency(note).toMidi();
        note = Tone.Frequency(baseMidi + pitchShift, "midi").toNote();
      }

      if (sample) {
        sample.connect(masterGain.current);
        sample.start(time);
      } else {
        const synth = getSynthForInstrument(voice.instrument);
        synth.connect(masterGain.current);
        synth.triggerAttackRelease(note, duration, time, velocity);
      }

      // 🔁 Trigger house sector pulse
      if (setTriggeredHouse) {
        const houseNum = parseInt(voice.house?.replace(/[^\d]/g, ""), 10);
        setTriggeredHouse(houseNum);
        setTimeout(() => setTriggeredHouse(null), 500);
      }
    }, events);

    part.loop = loopEnabled;
    part.loopEnd = "4m";
    part.start(0);
    partRef.current = part;

    Tone.Transport.start();
  };

  return (
    <div className="music-player">
      <h2>Music Player</h2>
      <p>Active House: {activeHouse || "None"}</p>

      {!samplesLoaded ? (
        <p>🎧 Loading audio samples...</p>
      ) : (
        <>
          <div className="volume-control">
            <label>Volume</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              onChange={(e) =>
                masterGain.current.gain.rampTo(parseFloat(e.target.value), 0.1)
              }
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={loopEnabled}
              onChange={(e) => setLoopEnabled(e.target.checked)}
            />
            Loop Music
          </label>

          <p>Loop #: {loopCount}</p>

          <button onClick={togglePlayback}>
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </button>
        </>
      )}
    </div>
  );
}

export default MusicPlayer;
