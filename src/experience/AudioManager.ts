import { useExperienceState } from '../hooks/useExperienceState';

class SynthesizedAudio {
  private ctx: AudioContext | null = null;
  private humOscillator: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playHum() {
    this.init();
    if (!this.ctx) return;
    if (this.humOscillator) return;

    this.humOscillator = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();

    this.humOscillator.type = 'sine';
    this.humOscillator.frequency.value = 50; // low hum

    this.humGain.gain.value = 0;
    
    this.humOscillator.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    
    this.humOscillator.start();
    
    // fade in
    this.humGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1);
  }

  stopHum() {
    if (this.humGain && this.ctx) {
      this.humGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.humOscillator) {
          this.humOscillator.stop();
          this.humOscillator = null;
        }
      }, 1000);
    }
  }

  playDing() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.setValueAtTime(700, this.ctx.currentTime + 0.2); // F5
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }
}

export const audioManager = new SynthesizedAudio();

// Set up a listener for phase changes to trigger audio
useExperienceState.subscribe((state, prevState) => {
  if (!state.audioEnabled) {
    audioManager.stopHum();
    return;
  }

  if (state.phase === 'TRAVELLING' && prevState.phase !== 'TRAVELLING') {
    audioManager.playHum();
  } else if (state.phase === 'DOORS_OPENING' && prevState.phase === 'TRAVELLING') {
    audioManager.stopHum();
    audioManager.playDing();
  } else if (state.phase === 'INTRO' || state.phase === 'ENDING') {
    audioManager.stopHum();
  }
});
