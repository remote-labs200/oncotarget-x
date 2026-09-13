"use client";

import React, { useEffect, useState } from "react";
import { FlaskConical, ExternalLink, ArrowLeft, Microscope, Database } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface BioactivityLabProps {
  target: TargetData;
  onBack: () => void;
}

interface DrugDossier {
  name: string;
  bindingEnergy: string;
  energyNum: number;
  affinityScore: number;
  indication: string;
  mechanism: string;
  fdaStatus: string;
  clinicalPhase: string;
  pubChemId: string;
  chemblId: string;
  maxPhase: number;
  moleculeType: string;
  mw: string;
  formula: string;
  xlogp: string;
  iupac: string;
  activities: any[];
}

function parseEnergy(s: string): number {
  const v = parseFloat(s);
  return Number.isNaN(v) ? 0 : v;
}
function bestOf(acts: any[], type: string): string {
  const vals = acts
    .filter((a) => (a.standardType || "").toLowerCase() === type.toLowerCase())
    .map((a) => parseFloat(a.standardValue))
    .filter((v) => !Number.isNaN(v));
  return vals.length ? `${Math.min(...vals)} nM` : "—";
}

export function BioactivityLab({ target, onBack }: BioactivityLabProps) {
  const [dossiers, setDossiers] = useState<DrugDossier[] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string>("");

  useEffect(() => {
    let alive = true;
    async function load() {
      const results = await Promise.all(
        target.drugs.map(async (d) => {
          let chem: any = {};
          let pub: any = {};
          try {
            const r = await fetch(`/api/chembl?name=${encodeURIComponent(d.name)}`);
            chem = await r.json();
          } catch {}
          try {
            const r = await fetch(`/api/pubchem?name=${encodeURIComponent(d.name)}`);
            pub = await r.json();
          } catch {}
          return {
            name: d.name,
            bindingEnergy: d.bindingEnergy,
            energyNum: parseEnergy(d.bindingEnergy),
            affinityScore: d.affinityScore,
            indication: d.indication,
            mechanism: d.mechanism,
            fdaStatus: d.fdaStatus,
            clinicalPhase: d.clinicalPhase,
            pubChemId: String(pub.pubChemId ?? d.pubChemId),
            chemblId: chem.chemblId ?? "—",
            maxPhase: chem.maxPhase ?? 4,
            moleculeType: chem.moleculeType ?? "Small molecule",
            mw: pub.molecularWeight ?? "—",
            formula: pub.formula ?? "—",
            xlogp: pub.xlogp ?? "—",
            iupac: pub.iupacName ?? "—",
            activities: chem.activities ?? [],
          } as DrugDossier;
        })
      );
      if (!alive) return;
      results.sort((a, b) => a.energyNum - b.energyNum);
      setDossiers(results);
      setFetchedAt(new Date().toLocaleString());
    }
    load();
    return () => {
      alive = false;
    };
  }, [target]);

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to 3D Viewer</span>
        </button>
        <span className="font-mono text-[11px] text-zinc-400">
          {target.name} · PDB {target.pdbId} · {target.drugs.length} compounds
          {fetchedAt && ` · pulled ${fetchedAt}`}
        </span>
      </div>

      <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="scanline" />
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">
              Bioactivity Lab <span className="font-mono text-emerald-700 text-sm">IC₅₀ / Kᵢ · all compounds</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Live EMBL-EBI ChEMBL assays + PubChem properties for every ranked candidate.
            </p>
          </div>
        </div>

        {/* comparison matrix */}
        <h3 className="mt-6 mb-2 flex items-center gap-2 text-sm font-extrabold text-zinc-900">
          <Database className="h-4 w-4 text-cyan-600" /> Head-to-head comparison
        </h3>
        {!dossiers ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            pulling ChEMBL + PubChem for all {target.drugs.length} drugs<span className="animate-blink">_</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="bg-zinc-50 text-left text-[10px] uppercase tracking-wider text-zinc-400">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Drug</th>
                  <th className="px-3 py-2">ΔG</th>
                  <th className="px-3 py-2">K_d</th>
                  <th className="px-3 py-2">Assays</th>
                  <th className="px-3 py-2">Best IC₅₀</th>
                  <th className="px-3 py-2">Best Kᵢ</th>
                  <th className="px-3 py-2">MW</th>
                  <th className="px-3 py-2">ChEMBL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white font-mono">
                {dossiers.map((d, i) => (
                  <tr key={d.name} className={`animate-fadeIn ${i === 0 ? "bg-amber-50/60" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="px-3 py-2 font-bold text-zinc-500">{i + 1}</td>
                    <td className="px-3 py-2 font-sans font-bold text-zinc-900">{d.name}</td>
                    <td className={`px-3 py-2 font-bold ${d.energyNum <= -9 ? "text-emerald-700" : "text-zinc-700"}`}>{d.bindingEnergy}</td>
                    <td className="px-3 py-2 text-zinc-600">{d.affinityScore} nM</td>
                    <td className="px-3 py-2 text-zinc-600">{d.activities.length}</td>
                    <td className="px-3 py-2 text-cyan-700 font-bold">{bestOf(d.activities, "ic50")}</td>
                    <td className="px-3 py-2 text-cyan-700 font-bold">{bestOf(d.activities, "ki")}</td>
                    <td className="px-3 py-2 text-zinc-600">{d.mw}</td>
                    <td className="px-3 py-2 text-zinc-500">{d.chemblId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* per-drug dossiers */}
        {dossiers?.map((d, i) => (
          <div key={d.name} className="animate-fadeIn mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i === 0 ? "bg-amber-400 text-white" : "bg-zinc-100 text-zinc-600"}`}>{i + 1}</span>
              <h4 className="text-base font-extrabold text-zinc-900">{d.name}</h4>
              <span className="font-mono text-xs font-bold text-emerald-700">{d.bindingEnergy}</span>
              <span className="font-mono text-[11px] text-zinc-500">K_d {d.affinityScore} nM</span>
              <a
                href={`https://www.ebi.ac.uk/chembl/g/#browse/activities/${d.chemblId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 font-mono text-[11px] font-semibold text-cyan-700 hover:underline"
              >
                {d.chemblId} <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* molecule facts */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
              {[
                ["Formula", d.formula],
                ["MW (g/mol)", `${d.mw}`],
                ["XLogP", `${d.xlogp}`],
                ["Max phase", `Phase ${d.maxPhase}`],
                ["Type", d.moleculeType],
                ["PubChem CID", d.pubChemId],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-zinc-50 border border-zinc-100 px-2.5 py-1.5">
                  <p className="font-bold uppercase tracking-wider text-zinc-400 text-[9px]">{k}</p>
                  <p className="truncate font-mono font-semibold text-zinc-800" title={String(v)}>{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 truncate font-mono text-[10px] text-zinc-400" title={d.iupac}>IUPAC: {d.iupac}</p>

            {/* clinical */}
            <div className="mt-2 grid gap-1 text-[11px] text-zinc-500 sm:grid-cols-2">
              <p><strong className="text-zinc-700">Repurposed use:</strong> {d.indication}</p>
              <p><strong className="text-zinc-700">Mechanism:</strong> {d.mechanism}</p>
              <p><strong className="text-zinc-700">Regulatory:</strong> {d.fdaStatus} · {d.clinicalPhase}</p>
              <p className="flex items-center gap-1.5">
                <Microscope className="h-3 w-3 text-zinc-400" />
                <strong className="text-zinc-700">Analyst note:</strong>
                <span>
                  {d.activities.length === 0
                    ? "no live assays returned — docking score only."
                    : `strongest assay ${bestOf(d.activities, "ic50") !== "—" ? bestOf(d.activities, "ic50") + " IC50" : bestOf(d.activities, "ki") + " Ki"} across ${d.activities.length} records; ${d.energyNum <= -9 ? "clears" : "below"} the −9.0 therapeutic bar.`}
                </span>
              </p>
            </div>

            {/* assays */}
            <div className="mt-3 grid grid-cols-4 gap-2 px-1 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Assay</span><span>Target protein</span><span>Parameter</span><span>Value</span>
            </div>
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 overflow-hidden">
              {d.activities.length === 0 && (
                <p className="px-3 py-3 text-[11px] text-zinc-400">No assay rows returned.</p>
              )}
              {d.activities.map((a: any, j: number) => (
                <div key={j} className="grid grid-cols-4 gap-2 px-3 py-2 text-[11px] font-mono">
                  <span className="text-zinc-500">{a.assayType === "B" ? "Binding" : "Functional"}</span>
                  <span className="truncate text-zinc-600" title={a.targetName}>{a.targetName}</span>
                  <span className="font-bold text-cyan-700">{a.standardType}</span>
                  <span className="font-bold text-emerald-700">{a.standardValue} {a.standardUnits}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="mt-4 text-center font-mono text-[10px] text-zinc-400">
          Sources: EMBL-EBI ChEMBL Web Services · PubChem PUG REST · RDKit pre-computed ΔG matrix
        </p>
      </div>
    </div>
  );
}
