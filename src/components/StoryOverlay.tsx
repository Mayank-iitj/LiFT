import { useEffect, useState } from 'react';

export function StoryOverlay() {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleStoryText = (e: CustomEvent<{ text: string, duration?: number }>) => {
      setText(e.detail.text);
      setVisible(true);
      
      if (e.detail.duration) {
        setTimeout(() => setVisible(false), e.detail.duration);
      }
    };
    
    window.addEventListener('story-text' as any, handleStoryText as any);
    return () => window.removeEventListener('story-text' as any, handleStoryText as any);
  }, []);

  return (
    <div style={{...styles.container, opacity: visible ? 1 : 0}}>
      <p className="story-text">{text}</p>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none' as const,
    transition: 'opacity 1500ms ease-in-out',
    textAlign: 'center' as const,
    width: '80%',
    maxWidth: '700px',
  }
};
