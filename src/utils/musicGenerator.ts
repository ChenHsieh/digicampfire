export interface MusicGenerator {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  cleanup: () => void;
}

export function createCampfireMusicGenerator(): MusicGenerator {
  let audioContext: AudioContext | null = null;
  let oscillators: OscillatorNode[] = [];
  let gainNodes: GainNode[] = [];
  let masterGainNode: GainNode | null = null;
  let filterNode: BiquadFilterNode | null = null;
  let isPlaying = false;
  let animationFrame: number | null = null;

  const initializeAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node
      masterGainNode = audioContext.createGain();
      masterGainNode.gain.value = 0.08; // Very subtle background music
      
      // Create a low-pass filter for warmth
      filterNode = audioContext.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 800; // Warm, mellow frequencies
      filterNode.Q.value = 1;
      
      // Connect filter to master gain to destination
      filterNode.connect(masterGainNode);
      masterGainNode.connect(audioContext.destination);
    }
  };

  const createHarmoniousChord = () => {
    if (!audioContext || !filterNode) return;

    // Clear existing oscillators
    oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignore errors from already stopped oscillators
      }
    });
    gainNodes.forEach(gain => gain.disconnect());
    oscillators = [];
    gainNodes = [];

    // Create a warm, ambient chord progression
    // Using frequencies that create a peaceful, campfire-like atmosphere
    const baseFrequencies = [
      130.81, // C3
      164.81, // E3
      196.00, // G3
      261.63, // C4
      329.63, // E4
    ];

    baseFrequencies.forEach((freq, index) => {
      // Create oscillator
      const oscillator = audioContext!.createOscillator();
      const gainNode = audioContext!.createGain();
      
      // Use different waveforms for texture
      const waveforms: OscillatorType[] = ['sine', 'triangle', 'sawtooth'];
      oscillator.type = index < 2 ? 'sine' : waveforms[index % waveforms.length];
      
      // Set frequency with slight detuning for richness
      const detune = (Math.random() - 0.5) * 10; // ±5 cents detuning
      oscillator.frequency.value = freq;
      oscillator.detune.value = detune;
      
      // Set individual gain (lower frequencies slightly louder)
      const baseGain = index < 2 ? 0.3 : 0.2;
      gainNode.gain.value = baseGain * (0.8 + Math.random() * 0.4);
      
      // Connect oscillator -> gain -> filter
      oscillator.connect(gainNode);
      gainNode.connect(filterNode!);
      
      // Store references
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
      
      // Start the oscillator
      oscillator.start();
    });
  };

  const animateMusic = () => {
    if (!isPlaying || !audioContext) return;

    const time = audioContext.currentTime;
    
    // Slowly modulate the filter frequency for gentle movement
    if (filterNode) {
      const filterFreq = 600 + Math.sin(time * 0.1) * 200 + Math.sin(time * 0.07) * 100;
      filterNode.frequency.setValueAtTime(filterFreq, time);
    }
    
    // Gently modulate individual oscillator volumes
    gainNodes.forEach((gainNode, index) => {
      if (gainNode) {
        const baseGain = index < 2 ? 0.3 : 0.2;
        const modulation = Math.sin(time * (0.05 + index * 0.01)) * 0.1;
        const newGain = baseGain * (0.8 + modulation);
        gainNode.gain.setValueAtTime(Math.max(0.05, newGain), time);
      }
    });
    
    // Continue animation
    animationFrame = requestAnimationFrame(animateMusic);
  };

  const start = () => {
    if (isPlaying) return;

    try {
      initializeAudioContext();
      
      if (!audioContext) return;

      // Resume audio context if it's suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create the harmonious chord
      createHarmoniousChord();
      
      // Start the animation loop
      isPlaying = true;
      animateMusic();

    } catch (error) {
      console.warn('Failed to start campfire music:', error);
    }
  };

  const stop = () => {
    if (!isPlaying) return;

    try {
      // Stop animation
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      
      // Stop and disconnect all oscillators
      oscillators.forEach(oscillator => {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (e) {
          // Ignore errors from already stopped oscillators
        }
      });
      
      // Disconnect gain nodes
      gainNodes.forEach(gainNode => {
        try {
          gainNode.disconnect();
        } catch (e) {
          // Ignore errors
        }
      });
      
      // Clear arrays
      oscillators = [];
      gainNodes = [];
      
      isPlaying = false;
    } catch (error) {
      console.warn('Failed to stop campfire music:', error);
    }
  };

  const setVolume = (volume: number) => {
    if (masterGainNode) {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      masterGainNode.gain.value = clampedVolume * 0.08; // Keep it very subtle
    }
  };

  const cleanup = () => {
    stop();
    
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