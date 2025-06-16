/**
This is a simple class written with Three.js which will serve the same purpose as the
LAppWavFileHandler, except this one can handle any audio file.
*/
import * as THREE from "three";
export class GenericAudioFileHandler {
  private _threeAudioAnalyser: THREE.AudioAnalyser | null = null;
  private _lastNormalizedAverageFrequency: number | 0;
  /**
   * Get the normalized average frequency using a quintic easing function.
   * @returns {number} Normalized average frequency.
   */
  public getNormalizedAverageFrequency(): number {
    return this._lastNormalizedAverageFrequency;
  }
  /**
   * Load an audio file and play it with Three.js, enabling frequency analysis.
   * @param {string} audioPath - Path to the audio file.
   */
  public loadAudioFile(audioPath: string): void {
    if (!audioPath) {
      return;
    }
    const fftSize = 128;
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const loader = new THREE.AudioLoader();
      loader.load(audioPath, (buffer: THREE.AudioBuffer) => {
        audio.setBuffer(buffer);
        audio.play();
      });
    } else {
      const mediaElement = new Audio(audioPath);
      
      mediaElement.play();
      audio.setMediaElementSource(mediaElement);
    }
    // Initialize the audio analyser.
    this._threeAudioAnalyser = new THREE.AudioAnalyser(audio, fftSize);
  }
  public start(filePath: string): void {
    this._threeAudioAnalyser = null;
    this._lastNormalizedAverageFrequency = 0;
    this.loadAudioFile(filePath);
  }
  public update() {
    if (!this._threeAudioAnalyser) {
      return 0;
    }
    // https://easings.net/#easeInQuint
    const easeInQuint = (x: number): number => {
      return x ** 5;
    };
    const normalize = (value: number, min = 0, max = 100): number => {
      const normalized = (value - min) / (max - min);
      return easeInQuint(normalized);
    };
    const currentAverageFreq = normalize(
      this._threeAudioAnalyser.getAverageFrequency()
    );
    this._lastNormalizedAverageFrequency = currentAverageFreq;
    return true;
  }
  constructor() {
    this._threeAudioAnalyser = null;
    this._lastNormalizedAverageFrequency = 0;
  }
}
