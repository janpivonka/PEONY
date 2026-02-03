"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SparklingStars({ count = 8000 }) {
  const meshRef = useRef<THREE.Points>(null!);

  // Pomocný objekt barvy pro převod HSL -> RGB (šetří paměť)
  const colorHelper = useMemo(() => new THREE.Color(), []);

  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, starStates] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const states = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 2] = (Math.random() - 1.0) * 60;

      // Každá hvězda začne s náhodným barevným tónem
      const initialColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.7);

      states.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 2.5,
        exponent: 1 + Math.random() * 4,
        color: { r: initialColor.r, g: initialColor.g, b: initialColor.b },
        lastSin: 0
      });
    }
    return [pos, states];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const colors = meshRef.current.geometry.attributes.color;

    for (let i = 0; i < count; i++) {
      const sData = starStates[i];
      const currentSin = Math.sin(time * sData.speed + sData.phase) * 0.5 + 0.5;

      // RESET PARAMETRŮ PŘI ZHASNUTÍ (Včetně barvy z celého spektra)
      if (currentSin < 0.01 && sData.lastSin >= currentSin) {
        sData.speed = 0.5 + Math.random() * 3.0;
        sData.exponent = 1 + Math.random() * 5;

        // Vygenerování nové barvy přes HSL (spektrum)
        colorHelper.setHSL(Math.random(), 0.8, 0.7);
        sData.color.r = colorHelper.r;
        sData.color.g = colorHelper.g;
        sData.color.b = colorHelper.b;
      }
      sData.lastSin = currentSin;

      const brightness = Math.pow(currentSin, sData.exponent) * 0.9;

      colors.setXYZ(
        i,
        sData.color.r * brightness,
        sData.color.g * brightness,
        sData.color.b * brightness
      );
    }
    colors.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={new Float32Array(count * 3)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        map={starTexture}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}