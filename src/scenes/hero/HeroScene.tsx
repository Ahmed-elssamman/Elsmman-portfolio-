"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Float,
  PerspectiveCamera,
  Preload,
  Sparkles,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

import { useExperience } from "@/stores/experience.store";
import { HoloGrid } from "./HoloGrid";
import { HoloPanels } from "./HoloPanels";
import { ParticleField } from "./ParticleField";
import { CoreObject } from "./CoreObject";
import { CameraRig } from "./CameraRig";

export function HeroScene() {
  const phase = useExperience((s) => s.phase);
  const reducedMotion = useExperience((s) => s.reducedMotion);
  // Only mount once the loader has completed to keep the boot cheap.
  const active = phase === "ready" || phase === "explore";
  const caOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  return (
    <div className="absolute inset-0 vignette">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        frameloop={active ? "always" : "demand"}
        camera={{ position: [0, 0.4, 6.5], fov: 38, near: 0.1, far: 60 }}
      >
        <color attach="background" args={["#05060A"]} />
        <fog attach="fog" args={["#05060A", 8, 22]} />

        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0.4, 6.5]} fov={38} />

          <ambientLight intensity={0.25} />
          <directionalLight
            position={[3, 4, 2]}
            intensity={0.6}
            color="#9FD0FF"
          />
          <directionalLight
            position={[-4, -1, -3]}
            intensity={0.2}
            color="#3D7BD1"
          />

          <Environment preset="city" />

          <HoloGrid />

          <Float
            speed={reducedMotion ? 0 : 0.8}
            rotationIntensity={0.15}
            floatIntensity={0.6}
          >
            <CoreObject />
          </Float>

          <HoloPanels />

          <ParticleField count={reducedMotion ? 0 : 220} />

          <Sparkles
            count={reducedMotion ? 0 : 60}
            scale={[8, 4, 6]}
            size={1.2}
            speed={0.3}
            opacity={0.35}
            color="#9FD0FF"
          />

          <CameraRig />

          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={caOffset}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>

          <Preload all />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>
    </div>
  );
}
