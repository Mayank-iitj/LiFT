import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useExperienceState } from '../hooks/useExperienceState';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export function FloorPanel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const { phase, setPhase, selectedFloor, setSelectedFloor } = useExperienceState();
  const [displayFloor, setDisplayFloor] = useState(1);
  
  const floors = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  useEffect(() => {
    if (phase === 'TRAVELLING') {
      let current = 1;
      const interval = setInterval(() => {
        current++;
        setDisplayFloor(current);
        if (current >= 7) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDisplayFloor(1);
    }
  }, [phase]);

  const handlePress = (floor: number) => {
    if (phase !== 'ELEVATOR' && phase !== 'SELECTED_FLOOR') return;
    
    setSelectedFloor(floor);
    
    if (floor === 7 && phase === 'ELEVATOR') {
      setPhase('SELECTED_FLOOR');
      setTimeout(() => {
        setPhase('TRAVELLING');
        setTimeout(() => {
          setPhase('DOORS_OPENING');
          setTimeout(() => {
            setPhase('DISCOVERY');
          }, 4000);
        }, 6000);
      }, 1500);
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Panel base (Larger now) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.7, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Floor Indicator Display */}
      <mesh position={[0, 0.25, 0.015]}>
        <boxGeometry args={[0.25, 0.1, 0.01]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      
      <Text 
        position={[0, 0.25, 0.021]} 
        fontSize={0.06} 
        color={phase === 'TRAVELLING' ? '#ff3333' : '#aa2222'}
      >
        {phase === 'TRAVELLING' ? displayFloor.toString() : (selectedFloor || '1')}
      </Text>

      {/* Buttons */}
      {floors.map((floor, i) => {
        const x = (i % 3) * 0.1 - 0.1;
        const y = -Math.floor(i / 3) * 0.12 + 0.1;
        const isSelected = selectedFloor === floor;
        const isHoverable = phase === 'ELEVATOR' && floor === 7;
        
        return (
          <Button 
            key={floor} 
            floor={floor} 
            position={[x, y, 0.01]} 
            isSelected={isSelected} 
            onClick={() => handlePress(floor)}
            interactive={isHoverable}
            showHint={isHoverable}
          />
        )
      })}
    </group>
  );
}

function Button({ floor, position, isSelected, onClick, interactive, showHint }: { 
  floor: number, 
  position: [number, number, number], 
  isSelected: boolean, 
  onClick: () => void,
  interactive: boolean,
  showHint: boolean
}) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (showHint && ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
    }
  });
  
  return (
    <group 
      position={position} 
      onClick={interactive ? onClick : undefined}
      onPointerOver={(e) => { e.stopPropagation(); interactive && setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { interactive && setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh position={[0, 0, isSelected ? 0.002 : (hovered ? 0.01 : 0.005)]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.01, 32]} />
        <meshStandardMaterial 
          color={isSelected ? '#d97736' : (hovered ? '#888' : '#333')} 
          metalness={0.7} 
          roughness={0.4} 
          emissive={isSelected ? '#d97736' : '#000'}
          emissiveIntensity={isSelected ? 0.8 : 0}
        />
      </mesh>
      
      {/* Outer Ring Glow for Hint */}
      {showHint && !isSelected && (
        <mesh ref={ringRef} position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.045, 0.003, 16, 32]} />
          <meshBasicMaterial color="#d97736" />
        </mesh>
      )}

      <Text 
        position={[0, 0, isSelected ? 0.01 : (hovered ? 0.018 : 0.013)]} 
        fontSize={0.03} 
        color={isSelected ? '#fff' : (hovered ? '#fff' : '#aaa')}
      >
        {floor}
      </Text>

      {/* HTML Tooltip */}
      {showHint && (
        <Html position={[0.1, 0, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            border: '1px solid #d97736',
            animation: 'pulse 2s infinite'
          }}>
            Press {floor}
          </div>
        </Html>
      )}
    </group>
  );
}
