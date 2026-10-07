import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useExperienceState } from '../hooks/useExperienceState';
import { FloorPanel } from '../components/FloorPanel';
import { ElevatorDoors } from '../components/ElevatorDoors';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ElevatorScene() {
  const { phase } = useExperienceState();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (phase === 'TRAVELLING' && lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.intensity = 1.0 + Math.sin(time * 60) * 0.1;
    } else if (lightRef.current) {
      lightRef.current.intensity = 1.0;
    }
  });

  return (
    <group>
      {/* Elevator Light - Realistic Overhead Panel */}
      <mesh position={[0, 2.9, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 2.8, 0]} intensity={1.0} color="#f0f5ff" distance={6} castShadow />
      
      {/* Left Wall - Brushed Metal */}
      <mesh position={[-1, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.05, 3, 2]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.4} />
      </mesh>
      
      {/* Right Wall - Brushed Metal */}
      <mesh position={[1, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.05, 3, 2]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Back Wall - Mirror */}
      <mesh position={[0, 1.5, 1]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[2, 3]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.8}
          mirror={1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[2, 0.05, 2]} />
        <meshStandardMaterial color="#222" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[2, 0.05, 2]} />
        <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Handrails */}
      <mesh position={[-0.95, 1.0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 16]} />
        <meshStandardMaterial color="#ddd" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0.95, 1.0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 16]} />
        <meshStandardMaterial color="#ddd" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.0, 0.95]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 16]} />
        <meshStandardMaterial color="#ddd" metalness={1} roughness={0.1} />
      </mesh>

      {/* Panel */}
      {/* Positioned on the right wall, facing left */}
      <FloorPanel position={[0.96, 1.2, -0.4]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Doors - Front */}
      <ElevatorDoors position={[0, 1.5, -1]} />
    </group>
  );
}
