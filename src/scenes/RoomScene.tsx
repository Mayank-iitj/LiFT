import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useExperienceState } from '../hooks/useExperienceState';
import { Text, Html, useGLTF, Clone, Center } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

export function RoomScene() {
  const room = useGLTF('/the_morning_room.glb');
  const lamp = useGLTF('/desk_lamp.glb');
  
  // LEVA GUI for easy adjustment!
  const { tableX, tableY, tableZ, laptopScale, phoneScale, cupScale, lampScale, idolScale, fanScale, fanHeight } = useControls('Align Objects To Table', {
    tableX: { value: 0, min: -5, max: 5, step: 0.05 },
    tableY: { value: 1.2, min: 0, max: 3, step: 0.05 },
    tableZ: { value: -2.5, min: -8, max: 2, step: 0.05 },
    laptopScale: { value: 1.2, min: 0.01, max: 10, step: 0.1 },
    phoneScale: { value: 1.0, min: 0.01, max: 10, step: 0.1 },
    cupScale: { value: 0.8, min: 0.01, max: 10, step: 0.1 },
    lampScale: { value: 0.8, min: 0.01, max: 10, step: 0.1 },
    idolScale: { value: 1.0, min: 0.01, max: 10, step: 0.1 },
    fanScale: { value: 1.0, min: 0.01, max: 10, step: 0.1 },
    fanHeight: { value: 2.8, min: 1, max: 5, step: 0.1 },
  });

  return (
    <group position={[0, 0, -3.5]}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
      
      {/* The Morning Room Model - AS IS, no tampering */}
      <group position={[0, 0, 0]}>
        <primitive object={room.scene} scale={1} />
      </group>

      {/* Dynamic Ceiling Fan */}
      <CeilingFan position={[0, fanHeight, -2.5]} scale={fanScale} />

      {/* Group holding all desk items, driven by Leva UI */}
      <group position={[tableX, tableY, tableZ]}>
        
        {/* Lamp */}
        <group position={[0.8, 0, -0.2]}>
          <Center><primitive object={lamp.scene} scale={lampScale} /></Center>
          <pointLight position={[0, 0.3, 0]} intensity={1.5} color="#ffaa55" distance={3} />
        </group>

        {/* Story Objects */}
        <InteractableLaptop position={[0, 0, 0]} scale={laptopScale} />
        <InteractablePhone position={[0.5, 0, 0.1]} scale={phoneScale} />
        <InteractableChai position={[-0.5, 0, 0.2]} scale={cupScale} />
        <InteractableIdol position={[0.4, 0, -0.3]} scale={idolScale} />
        
      </group>
    </group>
  );
}

function CeilingFan({ position, scale }: { position: [number, number, number], scale: number }) {
  const fanRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/conion__ceiling__fan_12_mb.glb');

  useFrame((_state, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.y += delta * 2; // Spin the fan
    }
  });

  return (
    <group position={position}>
      <group ref={fanRef} scale={scale}>
        <Center>
          <Clone object={gltf.scene} />
        </Center>
      </group>
      
      {/* This light points downward and its shadows get cut by the spinning blades! */}
      <spotLight 
        position={[0, 0.2, 0]} 
        angle={Math.PI / 2} 
        penumbra={1} 
        intensity={2.5} 
        color="#ffccaa" 
        castShadow 
      />
    </group>
  );
}

function InteractableLaptop({ position, scale }: { position: [number, number, number], scale: number }) {
  const [hovered, setHovered] = useState(false);
  const { discoverObject, discoveredObjects, setFocusObject } = useExperienceState();
  const isDiscovered = discoveredObjects.includes('laptop');
  const gltf = useGLTF('/asus_tuf_dash_f15_laptop.glb');

  const handleClick = (e: any) => {
    e.stopPropagation();
    discoverObject('laptop');
    setFocusObject('laptop');
    window.dispatchEvent(new CustomEvent('story-text', { detail: { text: '“Someone has been rehearsing this moment all night.”', duration: 5000 } }));
    setTimeout(() => { useExperienceState.getState().setFocusObject(null); checkEnding(); }, 5000);
  };

  const checkEnding = () => {
    const { discoveredObjects } = useExperienceState.getState();
    if (discoveredObjects.length >= 4) { // NOW 4 OBJECTS!
      setTimeout(() => { useExperienceState.getState().setPhase('ENDING'); }, 7000);
    }
  };

  return (
    <group position={position} onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      <group scale={scale} rotation={[0, 0, 0]}> 
        <Center><Clone object={gltf.scene} /></Center>
      </group>
      {isDiscovered && (
        <>
          <Text position={[0, 0.23, -0.057]} rotation={[-0.2, 0, 0]} fontSize={0.035} color="#fff">Interview</Text>
          <Text position={[0, 0.18, -0.057]} rotation={[-0.2, 0, 0]} fontSize={0.025} color="#aaa">Tomorrow — 10:00 AM</Text>
          <pointLight position={[0, 0.2, 0.1]} intensity={3.0} color="#e0f0ff" distance={1.5} />
        </>
      )}
      {hovered && !isDiscovered && (
        <Html position={[0, 0.4, 0]} center style={{ pointerEvents: 'none' }}><div style={{ background: 'rgba(255,255,255,0.9)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Inspect Laptop</div></Html>
      )}
    </group>
  );
}

function InteractablePhone({ position, scale }: { position: [number, number, number], scale: number }) {
  const [hovered, setHovered] = useState(false);
  const { discoverObject, discoveredObjects, setFocusObject } = useExperienceState();
  const isDiscovered = discoveredObjects.includes('phone');
  const gltf = useGLTF('/iphone_14_pro.glb');

  const handleClick = (e: any) => {
    e.stopPropagation();
    discoverObject('phone');
    setFocusObject('phone');
    window.dispatchEvent(new CustomEvent('story-text', { detail: { text: 'A familiar voice, waiting from somewhere else.', duration: 5000 } }));
    setTimeout(() => { useExperienceState.getState().setFocusObject(null); checkEnding(); }, 5000);
  };

  const checkEnding = () => {
    const { discoveredObjects } = useExperienceState.getState();
    if (discoveredObjects.length >= 4) {
      setTimeout(() => { useExperienceState.getState().setPhase('ENDING'); }, 7000);
    }
  };

  return (
    <group position={position} onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      <group scale={scale} rotation={[-Math.PI / 2, 0, 0]}><Center><Clone object={gltf.scene} /></Center></group>
      {isDiscovered && <pointLight position={[0, 0.1, 0]} intensity={1.5} color="#ffccaa" distance={0.5} />}
      {hovered && !isDiscovered && (
        <Html position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}><div style={{ background: 'rgba(255,255,255,0.9)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Inspect Phone</div></Html>
      )}
    </group>
  );
}

function InteractableChai({ position, scale }: { position: [number, number, number], scale: number }) {
  const [hovered, setHovered] = useState(false);
  const { discoverObject, discoveredObjects, setFocusObject } = useExperienceState();
  const isDiscovered = discoveredObjects.includes('chai');
  const gltf = useGLTF('/coffee_cup.glb');

  const handleClick = (e: any) => {
    e.stopPropagation();
    discoverObject('chai');
    setFocusObject('chai');
    window.dispatchEvent(new CustomEvent('story-text', { detail: { text: 'Still warm.\nNo one has taken a sip in twenty minutes.', duration: 5000 } }));
    setTimeout(() => { useExperienceState.getState().setFocusObject(null); checkEnding(); }, 5000);
  };

  const checkEnding = () => {
    const { discoveredObjects } = useExperienceState.getState();
    if (discoveredObjects.length >= 4) {
      setTimeout(() => { useExperienceState.getState().setPhase('ENDING'); }, 7000);
    }
  };

  return (
    <group position={position} onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      <group scale={scale}><Center><Clone object={gltf.scene} /></Center></group>
      {isDiscovered && (
        <group position={[0, 0.2, 0]}>
          <mesh><planeGeometry args={[0.06, 0.15]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} /></mesh>
        </group>
      )}
      {hovered && !isDiscovered && (
        <Html position={[0, 0.25, 0]} center style={{ pointerEvents: 'none' }}><div style={{ background: 'rgba(255,255,255,0.9)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Inspect Cup</div></Html>
      )}
    </group>
  );
}

function InteractableIdol({ position, scale }: { position: [number, number, number], scale: number }) {
  const [hovered, setHovered] = useState(false);
  const { discoverObject, discoveredObjects, setFocusObject } = useExperienceState();
  const isDiscovered = discoveredObjects.includes('idol');
  const gltf = useGLTF('/white_ganesh.glb');

  const handleClick = (e: any) => {
    e.stopPropagation();
    discoverObject('idol');
    setFocusObject('idol');
    window.dispatchEvent(new CustomEvent('story-text', { detail: { text: 'Watching over from 2,000 kilometers away.', duration: 5000 } }));
    setTimeout(() => { useExperienceState.getState().setFocusObject(null); checkEnding(); }, 5000);
  };

  const checkEnding = () => {
    const { discoveredObjects } = useExperienceState.getState();
    if (discoveredObjects.length >= 4) {
      setTimeout(() => { useExperienceState.getState().setPhase('ENDING'); }, 7000);
    }
  };

  return (
    <group position={position} onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      <group scale={scale}><Center><Clone object={gltf.scene} /></Center></group>
      {isDiscovered && <pointLight position={[0, 0.3, 0]} intensity={1.5} color="#ffe0a0" distance={1.0} />}
      {hovered && !isDiscovered && (
        <Html position={[0, 0.3, 0]} center style={{ pointerEvents: 'none' }}><div style={{ background: 'rgba(255,255,255,0.9)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Inspect Idol</div></Html>
      )}
    </group>
  );
}

// Preload assets
useGLTF.preload('/the_morning_room.glb');
useGLTF.preload('/desk_lamp.glb');
useGLTF.preload('/asus_tuf_dash_f15_laptop.glb');
useGLTF.preload('/iphone_14_pro.glb');
useGLTF.preload('/coffee_cup.glb');
useGLTF.preload('/conion__ceiling__fan_12_mb.glb');
useGLTF.preload('/white_ganesh.glb');
