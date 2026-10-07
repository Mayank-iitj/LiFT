import { useState } from 'react';
import { useExperienceState } from '../hooks/useExperienceState';
import { audioManager } from '../experience/AudioManager';

export function Intro() {
  const { setPhase, setAudioEnabled } = useExperienceState();
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    audioManager.init();
    setIsFading(true);
    setAudioEnabled(true);
    setTimeout(() => {
      setPhase('ELEVATOR');
    }, 2000);
  };

  return (
    <div style={{
      ...styles.container,
      opacity: isFading ? 0 : 1,
      pointerEvents: isFading ? 'none' : 'auto'
    }}>
      <div className="cinematic-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="title-text">LIFT</h1>
        <p className="subtitle-text">The Building Remembers</p>
        
        <button className="enter-button" onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#050505',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    transition: 'opacity 2s ease-in-out',
  }
};
