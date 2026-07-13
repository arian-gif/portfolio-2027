import * as THREE from "three";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import { useMotionPrefs } from "../effects/useMotionPrefs";

// Served from /public — Vite + Netlify expose it at the site root.
const MODEL_URL = "/Saturn_1_120536.glb";

type SaturnProps = {
  /** Hero scroll progress 0..1, written by the parent via useMotionValueEvent.
   *  A mutable ref (not a MotionValue) because R3F's render loop reads it. */
  scrollRef?: MutableRefObject<number>;
};

/** The Saturn model, auto-centered, auto-scaled, and slowly spinning.
 *  As the hero scrolls away (p: 0→1) the planet spins faster, tips away,
 *  and recedes into the distance — the "leaving orbit" moment. */
function SaturnModel({ scrollRef, reduced }: SaturnProps & { reduced: boolean }) {
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

  const tilt = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (reduced) return; // static planet under prefers-reduced-motion
    const p = scrollRef?.current ?? 0;
    if (spinner.current) spinner.current.rotation.y += delta * (0.3 + p * 1.2);
    if (tilt.current) {
      tilt.current.rotation.x = 0.35 + p * 0.5;
      tilt.current.position.z = -p * 2.5;
    }
  });

  return (
    // Outer group gives Saturn its classic tilted-ring angle.
    <group ref={tilt} rotation={[0.35, 0, 0.12]}>
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

export default function Saturn3D({ scrollRef }: SaturnProps) {
  const { reducedMotion, tier } = useMotionPrefs();

  return (
    <Canvas
      // Lite tier (mobile/low-memory): lower pixel ratio, no antialiasing —
      // the planet is small on those screens anyway.
      dpr={tier === "lite" ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.4, 6], fov: 40 }}
      gl={{ antialias: tier !== "lite", alpha: true, powerPreference: "high-performance" }}
      // touchAction pan-y keeps one-finger scroll working over the canvas.
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" }}
    >
      {/* Lighting tuned to the cyan/violet cosmic palette */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2.4} />
      <directionalLight position={[-6, -2, -4]} intensity={0.7} color="#8b5cf6" />
      <pointLight position={[0, 0, 6]} intensity={1.2} color="#22d3ee" />

      <Suspense fallback={<Loader />}>
        <SaturnModel scrollRef={scrollRef} reduced={reducedMotion} />
      </Suspense>

      {/* Drag to orbit; zoom/pan disabled so it stays framed. Rotation is
          desktop-only — on touch devices a one-finger drag over the canvas
          would otherwise block page scrolling. */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={tier === "full"} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
