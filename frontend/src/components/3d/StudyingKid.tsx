import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function StudyingKid() {
  const groupRef = useRef<Group>(null);
  const bookRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bookDropped, setBookDropped] = useState(false);

  useEffect(() => {
    console.log('StudyingKid component mounted');
  }, []);

  useFrame((state) => {
    if (groupRef.current && !isHovered) {
      // Gentle breathing animation when studying
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }

    if (bookRef.current && !bookDropped) {
      // Book slight movement while reading
      bookRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05;
    }

    if (bookRef.current && bookDropped) {
      // Book falling animation
      if (bookRef.current.position.y > -2) {
        bookRef.current.position.y -= 0.05;
        bookRef.current.rotation.z += 0.1;
      }
    }
  });

  const handlePointerEnter = () => {
    console.log('Kid hovered!');
    setIsHovered(true);
    setBookDropped(true);
    // Reset after 2 seconds
    setTimeout(() => {
      setBookDropped(false);
      setIsHovered(false);
      if (bookRef.current) {
        bookRef.current.position.y = 0.5;
        bookRef.current.rotation.z = 0;
      }
    }, 2000);
  };

  return (
    <group
      ref={groupRef}
      onPointerEnter={handlePointerEnter}
      position={[0, -0.5, 0]}
    >
      {/* Kid Body - Formal Suit */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial color={isHovered ? "#1e3a8a" : "#2563eb"} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Eyes - Angry when hovered */}
      <group position={[0, 0.95, 0.3]}>
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Angry eyebrows */}
        {isHovered && (
          <>
            <mesh position={[-0.12, 0.08, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.12, 0.02, 0.01]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.12, 0.02, 0.01]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </>
        )}
      </group>

      {/* Mouth - Angry when hovered */}
      <mesh position={[0, 0.75, 0.3]} rotation={[0, 0, isHovered ? Math.PI : 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Tie */}
      <mesh position={[0, 0.3, 0.26]}>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, isHovered ? -0.5 : 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, isHovered ? 0.5 : -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.5, -0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.5, -0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.25, -0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0.25, -0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.25, -1.25, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, -1.25, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Book */}
      <group ref={bookRef} position={[0, 0.5, 0.4]}>
        {/* Book cover */}
        <mesh>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
        {/* Book pages */}
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[0.38, 0.48, 0.04]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        {/* Book title */}
        <mesh position={[0, 0.1, 0.03]}>
          <boxGeometry args={[0.3, 0.08, 0.01]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
}

export default StudyingKid;
