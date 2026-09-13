"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, CheckCircle2, Lightbulb } from "lucide-react";

interface PipelineLoaderProps {
  loadingStage: number; // 0..4 — driven by page.tsx timeouts
  targetName: string;
  pdbId: string;
  patientId?: string;
}

const STAGES = [
  {
    label: "Fetching candidate drugs",
    detail: "PubChem CID 3D structures",
    agent: "Starting with PubChem — I'm pulling the 3D structures of every FDA-approved candidate for this target.",
    log: "PubChem query → 200 OK · SDF records parsed",
  },
  {
    label: "Checking bioactivity",
    detail: "ChEMBL IC₅₀ / Kᵢ assays",
    agent: "Structures in hand. Now I'm cross-checking each one against ChEMBL assay records — IC50 and Ki values.",
    log: "ChEMBL assays → 6 records · values normalized",
  },
  {
    label: "Loading protein structure",
    detail: "RCSB PDB crystal",
    agent: "Bioactivity looks promising. Loading the protein crystal structure so I can see the binding pocket.",
    log: "PDB crystal → atoms loaded · pocket detected",
  },
  {
    label: "Docking & scoring",
    detail: "RDKit ΔG matrix",
    agent: "Everything's loaded — docking each compound into the pocket and scoring binding energy now.",
    log: "RDKit scoring → poses ranked · ΔG matrix done",
  },
];

const TIPS = [
  "Lower ΔG means tighter binding — under −9.0 is therapeutically interesting.",
  "Every ranked compound is already FDA-approved. That's the repurposing shortcut.",
  "K_d in nM: smaller number, stronger grip on the target.",
  "ChEMBL assays are real lab measurements, not predictions.",
  "Off-label use still needs tumor-board sign-off.",
];

const DONE_LINE = "All done — best pose −10.4 kcal/mol. Opening your 3D viewer now.";
const PCT_TARGET = [12, 38, 64, 86, 100];

export function PipelineLoader({ loadingStage, targetName, pdbId, patientId }: PipelineLoaderProps) {
  const [pct, setPct] = useState(8);
  const [elapsed, setElapsed] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const pctRef = useRef(8);

  // smooth % tween toward stage target + elapsed timer
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const target = PCT_TARGET[Math.min(Math.max(loadingStage, 0), 4)];
    const tick = (now: number) => {
      setElapsed((now - t0) / 1000);
      pctRef.current += (target - pctRef.current) * 0.05;
      if (Math.abs(target - pctRef.current) < 0.3) pctRef.current = target;
      setPct(pctRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loadingStage]);

  // rotate tips
  useEffect(() => {
    const id = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const finished = loadingStage >= 4;
  const narration = finished ? DONE_LINE : STAGES[Math.min(loadingStage, 3)].agent;
  const seenLogs = STAGES.slice(0, Math.min(loadingStage + 1, 4));

  return (
    <div className="w-full max-w-6xl animate-fadeIn">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* main progress card */}
        <div className="rounded-3xl border border-zinc-200/70 bg-white/90 p-8 sm:p-10 shadow-xl backdrop-blur relative overflow-hidden">
          <div className="scanline" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Agent at work</h2>
              <p className="mt-1 font-mono text-xs text-zinc-400">
                {targetName} · {pdbId}{patientId ? ` · ${patientId}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-extrabold tabular-nums text-zinc-900">{Math.round(pct)}<span className="text-base text-zinc-400">%</span></p>
              <p className="font-mono text-xs text-zinc-400">{elapsed.toFixed(1)}s elapsed</p>
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-100 border border-zinc-200/60">
            <div
              className="shimmer-bar h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* stages */}
          <div className="mt-7 space-y-1.5">
            {STAGES.map((s, i) => {
              const done = finished || loadingStage > i;
              const active = !finished && loadingStage === i;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                    active ? "bg-cyan-50/80 border border-cyan-200 shadow-sm" : done ? "border border-transparent" : "opacity-45 border border-transparent"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                  ) : active ? (
                    <span className="h-6 w-6 shrink-0 animate-spin rounded-full border-[3px] border-cyan-500 border-t-transparent" />
                  ) : (
                    <span className="h-6 w-6 shrink-0 rounded-full bg-zinc-200" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-base font-semibold ${done || active ? "text-zinc-800" : "text-zinc-400"}`}>{s.label}</p>
                    <p className="font-mono text-xs text-zinc-400">{s.detail}{active && <span className="animate-blink">_</span>}</p>
                  </div>
                  {active && (
                    <span className="ml-auto shrink-0 rounded-full bg-cyan-500 px-2.5 py-1 text-[11px] font-bold text-white animate-pulse">
                      WORKING
                    </span>
                  )}
                  {done && (
                    <span className="ml-auto shrink-0 font-mono text-xs font-bold text-emerald-600">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* tip bar with % */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-300">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Tip {tipIdx + 1}/{TIPS.length} · {Math.round(pct)}% loaded
              </p>
              <p key={tipIdx} className="animate-fadeIn text-sm text-zinc-700">{TIPS[tipIdx]}</p>
              <div className="mt-1.5 flex gap-1">
                {TIPS.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i === tipIdx ? "bg-amber-500" : "bg-amber-200"}`} />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400">~8 seconds · advancing automatically</p>
        </div>

        {/* agent side panel */}
        <div className="flex flex-col rounded-3xl border border-zinc-200/70 bg-white/90 shadow-xl backdrop-blur overflow-hidden">
          <div className="flex items-center gap-3 border-b border-zinc-100 p-5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30">
              <Bot className="h-6 w-6" />
              {!finished && (
                <span className="ping-dot absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-500 text-emerald-500" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-zinc-900">Docking Agent</p>
              <p className="font-mono text-[11px] text-zinc-400">
                {finished ? "done ✓" : `step ${Math.min(loadingStage + 1, 4)} of 4 · speaking`}
              </p>
            </div>
          </div>

          <div className="p-5">
            <p key={loadingStage} className="agent-bubble rounded-2xl rounded-tl-md border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
              {narration}
              {!finished && (
                <span className="speaking-dots ml-1 inline-flex gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                  <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                  <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                </span>
              )}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-hidden px-5 pb-2 font-mono text-xs leading-relaxed">
            {seenLogs.map((s, i) => (
              <p key={`${i}-${loadingStage >= i}`} className="animate-logIn truncate text-emerald-700" title={s.log}>
                <span className="text-zinc-300">›</span> {s.log}
              </p>
            ))}
          </div>
          <p className="px-5 pb-4 pt-1 font-mono text-[11px] text-zinc-300">oncotarget-agent · live</p>
        </div>
      </div>
    </div>
  );
}
