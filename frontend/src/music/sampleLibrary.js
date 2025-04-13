import * as Tone from 'tone';

export const instrumentSamples = {
  trumpet: new Tone.Player("/audio/trumpet/trumpet_c4.aiff").toDestination(),
  flute: new Tone.Player("/audio/flute/flute_e3.flac").toDestination(),
  cello: new Tone.Player("/audio/cello/cello_loop.flac").toDestination(),
  violin: new Tone.Player("/audio/violin/violin_g5_pizzicato.wav").toDestination(),
  synth: new Tone.Player("/audio/synth/eerie_pad_gmin.wav").toDestination()
};

// 🔁 Export a function to preload them all
export const loadAllSamples = async () => {
  const loaders = Object.values(instrumentSamples).map(player => player.load());
  await Promise.all(loaders);
};
