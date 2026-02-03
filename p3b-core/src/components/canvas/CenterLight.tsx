"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PremiumCenterLight() {
  const groupRef = useRef<THREE.Group>(null!);
  const materialsRef = useRef<THREE.SpriteMaterial[]>([]);

  const flareTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

    // Prémiový plynulý útlum
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.05, "rgba(240,240,255,0.8)"); // Nádech do modrobíla
    gradient.addColorStop(0.15, "rgba(180,150,255,0.3)"); // Fialkový haló efekt
    gradient.addColorStop(0.5, "rgba(0,0,0,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const rayCount = 16; // Méně je někdy více pro luxusní vzhled
  const rayData = useMemo(() => {
    return Array.from({ length: rayCount }).map((_, i) => {
      // Střídáme dlouhé jehlice a krátké záře
      const isLong = i % 4 === 0;
      return {
        initialAngle: (i * Math.PI * 2) / rayCount,
        scale: [
          isLong ? 25 + Math.random() * 5 : 8 + Math.random() * 4, // Délka
          isLong ? 0.04 : 0.08, // Šířka (velmi tenké jsou elegantnější)
          1
        ] as [number, number, number],
        opacity: isLong ? 0.4 : 0.2,
        speed: isLong ? 0.05 : 0.08, // Různé rychlosti pro pocit hloubky
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    materialsRef.current.forEach((mat, i) => {
      if (mat) {
        const data = rayData[i];
        // Každý paprsek má lehce jinou oscilaci rychlosti
        mat.rotation = data.initialAngle + t * data.speed;
        // Jemné dýchání opacity
        mat.opacity = data.opacity + Math.sin(t * 2 + i) * 0.05;
      }
    });

    if (groupRef.current) {
      // Velmi decentní náklon podle pohybu myši (optional efekt)
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      groupRef.current.rotation.y = Math.cos(t * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -4.5]}>
      {/* 1. JEMNÁ KULATÁ ZÁŘE NA POZADÍ (Glow) */}
      <sprite scale={[12, 12, 1]}>
        <spriteMaterial
          map={flareTexture}
          transparent
          blending={THREE.AdditiveBlending}
          opacity={0.1} // Velmi decentní podkres
          color="#8855ff"
        />
      </sprite>

      {/* 2. DYNAMICKÉ PAPRSKY */}
      {rayData.map((ray, i) => (
        <sprite key={i} scale={ray.scale}>
          <spriteMaterial
            ref={(el) => (materialsRef.current[i] = el!)}
            map={flareTexture}
            transparent
            blending={THREE.AdditiveBlending}
            opacity={ray.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}

      {/* 3. OSTRÉ JÁDRO (To, co vidíme uvnitř loga) */}
      <sprite scale={[1.2, 1.2, 1]}>
        <spriteMaterial
          map={flareTexture}
          transparent
          blending={THREE.AdditiveBlending}
          opacity={1}
          color="#ffffff"
        />
      </sprite>
    </group>
  );
}