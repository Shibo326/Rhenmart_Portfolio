import { Suspense, useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Float, Icosahedron, Torus } from "@react-three/drei";
import * as THREE from "three";

// ── WebGL support detection ──────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// ── Error boundary to catch WebGL runtime errors ─────────────────────────
interface EBState { hasError: boolean }
class WebGLErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null; // silent fallback
    return this.props.children;
  }
}

// Extend R3F's catalog with Three.js primitives so JSX types resolve
extend(THREE);

const SpinningTorus = ({
  radius = 1.4,
  tube = 0.02,
  color = "#ff0000",
  speed = 0.3,
  rotation = [0, 0, 0] as [number, number, number],
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * speed * 0.6;
    ref.current.rotation.y += dt * speed;
  });
  return (
    <Torus ref={ref} args={[radius, tube, 16, 100]} rotation={rotation}>
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </Torus>
  );
};

const WireBlob = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.15;
    ref.current.rotation.y += dt * 0.2;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.6) * 0.1;
  });
  return (
    <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.4}>
      <Icosahedron ref={ref} args={[1, 1]}>
        <meshBasicMaterial color="#ff0000" transparent opacity={0.08} wireframe />
      </Icosahedron>
    </Float>
  );
};

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + Math.random() * 1.8;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.05;
    ref.current.rotation.x += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff4444" size={0.02} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
};

export function HeroScene3D() {
  if (!isWebGLAvailable()) return null;

  return (
    <WebGLErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff0000" />
          <WireBlob />
          <SpinningTorus radius={1.7} tube={0.008} color="#ff0000" speed={0.25} rotation={[Math.PI / 3, 0, 0]} />
          <SpinningTorus radius={2.0} tube={0.006} color="#ff4444" speed={-0.18} rotation={[0, Math.PI / 4, Math.PI / 6]} />
          <SpinningTorus radius={2.3} tube={0.005} color="#cc0000" speed={0.12} rotation={[Math.PI / 2, Math.PI / 3, 0]} />
          <ParticleField />
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  );
}
