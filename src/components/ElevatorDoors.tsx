import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useExperienceState } from '../hooks/useExperienceState';
import * as THREE from 'three';

export function ElevatorDoors({ position }: { position: [number, number, number] }) {
  const { phase } = useExperienceState();
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const isOpen = phase === 'DOORS_OPENING' || phase === 'DISCOVERY' || phase === 'ENDING';
    
    // Target x positions for sliding doors
    const targetLeft = isOpen ? -0.9 : -0.45;
    const targetRight = isOpen ? 0.9 : 0.45;

    if (leftDoorRef.current && rightDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.lerp(leftDoorRef.current.position.x, targetLeft, 2 * delta);
      rightDoorRef.current.position.x = THREE.MathUtils.lerp(rightDoorRef.current.position.x, targetRight, 2 * delta);
    }
  });

  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
        <meshBasicMaterial color="#000" side={THREE.BackSide} />
      </mesh>
      
      {/* Hole for doors (using clipping or just rendering the frame around, simplified here by overlapping walls) */}

      {/* Left Door */}
      <mesh ref={leftDoorRef} position={[-0.45, 0, 0]}>
        <boxGeometry args={[0.9, 3, 0.05]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.5} />
      </mesh>
      
      {/* Right Door */}
      <mesh ref={rightDoorRef} position={[0.45, 0, 0]}>
        <boxGeometry args={[0.9, 3, 0.05]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.5} />
      </mesh>
    </group>
  );
}
