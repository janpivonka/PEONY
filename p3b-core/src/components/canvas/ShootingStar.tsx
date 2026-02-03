"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ShootingStar() {
  const meshRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const headRef = useRef<THREE.MeshBasicMaterial>(null!);

  const state = useRef({
    active: false,
    progress: 0,
    speed: 0,
    curve: new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ),
    helperColor: new THREE.Color()
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(1, 1, 1) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uOpacity;
      uniform vec3 uColor;
      void main() {
        float fade = pow(vUv.x, 2.0);
        float shape = 1.0 - abs(vUv.y - 0.5) * 2.0;
        gl_FragColor = vec4(uColor, fade * shape * uOpacity);
      }
    `
  }), []);

  useFrame((threeState, delta) => {
    const s = state.current;

    // FREKVENCE (0.08 pro testování, pak změň na 0.002)
    const currentChance = 0.0005;

    if (!s.active && Math.random() < currentChance) {
      const radius = 22;
      const startAngle = Math.random() * Math.PI * 2;
      const start = new THREE.Vector3(
        Math.cos(startAngle) * radius,
        Math.sin(startAngle) * radius,
        -5
      );

      const endAngle = startAngle + Math.PI + (Math.random() - 0.5) * 2.0;
      const end = new THREE.Vector3(
        Math.cos(endAngle) * radius,
        Math.sin(endAngle) * radius,
        -5
      );

      const midDist = 2 + Math.random() * 8;
      const midAngle = startAngle + Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
      const control = new THREE.Vector3(
        Math.cos(midAngle) * midDist,
        Math.sin(midAngle) * midDist,
        -5
      );

      s.curve.v0.copy(start);
      s.curve.v1.copy(control);
      s.curve.v2.copy(end);

      s.progress = 0;
      s.speed = 0.05 + Math.random() * 0.08;

      // --- LOGIKA BAREV (50% bílá, 50% náhodná barva) ---
      if (Math.random() > 0.5) {
        s.helperColor.setRGB(1, 1, 1); // Čistě bílá
      } else {
        s.helperColor.setHSL(Math.random(), 0.6, 0.5); // Náhodný odstín
      }

      // Aktualizace barev pro ohon i jádro
      if (materialRef.current) {
        materialRef.current.uniforms.uOpacity.value = 0.0;
        materialRef.current.uniforms.uColor.value.copy(s.helperColor);
      }

      // Jádro (kulička) má nyní barvu ohonu
      if (headRef.current) {
        headRef.current.color.copy(s.helperColor);
      }

      if (tailRef.current) {
        const lengthFactor = 1.8 + Math.random() * 1.2;
        tailRef.current.scale.x = lengthFactor;
        tailRef.current.position.x = -lengthFactor / 2;
      }

      s.active = true;
      meshRef.current.visible = true;
    }

    if (s.active && meshRef.current) {
      s.progress += delta * s.speed;

      if (s.progress >= 1) {
        s.active = false;
        meshRef.current.visible = false;
      } else {
        const currentPos = s.curve.getPoint(s.progress);
        const tangent = s.curve.getTangent(s.progress);

        meshRef.current.position.copy(currentPos);
        meshRef.current.rotation.z = Math.atan2(tangent.y, tangent.x);

        if (materialRef.current) {
          let alpha = 0.4;
          if (s.progress < 0.2) alpha = (s.progress / 0.2) * 0.4;
          if (s.progress > 0.7) alpha = ((1.0 - s.progress) / 0.3) * 0.4;
          materialRef.current.uniforms.uOpacity.value = alpha;
        }
      }
    }
  });

  return (
    <group ref={meshRef} visible={false}>
      <mesh ref={tailRef}>
        <planeGeometry args={[1, 0.04]} />
        <shaderMaterial
          ref={materialRef}
          args={[shaderArgs]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.015, 6, 6]} />
        {/* Odstranili jsme color="white" a barvu ovládáme přes ref */}
        <meshBasicMaterial ref={headRef} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}