import { useEffect, useState } from 'react';
import { useExperienceState } from '../hooks/useExperienceState';

export function Ending() {
  const { reset } = useExperienceState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      ...styles.container,
      opacity: visible ? 1 : 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="story-text" style={{ marginBottom: '4rem', fontSize: '1.2rem', color: '#ccc' }}>
          Some days never truly end.<br/>They just wait to be remembered.
        </p>
        
        <button className="enter-button" onClick={reset}>
          Return to Lobby
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
    transition: 'opacity 4s ease-in-out',
  }
};
