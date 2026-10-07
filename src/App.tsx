import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useExperienceState } from './hooks/useExperienceState';
import { Experience } from './experience/Experience';
import { Intro } from './components/Intro';
import { Ending } from './components/Ending';
import { StoryOverlay } from './components/StoryOverlay';
import { Settings } from './components/Settings';
import { Leva } from 'leva';

export default function App() {
  const { phase, setDemoMode, reset } = useExperienceState();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      setDemoMode(true);
      reset(); // Starts at INTRO, but we could skip to ELEVATOR in demo
    }
  }, [setDemoMode, reset]);

  return (
    <>
      {phase !== 'INTRO' && phase !== 'ENDING' && (
        <div className="canvas-container">
          <Canvas
            shadows
            camera={{ position: [0, 1.6, 2], fov: 60 }}
            gl={{ antialias: true, toneMappingExposure: 1 }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div className="ui-layer">
        <Leva hidden />
        {phase === 'INTRO' && <Intro />}
        {phase !== 'INTRO' && phase !== 'ENDING' && <StoryOverlay />}
        {phase === 'ENDING' && <Ending />}
        <Settings />
      </div>
    </>
  );
}
