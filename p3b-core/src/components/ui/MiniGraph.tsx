"use client";
import { useEffect, useRef } from "react";

export default function MiniGraph({ color = "#FF6AC1" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      for (let x = 0; x < canvas.width; x++) {
        const y = (canvas.height / 2) + Math.sin(x * 0.1 + offset) * 10 + Math.random() * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      offset += 0.1;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [color]);

  return <canvas ref={canvasRef} width={100} height={40} className="opacity-80" />;
}