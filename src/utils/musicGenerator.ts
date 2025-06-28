// CampfireMusicGenerator with proper audio node lifecycle management

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

  // Store all active audio nodes and intervals for proper cleanup
  let activeOscillators: OscillatorNode[] = [];
  let activeGains: GainNode[] = [];
  let activeIntervals: NodeJS.Timeout[] = [];
  let activeTimeouts: NodeJS.Timeout[] = [];

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

  const cleanupAudioNodes = () => {
    // Stop and disconnect all oscillators
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    activeOscillators = [];

    // Disconnect all gain nodes
    activeGains.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Gain might already be disconnected
      }
    });
    activeGains = [];

    // Clear all intervals
    activeIntervals.forEach(interval => clearInterval(interval));
    activeIntervals = [];

    // Clear all timeouts
    activeTimeouts.forEach(timeout => clearTimeout(timeout));
    activeTimeouts = [];

    // Cancel animation frame
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const createChordVoice = () => {
    if (!audioContext || !filterNode) return;

    const baseFrequencies = [130.81, 164.81, 196.0, 261.63, 329.63];

    baseFrequencies.forEach((freq, index) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      
      osc.type = index < 2 ? 'sine' : (index % 2 === 0 ? 'triangle' : 'sawtooth');
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 10;
      gain.gain.value = (index < 2 ? 0.3 : 0.2) * (0.8 + Math.random() * 0.4);
      
      osc.connect(gain);
      gain.connect(filterNode!);
      osc.start();
      
      // Store references for cleanup
      activeOscillators.push(osc);
      activeGains.push(gain);
    });
  };

  const createBassVoice = () => {
    if (!audioContext || !filterNode) return;

    const bassOsc = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    const notes = [65.41, 73.42, 98.0];
    let noteIndex = 0;

    bassOsc.type = 'triangle';
    bassOsc.frequency.value = notes[0];
    bassGain.gain.value = 0.08;
    bassOsc.connect(bassGain);
    bassGain.connect(filterNode);
    bassOsc.start();

    // Store references for cleanup
    activeOscillators.push(bassOsc);
    activeGains.push(bassGain);

    const bassInterval = setInterval(() => {
      if (!isPlaying) return;
      noteIndex = (noteIndex + 1) % notes.length;
      try {
        bassOsc.frequency.setValueAtTime(notes[noteIndex], audioContext!.currentTime);
      } catch (e) {
        // Oscillator might be stopped
      }
    }, 4000);

    activeIntervals.push(bassInterval);
  };

  const createMelodyVoice = () => {
    if (!audioContext || !filterNode) return;

    const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99];
    
    const playMelodyNote = () => {
      if (!isPlaying || !audioContext || !filterNode) return;

      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = note;
      gain.gain.setValueAtTime(0.01, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
      
      osc.connect(gain);
      gain.connect(filterNode);
      osc.start();
      osc.stop(audioContext.currentTime + 1);

      // Clean up this temporary oscillator after it stops
      const cleanup = setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (e) {
          // Already disconnected
        }
      }, 1100);

      activeTimeouts.push(cleanup);
    };

    const melodyInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        playMelodyNote();
      }
    }, 5000);

    activeIntervals.push(melodyInterval);
  };

  const createDrumVoice = () => {
    if (!audioContext || !filterNode) return;

    const playDrumSound = () => {
      if (!isPlaying || !audioContext || !filterNode) return;

      const bufferSize = audioContext.sampleRate * 0.2;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      
      noise.buffer = buffer;
      gain.gain.setValueAtTime(0.02, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
      
      noise.connect(gain);
      gain.connect(filterNode);
      noise.start();
      noise.stop(audioContext.currentTime + 0.2);

      // Clean up this temporary buffer source after it stops
      const cleanup = setTimeout(() => {
        try {
          noise.disconnect();
          gain.disconnect();
        } catch (e) {
          // Already disconnected
        }
      }, 300);

      activeTimeouts.push(cleanup);
    };

    const drumInterval = setInterval(() => {
      playDrumSound();
    }, 4000);

    activeIntervals.push(drumInterval);
  };

  const startFilterAnimation = () => {
    if (!audioContext || !filterNode) return;

    const animate = () => {
      if (!isPlaying || !audioContext || !filterNode) return;

      const time = audioContext.currentTime;
      const modulation = 600 + Math.sin(time * 0.1) * 200 + Math.sin(time * 0.07) * 100;
      
      try {
        filterNode.frequency.setValueAtTime(modulation, time);
      } catch (e) {
        // Filter might be disconnected
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
  };

  const start = () => {
    if (isPlaying) return;

    initializeAudioContext();
    if (!audioContext || !filterNode) return;

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    isPlaying = true;

    // Create all voices
    createChordVoice();
    createBassVoice();
    createMelodyVoice();
    createDrumVoice();
    startFilterAnimation();
  };

  const stop = () => {
    if (!isPlaying) return;

    isPlaying = false;
    cleanupAudioNodes();
  };

  const setVolume = (volume: number) => {
    if (masterGainNode) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      masterGainNode.gain.value = clampedVolume * 0.08;
    }
  };

  const cleanup = () => {
    stop();
    
    // Close audio context
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    
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