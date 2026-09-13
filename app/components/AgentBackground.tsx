"use client";

import React from "react";

/**
 * Global ambient background (all pages): blurred docking-artwork glow
 * + soft grid + floating cyan/violet orbs. Keeps the app light while
 * carrying the home-page artwork feel everywhere.
 */
export function AgentBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f7fafc]"
    >
      {/* blurred docking artwork glow (same art as home) */}
      <div
        className="absolute -inset-10 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/hero-docking.webp')", filter: "blur(28px) saturate(1.2)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-[#f7fafc]/95" />

      {/* faint grid fading from top */}
      <div className="agent-grid-bg absolute inset-0" />

      {/* soft orbs */}
      <div className="animate-driftX absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-cyan-300/30 blur-[110px]" />
      <div
        className="animate-driftX absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-400/20 blur-[120px]"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="animate-floatY absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-300/20 blur-[110px]"
      />

      {/* orbiting ring accent */}
      <div className="absolute right-[8%] top-[12%] hidden lg:block">
        <div className="animate-spinSlow relative h-40 w-40 rounded-full border border-dashed border-cyan-500/30">
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
          <span className="absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full bg-blue-500/70" />
        </div>
      </div>

      {/* top hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 opacity-70" />
    </div>
  );
}

/** Small live-agent pill used in headers/cards */
export function LiveAgentPill({ label = "Agents Active" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700">
      <span className="ping-dot h-2 w-2 rounded-full bg-emerald-500 text-emerald-500" />
      {label}
      <span className="font-mono text-cyan-500">●●●</span>
    </span>
  );
}

/** Autonomous workflow strip: 4 mini agents with pulsing states */
export function AgentStrip({ active = 1 }: { active?: number }) {
  const agents = ["Scout", "Docker", "Ranker", "Reporter"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {agents.map((a, i) => {
        const isActive = i === active;
        const isDone = i < active;
        return (
          <span
            key={a}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono transition-all ${
              isActive
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 shadow-sm"
                : isDone
                  ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive
                  ? "bg-cyan-500 animate-pulse"
                  : isDone
                    ? "bg-emerald-500"
                    : "bg-zinc-300"
              }`}
            />
            {a}
          </span>
        );
      })}
    </div>
  );
}
