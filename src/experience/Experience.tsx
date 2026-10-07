import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useExperienceState } from '../hooks/useExperienceState';
import { ElevatorScene } from '../scenes/ElevatorScene';
import { RoomScene } from '../scenes/RoomScene';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

export function Experience() {
  const { phase, focusObject } = useExperienceState();
  useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 1.4, -1));
  const cameraPos = useRef(new THREE.Vector3(0, 1.4, 0.8));
  const targetZoom = useRef(0);

  // Handle Scroll to Zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (useExperienceState.getState().phase === 'DISCOVERY' && !useExperienceState.getState().focusObject) {
        targetZoom.current += e.deltaY * 0.002;
        targetZoom.current = Math.max(-2.5, Math.min(1.0, targetZoom.current)); // Clamp zoom range
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Reset camera when un-focusing or phase changes
  useEffect(() => {
    if (phase === 'ELEVATOR' || phase === 'INTRO') {
      cameraPos.current.set(0, 1.4, 0.8);
      cameraTarget.current.set(0, 1.4, -1);
    }
  }, [phase]);

  useFrame((state, delta) => {
    if (phase === 'TRAVELLING') {
      const time = state.clock.getElapsedTime();
      cameraPos.current.y = 1.4 + Math.sin(time * 25) * 0.003;
      cameraPos.current.x = Math.sin(time * 15) * 0.001;
    } else if (focusObject) {
      // Cinematic glide to object
      if (focusObject === 'laptop') {
        cameraPos.current.lerp(new THREE.Vector3(0, 1.1, -2.5), 2 * delta);
        cameraTarget.current.lerp(new THREE.Vector3(0, 0.825, -3.4), 2 * delta);
      } else if (focusObject === 'phone') {
        cameraPos.current.lerp(new THREE.Vector3(0.5, 1.0, -2.5), 2 * delta);
        cameraTarget.current.lerp(new THREE.Vector3(0.7, 0.825, -3.2), 2 * delta);
      } else if (focusObject === 'chai') {
        cameraPos.current.lerp(new THREE.Vector3(-0.5, 1.0, -2.5), 2 * delta);
        cameraTarget.current.lerp(new THREE.Vector3(-0.8, 0.825, -3.1), 2 * delta);
      } else if (focusObject === 'idol') {
        cameraPos.current.lerp(new THREE.Vector3(0.3, 1.0, -2.5), 2 * delta);
        cameraTarget.current.lerp(new THREE.Vector3(0.4, 0.825, -3.1), 2 * delta);
      }
    } else if (phase === 'DISCOVERY' || phase === 'ENDING') {
      // Highly Interactive Mouse Look & Scroll Zoom
      cameraPos.current.lerp(new THREE.Vector3(0, 1.4, 0.2 + targetZoom.current), 3 * delta);
      
      const mouseX = (state.pointer.x * Math.PI) / 4; // Wider look left/right
      const mouseY = (state.pointer.y * Math.PI) / 6;  // Wider look up/down
      cameraTarget.current.lerp(new THREE.Vector3(mouseX * 3, 1.4 + mouseY * 3, -3.5), 4 * delta);
    } else if (phase !== 'DOORS_OPENING') {
      // Base Elevator Mouse Look
      cameraPos.current.lerp(new THREE.Vector3(0, 1.4, 0.8), 2 * delta);
      const mouseX = (state.pointer.x * Math.PI) / 8;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      cameraTarget.current.lerp(new THREE.Vector3(mouseX * 2, 1.4 + mouseY * 2, -1), 2 * delta);
    }

    state.camera.position.lerp(cameraPos.current, 5 * delta);
    state.camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      <Environment preset="apartment" />
      <ambientLight intensity={phase === 'DISCOVERY' ? 0.4 : 0.2} color="#fff" />
      
      {(phase === 'ELEVATOR' || phase === 'SELECTED_FLOOR' || phase === 'TRAVELLING' || phase === 'DOORS_OPENING') && (
        <ElevatorScene />
      )}
      
      {(phase === 'DOORS_OPENING' || phase === 'DISCOVERY' || phase === 'ENDING') && (
        <RoomScene />
      )}

      {/* Cinematic Post-Processing */}
      <EffectComposer multisampling={4}>
        <Bloom 
          luminanceThreshold={1.5} 
          luminanceSmoothing={0.9} 
          intensity={0.5} 
          mipmapBlur 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        {focusObject && (
          <DepthOfField 
            focusDistance={0.015} 
            focalLength={0.02} 
            bokehScale={4} 
            height={480} 
          />
        )}
      </EffectComposer>
    </>
  );
}
