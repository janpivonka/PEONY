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
    <main className="relative w-full h-screen bg-[#010103] overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <Scene />
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-10">

        {/* Horní Brand */}
        <div className="pointer-events-auto">
          <h1 className="text-[#ff00ff] font-bold text-6xl italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]">
            P3B
          </h1>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#ff00ff] to-transparent mt-2" />
          <p className="text-cyan-400 text-[10px] mt-4 tracking-[0.4em] uppercase font-light">
            Body • Breath • Boost
          </p>
        </div>

        {/* HUD Sekce - Posunutá výše */}
        <div className="flex flex-col items-center w-full mb-20"> {/* mb-20 zvedá celý blok výše od terminálu */}
          <div className="pointer-events-auto">

            {/* KONTEJNER: Synchronizovaná animace */}
            <div className="flex items-center justify-center mb-8 animate-pulse">

              {/* TEXT */}
              <span
                className="text-2xl font-black italic uppercase tracking-[0.35em]"
                style={{
                  background: "linear-gradient(to right, #f472b6, #ec4899, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(236,72,153,0.4))"
                }}
              >
                Peony Production
              </span>

              {/* LOGO: Přidaný ml-8 pro vynucenou mezeru a zvednutí výš */}
              <img
                src="/logo.png"
                alt="Logo"
                className="ml-8 translate-y-[-2px]" // translate-y-[-2px] ho trochu přizvedne k horní hraně textu
                style={{
                  width: '18px',
                  height: '18px',
                  objectFit: 'contain',
                  marginLeft: "10px",
                  opacity: 0.9,
                  filter: "drop-shadow(0 0 8px rgba(236,72,153,0.6)) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(1.1)"
                }}
              />

            </div>

            {/* Spodní linka */}
            <div
              className="h-[1px] w-64 opacity-40 mx-auto"
              style={{
                background: "linear-gradient(to right, transparent, #ec4899, transparent)",
                marginBottom: "1.5em",
              }}
            />
          </div>

            <AgentTerminal />
        </div>

      </div>
    </main>
  );
}