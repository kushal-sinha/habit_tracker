import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import type { CharacterMood } from '@/types/habit';
import type { CharacterSkin } from '@/types/achievements';

function CharacterMesh({ mood, skin }: { mood: CharacterMood; skin: CharacterSkin }) {
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

  const { theme } = skin;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* ========== NARUTO (ninja): orange jacket, headband, spiky blonde hair ========== */}
      {theme === 'ninja' && (
        <>
          <mesh ref={body} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} metalness={0.05} />
          </mesh>
          <mesh ref={head} position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} metalness={0.05} />
          </mesh>
          <mesh position={[-0.1, 0.92, 0.32]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.1, 0.92, 0.32]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          {/* Headband - blue with metal plate */}
          <group position={[0, 1.02, 0.25]} rotation={[0.12, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.55, 0.07, 0.06]} />
              <meshStandardMaterial color={skin.accentColor} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <boxGeometry args={[0.12, 0.1, 0.02]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
          {/* Spiky blonde hair */}
          <group position={[0, 1.12, -0.05]}>
            {[-0.22, -0.08, 0.06, 0.2].map((x, i) => (
              <mesh key={i} position={[x, 0.08 + i * 0.03, 0]} rotation={[-0.4 - i * 0.08, 0, 0]}>
                <coneGeometry args={[0.07, 0.18, 5]} />
                <meshStandardMaterial color="#fde047" roughness={0.6} />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* ========== HULK (titan): green, muscular, shorts, belt, fists ========== */}
      {theme === 'titan' && (
        <>
          {/* Chest - broad */}
          <mesh ref={body} position={[0, 0.35, 0]} scale={[1.2, 1.1, 0.95]}>
            <sphereGeometry args={[0.48, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.65} metalness={0.05} />
          </mesh>
          {/* Abs suggestion - lower torso */}
          <mesh position={[0, 0.02, 0.05]} scale={[0.9, 0.5, 0.85]}>
            <sphereGeometry args={[0.35, 20, 20]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.6} />
          </mesh>
          {/* Thick arms */}
          <mesh position={[-0.55, 0.4, 0.08]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.55, 0.4, 0.08]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} />
          </mesh>
          {/* Big clenched fists */}
          <mesh position={[-0.58, 0.25, 0.25]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.58, 0.25, 0.25]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} />
          </mesh>
          {/* Shorts - tattered dark grey */}
          <mesh position={[0, -0.22, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.38, 0.2, 20]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Belt */}
          <mesh position={[0, -0.08, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.06, 24]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.08, 0.18]}>
            <boxGeometry args={[0.2, 0.08, 0.04]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.5} />
          </mesh>
          {/* Head - green, strong jaw */}
          <mesh ref={head} position={[0, 0.9, 0]} scale={[1.05, 1, 0.95]}>
            <sphereGeometry args={[0.36, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.55} />
          </mesh>
          {/* Angry eyes / brow */}
          <mesh position={[-0.12, 0.96, 0.28]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.12, 0.96, 0.28]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0, 0.98, 0.22]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.35, 0.04, 0.02]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
        </>
      )}

      {/* ========== CAPTAIN AMERICA (captain): shield, star on chest, red/white/blue ========== */}
      {theme === 'captain' && (
        <>
          <mesh ref={body} position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Star on chest */}
          <mesh position={[0, 0.32, 0.52]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.2, 0.2, 0.03]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.5} />
          </mesh>
          <mesh ref={head} position={[0, 0.88, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.11, 0.94, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.11, 0.94, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          {/* Shield - circular, held to side */}
          <group position={[0.5, 0.35, 0.1]} rotation={[0, 0, -0.3]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.06, 32]} />
              <meshStandardMaterial color="#dc2626" metalness={0.2} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.32, 32]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, Math.PI / 5]}>
              <boxGeometry args={[0.08, 0.08, 0.02]} />
              <meshStandardMaterial color="#1e40af" roughness={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* ========== DEFAULT / STARTER ========== */}
      {theme === 'starter' && (
        <>
          <mesh ref={body} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh ref={head} position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh position={[-0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
        </>
      )}

      {/* ========== WARRIOR (Dragon): spiky hair ========== */}
      {theme === 'warrior' && (
        <>
          <mesh ref={body} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh ref={head} position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <group position={[0, 1.15, 0]}>
            {[0, 0.5, 1].map((i) => (
              <mesh key={i} position={[(i - 0.5) * 0.2, 0.1 + i * 0.05, 0]} rotation={[-0.3 - i * 0.1, 0, 0]}>
                <coneGeometry args={[0.08, 0.2, 6]} />
                <meshStandardMaterial color={skin.headColor} roughness={0.5} />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* ========== PHOENIX ========== */}
      {theme === 'phoenix' && (
        <>
          <mesh ref={body} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} />
          </mesh>
          <mesh ref={head} position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <group position={[0, 1.2, 0]}>
            <mesh position={[0, 0.08, 0]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.06, 0.15, 6]} />
              <meshStandardMaterial color={skin.accentColor} emissive={skin.lightColor} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[-0.08, 0.05, 0.05]} rotation={[0.3, 0, 0.3]}>
              <coneGeometry args={[0.04, 0.1, 6]} />
              <meshStandardMaterial color={skin.accentColor} emissive={skin.lightColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.08, 0.05, 0.05]} rotation={[0.3, 0, -0.3]}>
              <coneGeometry args={[0.04, 0.1, 6]} />
              <meshStandardMaterial color={skin.accentColor} emissive={skin.lightColor} emissiveIntensity={0.2} />
            </mesh>
          </group>
        </>
      )}

      {/* ========== LEGEND / MYTHIC: crown ========== */}
      {(theme === 'legend' || theme === 'mythic') && (
        <>
          <mesh ref={body} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color={skin.bodyColor} roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh ref={head} position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color={skin.headColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <mesh position={[0.12, 0.95, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={skin.accentColor} />
          </mesh>
          <group position={[0, 1.25, 0]}>
            <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.04, 0.2, 6]} />
              <meshStandardMaterial color="#fde047" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[-0.06, 0.14, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.02]} />
              <meshStandardMaterial color="#fde047" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0.06, 0.14, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.02]} />
              <meshStandardMaterial color="#fde047" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.02]} />
              <meshStandardMaterial color="#fde047" metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}

interface Character3DSceneProps {
  mood: CharacterMood;
  skin: CharacterSkin;
  style: object;
}

export function Character3DScene({ mood, skin, style }: Character3DSceneProps) {
  return (
    <Canvas
      style={style}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.25, 2.8], fov: 52 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 3, 2]} intensity={1} />
      <pointLight position={[-1, 1, 1]} intensity={0.5} color={skin.lightColor} />
      <CharacterMesh mood={mood} skin={skin} />
    </Canvas>
  );
}
