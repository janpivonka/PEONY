"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const texture = useTexture("/nebula.png", (tex) => {
    if (tex instanceof THREE.Texture) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.magFilter = THREE.LinearFilter;
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uOpacity: { value: 0.5 },
      uColorShift: { value: new THREE.Color(1, 1, 1) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColorShift;
      varying vec2 vUv;

      float hash(float n) { return fract(sin(n) * 43758.5453123); }

      vec2 rotate(vec2 uv, float angle, vec2 pivot) {
        float s = sin(angle);
        float c = cos(angle);
        uv -= pivot;
        return vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c) + pivot;
      }

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5);
        float dist = distance(uv, center);
        vec2 dir = normalize(uv - center);
        float angle = atan(dir.y, dir.x);

        vec3 finalRGB = vec3(0.0);
        float finalAlpha = 0.0;

        for(float i = 1.0; i <= 4.0; i++) {
          float h = hash(i);

          float lifeCycle = sin(uTime * (0.04 + h * 0.03) + h * 6.28);
          float lifeFactor = smoothstep(-1.0, 1.0, lifeCycle);

          float dynamicTime = uTime * (0.03 + h * 0.02);
          vec2 layerUv = uv * (1.1 + i * 0.25);
          layerUv += vec2(sin(dynamicTime + h * 6.2), cos(dynamicTime * 0.7 + h * 3.1)) * 0.5;
          layerUv = rotate(layerUv, dynamicTime * (i - 2.5) * 0.5, center);

          float radialFreq = (2.0 + i) * (0.8 + lifeFactor * 0.4);
          float distFreq = (3.5 + i) * (1.0 - lifeFactor * 0.2);
          float noisePattern = sin(angle * radialFreq + dynamicTime) * cos(dist * distFreq - dynamicTime);

          // --- ZMĚNA PRO MĚKKÉ HRANY ---
          // Rozšířili jsme rozsah z původních (0.35 - 0.6) na (0.15 - 0.8)
          // To vytvoří mnohem delší a jemnější přechod (fade)
          float edgeLow = 0.15 + (1.0 - lifeFactor) * 0.1;
          float edgeHigh = 0.8 + lifeFactor * 0.1;
          float mask = smoothstep(edgeLow, edgeHigh, noisePattern);

          vec4 tex = texture2D(uTexture, layerUv);

          float specular = pow(mask, 12.0) * lifeFactor * 0.2;
          float layerIntensity = (0.5 + lifeFactor * 0.3);

          vec3 layerCol = tex.rgb * (uColorShift + sin(uTime * 0.2 + i) * 0.1);
          layerCol += specular * 0.3 * uColorShift;

          finalRGB += layerCol * mask * (1.1 - i * 0.1) * layerIntensity;
          finalAlpha += mask * tex.a * layerIntensity;
        }

        finalRGB = pow(finalRGB, vec3(1.2)) * 1.4;

        // Zjemnění středového voidu (původně 0.04 - 0.4, nyní 0.0 - 0.6)
        float centerVoid = smoothstep(0.0, 0.6, dist);

        gl_FragColor = vec4(finalRGB * centerVoid, (finalAlpha / 4.0) * uOpacity);
      }
    `,
  }), [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = t;
      material.uniforms.uColorShift.value.setHSL((t * 0.02) % 1, 0.5, 0.5);

      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.02;
      meshRef.current.rotation.y = Math.cos(t * 0.04) * 0.03;
      meshRef.current.rotation.z = Math.sin(t * 0.03) * 0.02;
      meshRef.current.position.x = Math.sin(t * 0.05) * 0.05;
      meshRef.current.position.y = Math.cos(t * 0.06) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, -5]}>
      <planeGeometry args={[32, 20, 32, 32]} />
      <shaderMaterial
        args={[shaderArgs]}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}