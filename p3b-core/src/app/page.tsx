"use client";
import React from "react";
import Scene from "@/components/canvas/Scene";

function AgentTerminal() {
  return (
    <div className="pointer-events-auto w-full max-w-2xl bg-black/60 border border-white/10 p-4 rounded backdrop-blur-md shadow-[0_0_20px_rgba(255,0,255,0.1)]">
      <p className="text-[#ff00ff] font-mono text-[10px] uppercase tracking-tighter animate-pulse">
        {">"} SYSTEM_READY: CORE_STABILIZED // MODEL_LOAD_SUCCESS
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#010103] overflow-hidden flex flex-col">
      {/* Plátno na pozadí */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Scene />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex-1 flex flex-col p-10 pointer-events-none">

        {/* Horní Brand */}
        <div className="pointer-events-auto flex-none">
          <h1 className="text-[#ff00ff] font-bold text-6xl italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]">
            P3B
          </h1>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#ff00ff] to-transparent mt-2" />
          <p className="text-cyan-400 text-[10px] mt-4 tracking-[0.4em] uppercase font-light">
            Body • Breath • Boost
          </p>
        </div>

        {/* PRÁZDNÝ PROSTOR: Tento div vyplní maximum místa a odtlačí HUD dolů */}
        <div className="flex-1" />

        {/* HUD Sekce + Terminál - Nyní fixně u spodku */}
        <div className="flex flex-col items-center w-full">

          {/* Kontejner Peony Production */}
          <div className="pointer-events-auto flex flex-col items-center mb-4">
            <div className="flex items-center justify-center mb-4 animate-pulse">

              {/* TEXT: text-xl a leading-none */}
              <span
                className="text-xl font-black italic uppercase tracking-[0.35em] leading-none"
                style={{
                  background: "linear-gradient(to right, #f472b6, #ec4899, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(236,72,153,0.4))"
                }}
              >
                Peony Production
              </span>

              {/* LOGO */}
              <img
                src="/logo.png"
                alt="Logo"
                className="ml-4"
                style={{
                  width: '20px',
                  height: '22px',
                  objectFit: 'contain',
                  opacity: 0.9,
                  filter: "drop-shadow(0 0 8px rgba(236,72,153,0.6)) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(1.1)"
                }}
              />
            </div>

            {/* Spodní linka */}
            <div
              className="h-[1px] w-56 opacity-40"
              style={{
                background: "linear-gradient(to right, transparent, #ec4899, transparent)",
              }}
            />
          </div>

          {/* Terminál */}
          <div className="pointer-events-auto w-full flex justify-center ">
            <AgentTerminal />
          </div>

        </div>

      </div>
    </main>
  );
}