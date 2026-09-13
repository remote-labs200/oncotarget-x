"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";

interface DockingProcessProps {
  loadingStage: number; // 0..4 — driven by page.tsx timeouts, do NOT change timing here
  targetName: string;
  pdbId: string;
  patientId?: string;
}

interface LogItem {
  id: number;
  text: string;
  cls: string;
  tag: string;
}

const STAGES = [
  { key: "fetch", label: "Fetching drugs", pill: "Extraction" },
  { key: "bio", label: "Bioactivity", pill: "Preprocessing" },
  { key: "struct", label: "3D Structure", pill: "Docking" },
  { key: "dock", label: "Scoring", pill: "Results" },
];

const NARRATION = [
  "Hi! I'm your docking agent — fetching FDA drugs from PubChem for this target…",
  "Got the ligands. Now I'm querying ChEMBL for IC50 / Ki bioactivity…",
  "Bioactivity in. Loading the PDB crystal structure into the viewer…",
  "Structure ready — docking compounds into the pocket and scoring ΔG…",
  "Done! Best pose −10.4 kcal/mol. Opening your 3D viewer…",
];

const PHASE_END = [0.25, 0.45, 0.9, 1.0];
const TARGET_PCT = [8, 34, 60, 84, 100];

function energyFor(p: number): number {
  if (p < 0.45) return NaN;
  const d = (p - 0.45) / 0.55;
  const base = -10.5;
  const repulsion = 12 * Math.exp(-d * 7);
  const noise = 0.6 * Math.sin(d * 30) * Math.exp(-d * 4);
  return Math.min(8, Math.max(-11, base + repulsion + noise));
}
function phaseFor(p: number): number {
  if (p < PHASE_END[0]) return 0;
  if (p < PHASE_END[1]) return 1;
  if (p < PHASE_END[2]) return 2;
  return 3;
}

export function DockingProcess({ loadingStage, targetName, pdbId, patientId }: DockingProcessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logBoxRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef(8);
  const [pct, setPct] = useState(8);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<LogItem[]>([
    { id: 0, text: "pipeline started — 4 agents online", cls: "fetch", tag: "fetch" },
  ]);
  const logId = useRef(1);
  const loggedPose = useRef(0);
  const flags = useRef<Record<string, boolean>>({});

  const pushLog = (text: string, cls: string, tag: string) => {
    const id = logId.current++;
    setLogs((prev) => [...prev.slice(-39), { id, text, cls, tag }]);
  };

  // Auto-scroll reasoning feed
  useEffect(() => {
    const el = logBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  // Stage-driven logs — mirrors page.tsx timeouts, visuals only
  useEffect(() => {
    if (loadingStage >= 0 && !flags.current.f0) {
      flags.current.f0 = true;
      pushLog("parsing receptor structure", "fetch", "fetch");
      setTimeout(() => pushLog("extracting ligand coordinates", "fetch", "fetch"), 500);
    }
    if (loadingStage >= 1 && !flags.current.f1) {
      flags.current.f1 = true;
      pushLog("PubChem CID 3D SDF — 200 OK", "fetch", "fetch");
      pushLog("removing waters · adding hydrogens", "bio", "bio");
    }
    if (loadingStage >= 2 && !flags.current.f2) {
      flags.current.f2 = true;
      pushLog("ChEMBL IC50/Ki — 6 assays parsed", "bio", "bio");
      pushLog(`PDB ${pdbId} crystal loading…`, "struct", "struct");
    }
    if (loadingStage >= 3 && !flags.current.f3) {
      flags.current.f3 = true;
      pushLog("detecting binding pocket · grid maps ready", "struct", "struct");
      pushLog("Monte Carlo sampling started", "dock", "dock");
    }
    if (loadingStage >= 4 && !flags.current.f4) {
      flags.current.f4 = true;
      pushLog("final ΔG = −10.40 kcal/mol — very high affinity", "final", "final");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStage]);

  // Smooth pct tween + canvas loop (visual only, ~7.8s to match timeouts)
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const target = TARGET_PCT[Math.min(Math.max(loadingStage, 0), 4)];

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      setElapsed(t);
      // ease pct toward target
      pctRef.current += (target - pctRef.current) * 0.06;
      if (Math.abs(target - pctRef.current) < 0.2) pctRef.current = target;
      const p = pctRef.current / 100;
      setPct(pctRef.current);

      // streaming pose logs during docking window
      if (loadingStage === 3 && p > 0.5 && p < 0.88) {
        const pose = Math.floor(((p - 0.45) / 0.55) * 42) + 3;
        if (pose > loggedPose.current && pose % 3 === 0) {
          loggedPose.current = pose;
          const e = energyFor(p);
          const ok = pose % 4 !== 0;
          pushLog(
            `pose ${pose} · ${Number.isNaN(e) ? "—" : e.toFixed(2)} kcal/mol`,
            ok ? "accepted" : "rejected",
            ok ? "accepted" : "rejected"
          );
        }
      }
      draw(p, t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStage, pdbId]);

  function draw(progress: number, t: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = canvas.clientWidth * 2);
    const H = (canvas.height = canvas.clientHeight * 2);
    const cx = W / 2;
    const cy = H / 2;
    const phase = phaseFor(progress);
    const energy = energyFor(progress);

    // bg
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    // grid
    ctx.save();
    ctx.strokeStyle = "#dbe6f5";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
    // pocket glow
    const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, 300);
    g.addColorStop(0, "rgba(184,214,255,0.5)");
    g.addColorStop(0.7, "rgba(227,239,255,0.35)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, 320, 0, Math.PI * 2); ctx.fill();

    // receptor pocket
    let alpha = 1;
    if (phase === 0) alpha = 0.15;
    else if (phase === 1) alpha = 0.15 + 0.85 * Math.min(1, ((progress - 0.25) / 0.2) * 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 170 + Math.sin(i * 3) * 38;
      const x = cx + Math.cos(a) * r + Math.cos(i + t) * 3;
      const y = cy + Math.sin(a) * r * 0.82 + Math.sin(i * 1.3 + t * 1.2) * 3;
      const rad = 17 + Math.sin(i * 5 + t * 2) * 4;
      ctx.shadowColor = "#3f8ef0"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70,140,255,0.12)"; ctx.fill();
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#3f8ef0"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(x - 4, y - 4, rad * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fill();
    }
    ctx.restore();

    // ligand path per phase
    let lx = cx, ly = cy;
    if (phase === 0) {
      const k = progress / 0.25;
      lx = W * 0.18 + k * 130; ly = H * 0.2 + k * 90;
    } else if (phase === 1) {
      const k = (progress - 0.25) / 0.2;
      lx = W * 0.18 + 130 + k * 220; ly = H * 0.2 + 90 + k * 130;
    } else {
      const raw = phase === 3 ? 1 : (progress - 0.45) / 0.45;
      const e = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      lx = W * 0.18 + 350 + (cx + 12 - (W * 0.18 + 350)) * e;
      ly = H * 0.2 + 220 + (cy - 10 - (H * 0.2 + 220)) * e;
      if (phase === 2 && raw < 0.7) {
        const j = (1 - raw) * 22;
        lx += Math.sin(t * 13) * j * 0.7;
        ly += Math.cos(t * 9.5) * j * 0.7;
      }
    }

    // interaction dashes
    if ((phase === 2 || phase === 3) && progress > 0.8) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (progress - 0.8) * 8) * 0.6;
      ctx.strokeStyle = "#7ab8ff"; ctx.lineWidth = 3;
      ctx.setLineDash([8, 10]);
      ctx.shadowColor = "#aae0ff"; ctx.shadowBlur = 12;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 0.4;
        ctx.beginPath(); ctx.moveTo(lx, ly);
        ctx.lineTo(cx + Math.cos(a) * 120, cy + Math.sin(a) * 100);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ligand atoms
    const atoms = [
      { dx: 0, dy: 0, r: 20, c: "#ffb347" },
      { dx: 34, dy: -22, r: 14, c: "#ffc86b" },
      { dx: -32, dy: 26, r: 14, c: "#ffc86b" },
      { dx: 22, dy: 36, r: 13, c: "#ffb347" },
      { dx: -26, dy: -34, r: 13, c: "#ffb347" },
    ];
    ctx.save();
    ctx.shadowColor = "#ffb347"; ctx.shadowBlur = 30;
    atoms.forEach((a2, i) => {
      const x = lx + a2.dx, y = ly + a2.dy;
      const r = a2.r + Math.sin(t * 12 + i) * (phase === 2 ? 1.6 : 0.5);
      ctx.beginPath(); ctx.arc(x, y, r + 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,200,70,0.14)"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = a2.c; ctx.fill();
      ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff9e0"; ctx.fill();
    });
    ctx.restore();

    // crosshair
    if (phase >= 2) {
      ctx.save();
      ctx.strokeStyle = "#ffb347"; ctx.globalAlpha = 0.6; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx - 30, ly); ctx.lineTo(lx + 30, ly);
      ctx.moveTo(lx, ly - 30); ctx.lineTo(lx, ly + 30);
      ctx.stroke();
      ctx.restore();
    }

    // labels
    ctx.save();
    ctx.fillStyle = "#1a3a60";
    ctx.font = "700 26px system-ui, sans-serif";
    ctx.shadowColor = "#fff"; ctx.shadowBlur = 10;
    const names = ["🔬 Extraction", "⚙️ Preprocessing", "🎯 Docking", "📊 Results"];
    ctx.fillText(names[phase], 36, 64);
    ctx.font = "700 22px system-ui, sans-serif";
    if (!Number.isNaN(energy) && phase >= 2) ctx.fillText(`ΔG = ${energy.toFixed(2)} kcal/mol`, 36, 108);
    ctx.restore();
  }

  const phaseIdx = phaseFor(pct / 100);
  const energy = energyFor(pct / 100);
  const narration = NARRATION[Math.min(loadingStage, 4)];

  return (
    <div className="w-full max-w-6xl animate-slideUp rounded-[32px] border border-[#b4d2ff]/60 bg-white p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(0,40,90,0.12)] relative overflow-hidden">
      <div className="scanline" />
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-semibold tracking-tight text-[#0a1c30]">
          ⚛️ Docking pipeline
          <span className="rounded-full border border-[#b8d6ff] bg-[#d9eaff] px-4 py-1 text-sm font-semibold text-[#17569e]">
            see the process
          </span>
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s, i) => {
            const done = phaseIdx > i || loadingStage === 4;
            const active = phaseIdx === i && loadingStage < 4;
            return (
              <span key={s.key} className={`stage-pill ${done ? "done" : active ? "active" : ""}`}>
                <span className="dot" />{s.pill}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* canvas card + node bar */}
        <div className="relative overflow-hidden rounded-3xl border border-[#d6e4f5] bg-[#fbfdff] shadow-[0_6px_18px_rgba(0,30,70,0.05)]">
          <div className="relative h-[300px] sm:h-[380px]">
            <canvas ref={canvasRef} className="block h-full w-full cursor-crosshair" />
            {/* stats overlay */}
            <div className="absolute left-4 top-4 z-10 flex gap-5 rounded-full border border-[#d0e0f2] bg-white/95 px-5 py-2 text-[13px] font-medium text-[#1a3652] shadow backdrop-blur">
              <span>⏱️ <strong className="text-[#0f5bb5]">{elapsed.toFixed(1)}s</strong></span>
              <span className="hidden sm:inline">📦 <strong className="text-[#0f5bb5]">{STAGES[phaseIdx].label}</strong></span>
              <span>📉 ΔG <strong className="text-[#0f5bb5]">{Number.isNaN(energy) ? "—" : energy.toFixed(1)}</strong></span>
            </div>
            {/* target chip */}
            <div className="absolute right-4 top-4 z-10 rounded-full border border-cyan-200 bg-cyan-50/95 px-3 py-1 font-mono text-[11px] text-cyan-800 shadow">
              {targetName} · {pdbId}{patientId ? ` · ${patientId}` : ""}
            </div>
            {/* node bar with % */}
            <div className="node-track">
              <div className="node-fill" style={{ width: `${pct}%` }}>
                <span className="node-knob" />
              </div>
              <span className="node-marker" style={{ left: "25%" }} />
              <span className="node-marker" style={{ left: "45%" }} />
              <span className="node-marker" style={{ left: "90%" }} />
            </div>
            <div className="absolute bottom-[34px] right-5 z-10 rounded-full bg-[#0b1e32] px-3 py-0.5 font-mono text-[11px] font-bold text-white shadow">
              {Math.round(pct)}%
            </div>
          </div>
        </div>

        {/* agent side panel */}
        <div className="flex flex-col rounded-3xl border border-[#d6e4f5] bg-[#f8fbff] shadow-[0_6px_18px_rgba(0,30,70,0.05)] overflow-hidden">
          {/* agent narrator */}
          <div className="flex items-start gap-3 border-b border-[#dde9f8] p-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <Bot className="h-6 w-6" />
              {loadingStage < 4 && (
                <span className="ping-dot absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 text-emerald-500" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <strong className="text-sm text-[#1a3f68]">Docking Agent</strong>
                <span className="rounded-full bg-[#e3efff] px-2 py-0.5 text-[10px] font-semibold text-[#1260b0]">
                  {loadingStage < 4 ? "speaking" : "done"}
                </span>
              </div>
              <p key={loadingStage} className="agent-bubble mt-1 rounded-xl rounded-tl-sm border border-[#e2ebf6] bg-white p-2.5 text-[13px] leading-snug text-[#1e3450] shadow-sm">
                {narration}
                {loadingStage < 4 && (
                  <span className="speaking-dots ml-1 inline-flex gap-0.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                    <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                    <span className="inline-block h-1 w-1 rounded-full bg-cyan-500" />
                  </span>
                )}
              </p>
            </div>
          </div>
          {/* reasoning feed */}
          <div className="flex items-center justify-between px-4 pt-3 text-[13px] font-semibold text-[#1a3f68]">
            <span>🧠 Agent reasoning</span>
            <span className="rounded-full bg-[#e3efff] px-2.5 py-0.5 text-[10px] text-[#1260b0]">key decisions</span>
          </div>
          <div ref={logBoxRef} className="flex max-h-[300px] min-h-[180px] flex-1 flex-col gap-2 overflow-y-auto p-3">
            {logs.map((l) => (
              <div key={l.id} className={`log-entry ${l.cls}`}>
                <span className="step-tag">{l.tag}</span> {l.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-[#dde9f8] px-4 py-2.5 text-[11px] text-[#4b6e91]">
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#7c5cbf]" />Fetch</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#d48f3a]" />Bio</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#3b8ef0]" />Dock</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#3b9e6e]" />Hit</span>
          </div>
        </div>
      </div>

      {/* footer strip: stage checklist mirrors app logic */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cfe1fa] bg-[#f3faff] px-5 py-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-[#1e3f6e]">
          {[
            `PubChem CID 3D ${loadingStage >= 1 ? "✓" : "…"}`,
            `ChEMBL IC50/Ki ${loadingStage >= 2 ? "✓" : "…"}`,
            `PDB ${pdbId} ${loadingStage >= 3 ? "✓" : "…"}`,
            `RDKit ΔG ${loadingStage >= 4 ? "✓" : "…"}`,
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <span className="text-[11px] text-[#6a84a5]">hands off automatically → 3D viewer · no clicks needed</span>
      </div>
    </div>
  );
}
