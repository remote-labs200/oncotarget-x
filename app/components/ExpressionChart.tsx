"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { BarChart3, TrendingUp, Sparkles, Trophy, FlaskConical } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface ExpressionChartProps {
  target: TargetData;
}

function parseEnergy(s: string): number {
  const v = parseFloat(s);
  return Number.isNaN(v) ? 0 : v;
}

/** The specific cancer each target program is fighting. */
const CANCER_CONTEXT: Record<string, { cancer: string; goal: string }> = {
  EGFR: { cancer: "EGFR-driven NSCLC adenocarcinoma", goal: "shut down mutant EGFR signaling and stop lung tumor growth" },
  BRAF: { cancer: "BRAF-mutant melanoma", goal: "block MAPK-driven proliferation and overcome V600E resistance" },
  TP53: { cancer: "p53-mutant solid tumors", goal: "restore p53 tumor suppression and force cancer cell apoptosis" },
  KRAS: { cancer: "KRAS-mutant pancreatic & colorectal cancer", goal: "break KRAS membrane signaling and starve tumor effectors" },
  ALK: { cancer: "ALK-fusion NSCLC", goal: "silence ALK fusion kinase activity and halt tumor motility" },
};

export function ExpressionChart({ target }: ExpressionChartProps) {
  const ranked = [...target.drugs].sort(
    (a, b) => parseEnergy(a.bindingEnergy) - parseEnergy(b.bindingEnergy)
  );
  const chartData = ranked.map((drug) => ({
    name: drug.name.length > 10 ? drug.name.substring(0, 10) + "…" : drug.name,
    fullName: drug.name,
    energy: parseEnergy(drug.bindingEnergy),
    score: Math.max(10, Math.round(100 - drug.affinityScore * 4)),
  }));

  const energies = ranked.map((d) => parseEnergy(d.bindingEnergy));
  const best = ranked[0];
  const avg = energies.reduce((a, b) => a + b, 0) / Math.max(energies.length, 1);
  const hits = ranked.filter((d) => parseEnergy(d.bindingEnergy) <= -9.0);
  const minE = Math.min(...energies);
  const range = Math.max(...energies) - minE || 1;
  const ctx = CANCER_CONTEXT[target.name] ?? { cancer: `${target.name}-driven cancer`, goal: `inhibit ${target.name} signaling` };

  const colors = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-5">
      {/* chart card */}
      <div className="animate-slideUp rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] relative overflow-hidden">
        <div className="scanline" />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <BarChart3 className="h-4 w-4 text-cyan-600" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900">
                Efficacy vs {ctx.cancer}
              </h3>
              <p className="text-[11px] text-zinc-500">
                Mission: {ctx.goal} · {ranked.length} compounds · {hits.length} curative-grade (≤ −9.0) · avg {avg.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-500/25 px-2.5 py-1 text-[11px] text-emerald-700 font-mono font-semibold">
            <TrendingUp className="h-3.5 w-3.5 animate-pulse" />
            <span>live analytics</span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#e4e4e7", borderRadius: "12px", color: "#18181b", fontSize: "12px", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
                formatter={(value: any) => [`${value}/100`, "Efficacy"]}
                labelStyle={{ color: "#0891b2", fontWeight: "bold" }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* per-drug full report */}
      <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-5 sm:p-6 shadow-lg overflow-hidden">
        <div className="mb-3 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-cyan-600" />
          <h4 className="text-sm font-extrabold text-zinc-900">All compounds — full breakdown</h4>
        </div>
        <div className="space-y-3">
          {ranked.map((drug, idx) => {
            const e = parseEnergy(drug.bindingEnergy);
            const passes = e <= -9.0;
            const barPct = Math.min(100, Math.max(4, ((Math.max(...energies) - e) / range) * 100));
            return (
              <div
                key={drug.name}
                className={`animate-fadeIn rounded-2xl border p-4 transition-all ${
                  idx === 0
                    ? "border-amber-300 bg-amber-50/60 shadow-md"
                    : passes
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-zinc-200 bg-white"
                }`}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${idx === 0 ? "bg-amber-400 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                    {idx + 1}
                  </span>
                  <strong className="text-sm text-zinc-900">{drug.name}</strong>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Trophy className="h-3 w-3" /> TOP HIT
                    </span>
                  )}
                  {passes && idx !== 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">PASS ≤ −9.0</span>
                  )}
                  <span className="ml-auto font-mono text-xs font-bold text-zinc-800">{drug.bindingEnergy}</span>
                  <span className="font-mono text-[11px] text-zinc-500">K_d {drug.affinityScore} nM</span>
                </div>
                {/* energy bar */}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full ${idx === 0 ? "bg-gradient-to-r from-amber-400 to-orange-500" : passes ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-cyan-400 to-blue-500"}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <div className="mt-2 grid gap-1 text-[11px] text-zinc-500 sm:grid-cols-2">
                  <p className="sm:col-span-2 rounded-xl bg-cyan-50/70 border border-cyan-100 px-2.5 py-1.5 text-zinc-700">
                    <strong className="text-cyan-800">Effect on {ctx.cancer}:</strong> {drug.indication} —{" "}
                    {passes ? (
                      <strong className="text-emerald-700">HIGH projected impact — direct hit capable of driving tumor response.</strong>
                    ) : (
                      <span><strong className="text-amber-700">Supportive potential</strong> — best as adjunct/combination rather than single agent.</span>
                    )}
                  </p>
                  <p><strong className="text-zinc-700">How it works:</strong> {drug.mechanism}</p>
                  <p><strong className="text-zinc-700">Status:</strong> {drug.fdaStatus} · {drug.clinicalPhase}</p>
                  <p className="font-mono"><strong className="text-zinc-700">PubChem CID:</strong> {drug.pubChemId}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI insight */}
      <div className="animate-fadeIn rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50/80 to-blue-50/60 p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow">
            <Sparkles className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-extrabold text-zinc-900">AI insight — what this means</h4>
        </div>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-zinc-700">
          <li>
            <strong className="text-zinc-900">{best?.name}</strong> ({best?.bindingEnergy}) is the strongest
            path to a <strong>{ctx.cancer}</strong> response — {best?.mechanism} — prioritize it for validation
            against {target.name} ({target.fullName}).
          </li>
          <li>
            <strong className="text-emerald-700">{hits.length} of {ranked.length}</strong> compounds reach
            curative-grade binding (≤ −9.0 kcal/mol); the rest grade as
            supportive/combination options rather than single-agent cures.
          </li>
          <li>
            Treatment logic for this cancer: hit {target.name} ({target.pathway}) hard with{" "}
            <strong>{best?.name}</strong> first; pair a mid-ranked compound with a different mechanism
            (e.g. metabolic + kinase blockade) to delay resistance.
          </li>
          <li className="text-zinc-500">
            Context: {ctx.cancer} · {target.mutationFrequency} · mean panel affinity{" "}
            <strong className="font-mono">{avg.toFixed(1)} kcal/mol</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
}
