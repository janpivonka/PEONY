"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const FPS = 60;
const TOTAL_FRAMES = 600; // 10 sekund

export default function FrameExporter() {
  const { gl, scene, camera } = useThree();
  const setExportTime = useStore((s) => s.setExportTime);

  useEffect(() => {
    const exportFrames = async () => {
      const width = gl.domElement.width;
      const height = gl.domElement.height;
      const renderTarget = new THREE.WebGLRenderTarget(width, height, {
        samples: 4,
      });

      for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
        const t = frame / FPS;
        setExportTime(t);

        gl.setRenderTarget(renderTarget);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        // canvas pro PNG
        const buffer = new Uint8Array(width * height * 4);
        gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.createImageData(width, height);

        imageData.data.set(buffer);
        ctx.putImageData(imageData, 0, 0);

        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `frame_${String(frame).padStart(4, "0")}.png`;
        a.click();

        await new Promise((res) => setTimeout(res, 10));
      }

      console.log("All frames exported!");
    };

    exportFrames();
  }, [gl, scene, camera, setExportTime]);

  return null;
}
