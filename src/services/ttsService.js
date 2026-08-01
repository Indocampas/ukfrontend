// src/services/ttsService.js

/**
 * Text-to-Speech service using Web Speech API
 * Supports multiple languages and voices
 */

// Voice preferences by language
const VOICE_PREFERENCES = {
  'en-US': {
    name: 'Google US English',
    lang: 'en-US',
    rate: 1.0,
    pitch: 1.0,
  },
  'en-GB': {
    name: 'Google UK English Female',
    lang: 'en-GB',
    rate: 0.95,
    pitch: 1.05,
  },
  'en-IN': {
    name: 'Google India English',
    lang: 'en-IN',
    rate: 0.9,
    pitch: 1.1,
  },
};

class TTSService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.utterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.voice = null;
    this.rate = 0.95;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.lang = 'en-US';
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;
    this.onPause = null;
    this.onResume = null;
    this.supported = 'speechSynthesis' in window;
  }

  /**
   * Initialize TTS with preferred voice
   */
  init(lang = 'en-US') {
    if (!this.supported) {
      console.warn('Text-to-Speech is not supported in this browser');
      return false;
    }

    this.lang = lang;
    this.loadVoices();
    return true;
  }

  /**
   * Load available voices and set preferred
   */
  loadVoices() {
    if (!this.supported) return;

    const voices = this.synthesis.getVoices();
    if (voices.length === 0) {
      // Voices not loaded yet, wait for them
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
      return;
    }

    // Try to find preferred voice
    const preferred = VOICE_PREFERENCES[this.lang];
    if (preferred) {
      this.voice = voices.find(v => 
        v.name.includes(preferred.name) || 
        v.lang.includes(preferred.lang)
      ) || voices[0];
      this.rate = preferred.rate;
      this.pitch = preferred.pitch;
    } else {
      // Fallback to first available voice
      this.voice = voices[0] || null;
    }

    // If no voice found, use default
    if (!this.voice && voices.length > 0) {
      this.voice = voices[0];
    }
  }

  /**
   * Speak text with optional callbacks
   */
  speak(text, options = {}) {
    if (!this.supported) {
      console.warn('Text-to-Speech not supported');
      return false;
    }

    // Stop any current speech
    this.stop();

    // Create new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (this.voice) {
      this.utterance.voice = this.voice;
    }
    
    // Set properties
    this.utterance.rate = options.rate || this.rate;
    this.utterance.pitch = options.pitch || this.pitch;
    this.utterance.volume = options.volume || this.volume;
    this.utterance.lang = options.lang || this.lang;

    // Set callbacks
    this.utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (this.onStart) this.onStart();
      if (options.onStart) options.onStart();
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (this.onEnd) this.onEnd();
      if (options.onEnd) options.onEnd();
    };

    this.utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.isPaused = false;
      const error = event.error || 'Unknown error';
      if (this.onError) this.onError(error);
      if (options.onError) options.onError(error);
    };

    this.utterance.onpause = () => {
      this.isPaused = true;
      if (this.onPause) this.onPause();
      if (options.onPause) options.onPause();
    };

    this.utterance.onresume = () => {
      this.isPaused = false;
      if (this.onResume) this.onResume();
      if (options.onResume) options.onResume();
    };

    // Speak
    this.synthesis.speak(this.utterance);
    return true;
  }

  /**
   * Stop current speech
   */
  stop() {
    if (!this.supported) return;
    this.synthesis.cancel();
    this.isSpeaking = false;
    this.isPaused = false;
    this.utterance = null;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (!this.supported || !this.isSpeaking || this.isPaused) return;
    this.synthesis.pause();
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (!this.supported || !this.isPaused) return;
    this.synthesis.resume();
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (this.isPaused) {
      this.resume();
      return 'resumed';
    } else if (this.isSpeaking) {
      this.pause();
      return 'paused';
    }
    return 'idle';
  }

  /**
   * Check if currently speaking
   */
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  /**
   * Check if currently paused
   */
  isCurrentlyPaused() {
    return this.isPaused;
  }

  /**
   * Get available voices
   */
  getVoices() {
    if (!this.supported) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Set voice by name or language
   */
  setVoice(voiceName) {
    if (!this.supported) return false;
    const voices = this.synthesis.getVoices();
    const found = voices.find(v => 
      v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
      v.lang.includes(voiceName)
    );
    if (found) {
      this.voice = found;
      return true;
    }
    return false;
  }

  /**
   * Set speech rate (0.1 - 10)
   */
  setRate(rate) {
    this.rate = Math.max(0.1, Math.min(10, rate));
  }

  /**
   * Set speech pitch (0 - 2)
   */
  setPitch(pitch) {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  /**
   * Set volume (0 - 1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    this.lang = lang;
    this.loadVoices();
  }

  /**
   * Clean up
   */
  destroy() {
    this.stop();
    this.utterance = null;
    this.voice = null;
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;
    this.onPause = null;
    this.onResume = null;
  }
}

// Create singleton instance
const tts = new TTSService();

// Initialize on load
if (tts.supported) {
  // Load voices when available
  if (tts.synthesis.getVoices().length > 0) {
    tts.loadVoices();
  } else {
    tts.synthesis.onvoiceschanged = () => {
      tts.loadVoices();
    };
  }
}

export default tts;