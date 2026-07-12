import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";

// Served from /public — Vite + Netlify expose it at the site root.
const MODEL_URL = "/Saturn_1_120536.glb";

/** The Saturn model, auto-centered, auto-scaled, and slowly spinning. */
function SaturnModel() {
  const { scene } = useGLTF(MODEL_URL);

  // Center the geometry at the origin and normalize its size so the framing
  // works no matter what units the GLB was exported in.
  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { object: clone, scale: 3.2 / maxDim };
  }, [scene]);

  const spinner = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spinner.current) spinner.current.rotation.y += delta * 0.3;
  });

  return (
    // Outer group gives Saturn its classic tilted-ring angle.
    <group rotation={[0.35, 0, 0.12]}>
      <group ref={spinner} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div
        style={{
          color: "#22d3ee",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          whiteSpace: "nowrap",
          opacity: 0.7,
        }}
      >
        LOADING SATURN…
      </div>
    </Html>
  );
}

export default function Saturn3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* Lighting tuned to the cyan/violet cosmic palette */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2.4} />
      <directionalLight position={[-6, -2, -4]} intensity={0.7} color="#8b5cf6" />
      <pointLight position={[0, 0, 6]} intensity={1.2} color="#22d3ee" />

      <Suspense fallback={<Loader />}>
        <SaturnModel />
      </Suspense>

      {/* Drag to orbit; zoom/pan disabled so it stays framed. */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
