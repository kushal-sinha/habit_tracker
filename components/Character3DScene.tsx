import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import type { CharacterMood } from '@/types/habit';

function CharacterMesh({ mood }: { mood: CharacterMood }) {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  const moodTime = useRef(0);
  const prevMood = useRef(mood);

  useEffect(() => {
    if (mood !== prevMood.current) {
      prevMood.current = mood;
      moodTime.current = 0;
    }
  }, [mood]);

  useFrame((_, delta) => {
    time.current += delta;
    moodTime.current += delta;
    const t = time.current;
    const mt = moodTime.current;

    if (!group.current || !head.current || !body.current) return;

    const floatY = Math.sin(t * 1.2) * 0.08;
    const breathe = 1 + Math.sin(t * 2) * 0.06;
    group.current.position.y = floatY;
    body.current.scale.setScalar(breathe);

    if (mood === 'habit_completed') {
      const jump = Math.min(1, mt * 4);
      const y = Math.sin(jump * Math.PI) * 0.4;
      group.current.position.y = floatY + y;
    } else if (mood === 'all_completed') {
      const spin = Math.min(1, mt * 0.8);
      group.current.rotation.y = spin * Math.PI * 2;
      group.current.position.y = floatY + Math.sin(spin * Math.PI) * 0.3;
    } else if (mood === 'streak_broken') {
      group.current.rotation.x = Math.sin(t * 0.8) * 0.15;
      group.current.position.y = floatY - 0.1;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh ref={body} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh ref={head} position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#c4b5fd" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-0.12, 0.95, 0.3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.12, 0.95, 0.3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}

interface Character3DSceneProps {
  mood: CharacterMood;
  style: object;
}

export function Character3DScene({ mood, style }: Character3DSceneProps) {
  return (
    <Canvas
      style={style}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.25, 2.8], fov: 52 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 3, 2]} intensity={1} />
      <pointLight position={[-1, 1, 1]} intensity={0.5} color="#a78bfa" />
      <CharacterMesh mood={mood} />
    </Canvas>
  );
}
