// CampfireMusicGenerator with bass, melody, and drum-like rhythm

export interface MusicGenerator {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  cleanup: () => void;
}

export function createCampfireMusicGenerator(): MusicGenerator {
  let audioContext: AudioContext | null = null;
  let masterGainNode: GainNode | null = null;
  let filterNode: BiquadFilterNode | null = null;
  let isPlaying = false;
  let animationFrame: number | null = null;

  const voices: (() => void)[] = [];
  const stopVoices: (() => void)[] = [];

  const initializeAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainNode = audioContext.createGain();
      masterGainNode.gain.value = 0.08;
      filterNode = audioContext.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 800;
      filterNode.Q.value = 1;
      filterNode.connect(masterGainNode);
      masterGainNode.connect(audioContext.destination);
    }
  };

  const createChordVoice = () => {
    const baseFrequencies = [130.81, 164.81, 196.0, 261.63, 329.63];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    baseFrequencies.forEach((freq, index) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.type = index < 2 ? 'sine' : ['triangle', 'sawtooth'][index % 2];
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 10;
      gain.gain.value = (index < 2 ? 0.3 : 0.2) * (0.8 + Math.random() * 0.4);
      osc.connect(gain);
      gain.connect(filterNode!);
      osc.start();
      oscillators.push(osc);
      gains.push(gain);
    });

    stopVoices.push(() => {
      oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
      gains.forEach(g => g.disconnect());
    });
  };

  const createBassVoice = () => {
    let bassOsc = audioContext!.createOscillator();
    let bassGain = audioContext!.createGain();
    const notes = [65.41, 73.42, 98.0];
    let i = 0;
    bassOsc.type = 'triangle';
    bassOsc.frequency.value = notes[0];
    bassGain.gain.value = 0.08;
    bassOsc.connect(bassGain);
    bassGain.connect(filterNode!);
    bassOsc.start();

    const bassInterval = setInterval(() => {
      i = (i + 1) % notes.length;
      bassOsc.frequency.setValueAtTime(notes[i], audioContext!.currentTime);
    }, 4000);

    stopVoices.push(() => {
      clearInterval(bassInterval);
      bassOsc.stop();
      bassOsc.disconnect();
      bassGain.disconnect();
    });
  };

  const createMelodyVoice = () => {
    const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99];
    const melodyPlay = () => {
      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.type = 'sine';
      osc.frequency.value = note;
      gain.gain.setValueAtTime(0.01, audioContext!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext!.currentTime + 1);
      osc.connect(gain);
      gain.connect(filterNode!);
      osc.start();
      osc.stop(audioContext!.currentTime + 1);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) melodyPlay();
    }, 5000);

    stopVoices.push(() => clearInterval(interval));
  };

  const createDrumVoice = () => {
    const drumPlay = () => {
      const bufferSize = audioContext!.sampleRate * 0.2;
      const buffer = audioContext!.createBuffer(1, bufferSize, audioContext!.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioContext!.createBufferSource();
      noise.buffer = buffer;
      const gain = audioContext!.createGain();
      gain.gain.setValueAtTime(0.02, audioContext!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext!.currentTime + 0.2);
      noise.connect(gain);
      gain.connect(filterNode!);
      noise.start();
      noise.stop(audioContext!.currentTime + 0.2);
    };

    const interval = setInterval(() => drumPlay(), 4000);
    stopVoices.push(() => clearInterval(interval));
  };

  const start = () => {
    if (isPlaying) return;
    initializeAudioContext();
    if (!audioContext || !filterNode) return;
    if (audioContext.state === 'suspended') audioContext.resume();

    isPlaying = true;
    createChordVoice();
    createBassVoice();
    createMelodyVoice();
    createDrumVoice();

    animationFrame = requestAnimationFrame(function animate() {
      const time = audioContext!.currentTime;
      if (filterNode) {
        const mod = 600 + Math.sin(time * 0.1) * 200 + Math.sin(time * 0.07) * 100;
        filterNode.frequency.setValueAtTime(mod, time);
      }
      animationFrame = requestAnimationFrame(animate);
    });
  };

  const stop = () => {
    if (!isPlaying) return;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    stopVoices.forEach(fn => fn());
    stopVoices.length = 0;
    isPlaying = false;
  };

  const setVolume = (volume: number) => {
    if (masterGainNode) masterGainNode.gain.value = Math.max(0, Math.min(1, volume)) * 0.08;
  };

  const cleanup = () => {
    stop();
    if (audioContext) audioContext.close();
    audioContext = null;
    masterGainNode = null;
    filterNode = null;
  };

  return {
    start,
    stop,
    setVolume,
    cleanup
  };
}