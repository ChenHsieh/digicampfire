export interface NoiseGenerator {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  cleanup: () => void;
}

export function createCampfireNoiseGenerator(): NoiseGenerator {
  let audioContext: AudioContext | null = null;
  let whiteNoiseNode: AudioBufferSourceNode | null = null;
  let pinkNoiseNode: AudioBufferSourceNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;

  const initializeAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0.15; // Keep it subtle like a distant campfire
      gainNode.connect(audioContext.destination);
    }
  };

  const createWhiteNoiseBuffer = (duration: number = 2): AudioBuffer => {
    if (!audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const output = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < frameCount; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  };

  const createPinkNoiseBuffer = (duration: number = 2): AudioBuffer => {
    if (!audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const output = buffer.getChannelData(0);

    // Pink noise generation using Paul Kellet's algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  };

  const createMixedNoiseBuffer = (duration: number = 2): AudioBuffer => {
    if (!audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const output = buffer.getChannelData(0);

    // Create both white and pink noise components
    const whiteBuffer = createWhiteNoiseBuffer(duration);
    const pinkBuffer = createPinkNoiseBuffer(duration);
    
    const whiteData = whiteBuffer.getChannelData(0);
    const pinkData = pinkBuffer.getChannelData(0);

    // Mix white and pink noise (more pink for warmth, less white for texture)
    for (let i = 0; i < frameCount; i++) {
      // 70% pink noise, 30% white noise for a warm, crackling campfire feel
      output[i] = (pinkData[i] * 0.7 + whiteData[i] * 0.3) * 0.8;
      
      // Add subtle amplitude modulation to simulate crackling
      const modulation = 1 + Math.sin(i * 0.001) * 0.1 + Math.sin(i * 0.003) * 0.05;
      output[i] *= modulation;
    }

    return buffer;
  };

  const start = () => {
    if (isPlaying) return;

    try {
      initializeAudioContext();
      
      if (!audioContext || !gainNode) return;

      // Resume audio context if it's suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create mixed noise buffer
      const noiseBuffer = createMixedNoiseBuffer(2);
      
      // Create and configure the noise source
      whiteNoiseNode = audioContext.createBufferSource();
      whiteNoiseNode.buffer = noiseBuffer;
      whiteNoiseNode.loop = true;
      whiteNoiseNode.connect(gainNode);
      
      // Start playing
      whiteNoiseNode.start();
      isPlaying = true;

    } catch (error) {
      console.warn('Failed to start campfire noise:', error);
    }
  };

  const stop = () => {
    if (!isPlaying) return;

    try {
      if (whiteNoiseNode) {
        whiteNoiseNode.stop();
        whiteNoiseNode.disconnect();
        whiteNoiseNode = null;
      }
      
      if (pinkNoiseNode) {
        pinkNoiseNode.stop();
        pinkNoiseNode.disconnect();
        pinkNoiseNode = null;
      }
      
      isPlaying = false;
    } catch (error) {
      console.warn('Failed to stop campfire noise:', error);
    }
  };

  const setVolume = (volume: number) => {
    if (gainNode) {
      // Clamp volume between 0 and 1, and apply a curve for better control
      const clampedVolume = Math.max(0, Math.min(1, volume));
      gainNode.gain.value = clampedVolume * 0.15; // Max volume is still subtle
    }
  };

  const cleanup = () => {
    stop();
    
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    
    gainNode = null;
  };

  return {
    start,
    stop,
    setVolume,
    cleanup
  };
}