"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Loader } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import { LogoModel } from "./LogoModel";
import ShootingStar from "./ShootingStar";
import Nebula from "./Nebula";
import SparklingStars from "./SparklingStars";
import CenterLight from "./CenterLight"; // Importuj tvou novou komponentu

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Tohle světlo osvětluje logo zepředu, aby bylo vidět texturu */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={2} color="#ffffff" />
    </>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-screen bg-[#000000]">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          precision: "highp",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

        <Suspense fallback={null}>
          <Environment preset="night" environmentIntensity={0.6} />

          {/* Pozadí */}
          <SparklingStars count={3500} />
          <ShootingStar />
          <Nebula />

          {/* STŘEDOVÉ SVĚTLO - Umístěno mírně za logo */}
          {/* Pozice [0, 0, -1] nebo podobná zajistí, že záře bude "pod" logem */}
          <group position={[0, -0.5, -0.5]}>
            <CenterLight />
          </group>

          {/* LOGO */}
          <LogoModel />

          <StudioLighting />

          <EffectComposer disableNormalPass multisampling={8}>
            <Bloom
              mipmapBlur
              intensity={2.0}            // Trochu jsme přidali, aby Sprite zářil
              luminanceThreshold={0.15}   // Sníženo, aby Bloom zachytil i jemnější záři Spritů
              luminanceSmoothing={0.9}
              radius={0.4}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}