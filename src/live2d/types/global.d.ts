import * as THREE from "three";

// In a browser environment, the global object is window, not global.
declare global {
  interface Window {
    currentAudio: THREE.Audio | null;
  }
}
