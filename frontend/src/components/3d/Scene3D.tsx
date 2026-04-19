import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Suspense } from 'react';

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  enableControls?: boolean;
}

export function Scene3D({ children, className = '', enableControls = true }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          <pointLight position={[0, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          {children}
          {enableControls && <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene3D;
