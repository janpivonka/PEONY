"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

export function LogoModel() {
  const { nodes, materials } = useGLTF("/p3.glb");
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  const originalTexture = useMemo(() => {
    const matName = Object.keys(materials)[0];
    const tex = (materials[matName] as THREE.MeshStandardMaterial).map;
    if (tex) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [materials]);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.getElapsedTime();
      const rotationSpeed = 0.2;
      meshRef.current.rotation.y = time * rotationSpeed;

      // OBRÁCENÁ PERIODA (Maximum v profilu)
      const rotationFactor = Math.abs(Math.sin(meshRef.current.rotation.y));

      // ÚPRAVA ROZPĚTÍ (přesně podle tvého zadání)
      materialRef.current.emissiveIntensity = 0.8 + rotationFactor * 0.8;
      materialRef.current.envMapIntensity = 1.2 + rotationFactor * 1.0;
    }
  });

  return (
    <Center>
      <mesh
        ref={meshRef}
        // Používáme přesný název uzlu z tvého souboru
        geometry={(nodes["tripo_node_d16f0714-e30a-4826-9dd1-62cf7d2eda5a"] as THREE.Mesh).geometry}
        scale={3.8}
      >
        <meshPhysicalMaterial
          ref={materialRef}
          toneMapped={false}
          map={originalTexture}
          emissiveMap={originalTexture}
          emissive={new THREE.Color("#ffffff")}
          transmission={1.0}
          transparent={true}
          opacity={0.75}
          thickness={1.5}
          ior={1.7}
          roughness={0.0}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
}