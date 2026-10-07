import { useState } from 'react';
import { Settings as SettingsIcon, X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { useExperienceState } from '../hooks/useExperienceState';

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { audioEnabled, setAudioEnabled, reducedMotion, setReducedMotion, reset } = useExperienceState();

  return (
    <>
      <button 
        style={styles.toggleBtn} 
        onClick={() => setIsOpen(true)}
        aria-label="Open settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div style={styles.drawer}>
          <div style={styles.header}>
            <h3 style={styles.title}>Settings</h3>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          
          <div style={styles.content}>
            <button style={styles.option} onClick={() => setAudioEnabled(!audioEnabled)}>
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{audioEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>
            
            <button style={styles.option} onClick={() => setReducedMotion(!reducedMotion)}>
              {reducedMotion ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{reducedMotion ? 'Reduced Motion On' : 'Reduced Motion Off'}</span>
            </button>

            <div style={styles.divider} />

            <button style={{...styles.option, color: 'var(--color-terracotta)'}} onClick={() => { reset(); setIsOpen(false); }}>
              Exit Experience
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  toggleBtn: {
    position: 'absolute' as const,
    bottom: '2rem',
    right: '2rem',
    opacity: 0.5,
    transition: 'opacity 200ms ease',
    pointerEvents: 'auto' as const,
  },
  drawer: {
    position: 'absolute' as const,
    bottom: '5rem',
    right: '2rem',
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    width: '240px',
    pointerEvents: 'auto' as const,
    color: 'var(--color-muted-cream)',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '0.875rem',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    opacity: 0.7,
  },
  closeBtn: {
    opacity: 0.5,
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
    fontSize: '0.875rem',
    opacity: 0.9,
    transition: 'opacity 200ms',
    textAlign: 'left' as const,
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: '0.5rem 0',
  }
};
