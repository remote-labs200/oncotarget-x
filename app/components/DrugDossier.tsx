"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";
import {
  drugbankUrl,
  pubchemUrl,
  chemblActivitiesUrl,
  rcsbUrl,
  DRUGBANK_IDS,
} from "@/app/data/drugLinks";
import { LigandSnap } from "./LigandSnap";

interface DrugDossierProps {
  target: TargetData;
  drugIndex: number;
  rank: number;
  onBack: () => void;
  onPrevDrug: () => void;
  onNextDrug: () => void;
}

/** UniProt/PubChem-style key-value row */
function Row({ k, v, mono = true }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[150px_1fr] border-b border-zinc-100 last:border-0">
      <div className="bg-zinc-50/70 px-3 py-2 text-[13px] font-bold text-zinc-700">{k}</div>
      <div className={`px-3 py-2 text-[13px] text-zinc-800 break-words ${mono ? "font-mono" : ""}`}>{v}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-zinc-600">
        {title}
      </div>
      {children}
    </div>
  );
}

export function DrugDossier({
  target,
  drugIndex,
  rank,
  onBack,
  onPrevDrug,
  onNextDrug,
}: DrugDossierProps) {
  const drug = target.drugs[drugIndex] ?? target.drugs[0];
  const [pub, setPub] = useState<any>(null);
  const [chem, setChem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setPub(null);
      setChem(null);
      try {
        const [pr, cr] = await Promise.all([
          fetch(`/api/pubchem?name=${encodeURIComponent(drug.name)}`),
          fetch(`/api/chembl?name=${encodeURIComponent(drug.name)}`),
        ]);
        const [pd, cd] = await Promise.all([pr.json(), cr.json()]);
        if (!alive) return;
        if (pd.success) setPub(pd);
        if (cd.success) setChem(cd);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [drug.name]);

  const mw = parseFloat(pub?.molecularWeight ?? "0");
  const logp = parseFloat(pub?.xlogp ?? "0");
  const hbd = Number(pub?.hbd ?? 0);
  const hba = Number(pub?.hba ?? 0);
  const rules = [
    { label: "Molecular weight < 500 Da", pass: mw > 0 && mw < 500, value: pub?.molecularWeight ?? "…" },
    { label: "LogP < 5", pass: logp < 5, value: String(pub?.xlogp ?? "…") },
    { label: "H-bond donors ≤ 5", pass: hbd <= 5, value: String(pub?.hbd ?? "…") },
    { label: "H-bond acceptors ≤ 10", pass: hba <= 10, value: String(pub?.hba ?? "…") },
  ];
  const violations = rules.filter((r) => !r.pass).length;
  const passes = parseFloat(drug.bindingEnergy) <= -9.0;

  const dbUrl = drugbankUrl(drug.name);
  const links = [
    dbUrl && { label: `DrugBank · ${DRUGBANK_IDS[drug.name]}`, href: dbUrl },
    { label: `PubChem · CID ${pub?.pubChemId ?? drug.pubChemId}`, href: pubchemUrl(pub?.pubChemId ?? drug.pubChemId) },
    chem?.chemblId && { label: `ChEMBL · ${chem.chemblId}`, href: chemblActivitiesUrl(chem.chemblId) },
    { label: `RCSB PDB · ${target.pdbId}`, href: rcsbUrl(target.pdbId) },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto text-[13px]">
      {/* slim nav */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" /> Viewer
        </button>
        <div className="flex items-center gap-1">
          <button onClick={onPrevDrug} className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition cursor-pointer"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <span className="font-mono text-[11px] text-zinc-400">#{rank}/{target.drugs.length}</span>
          <button onClick={onNextDrug} className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition cursor-pointer"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* compact title */}
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">{drug.name}</h2>
        <span className="font-mono text-xs text-zinc-400">COMPOUND · RANK #{rank} · {target.name}</span>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${passes ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
          {drug.bindingEnergy}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {/* LEFT — registry tables */}
        <div className="space-y-3 lg:col-span-2">
          <Section title="Identifiers">
            <Row k="PubChem CID" v={pub?.pubChemId ?? drug.pubChemId} />
            <Row k="DrugBank" v={dbUrl ? `${DRUGBANK_IDS[drug.name]} (verified)` : "—"} />
            <Row k="ChEMBL" v={loading ? "…" : chem?.chemblId ?? "—"} />
            <Row k="Target PDB" v={`${target.pdbId} (${target.name})`} />
            <Row k="Mol. formula" v={loading ? "…" : pub?.formula ?? "—"} />
            <Row k="IUPAC" v={loading ? "…" : pub?.iupacName ?? "—"} />
          </Section>

          <Section title={`Structure — 3D stick (${drug.name})`}>
            <div className="h-72 w-full cursor-grab active:cursor-grabbing bg-white">
              {!loading && pub?.sdfUrl ? (
                <LigandSnap sdfUrl={pub.sdfUrl} cid={pub.pubChemId ?? drug.pubChemId} name={drug.name} />
              ) : (
                <div className="flex h-full items-center justify-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" /> loading 3D…
                </div>
              )}
            </div>
            <p className="border-t border-zinc-100 px-2.5 py-1 font-mono text-[10px] text-zinc-400">drag to rotate · scroll to zoom · Jmol colors</p>
          </Section>

          <Section title="ADME properties (PubChem)">
            <Row k="Mol. weight" v={loading ? "…" : `${pub?.molecularWeight} g/mol`} />
            <Row k="XLogP3" v={loading ? "…" : String(pub?.xlogp)} />
            <Row k="H-bond donors" v={loading ? "…" : String(pub?.hbd)} />
            <Row k="H-bond acceptors" v={loading ? "…" : String(pub?.hba)} />
            <Row k="Rotatable bonds" v={loading ? "…" : String(pub?.rotBonds)} />
            <Row k="TPSA" v={loading ? "…" : `${pub?.tpsa} Å²`} />
          </Section>

          <Section title={`Lipinski rule of five — ${violations === 0 ? "PASS" : `${violations} violation${violations > 1 ? "s" : ""}`}`}>
            {rules.map((r) => (
              <div key={r.label} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 border-b border-zinc-100 px-3 py-2 last:border-0">
                {r.pass
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <XCircle className="h-4 w-4 text-red-400" />}
                <span className="text-[13px] text-zinc-700">{r.label}</span>
                <span className="font-mono text-[13px] font-bold text-zinc-800">{r.value}</span>
              </div>
            ))}
          </Section>

          <Section title="Repurposing record">
            <Row k="Use" v={drug.indication} mono={false} />
            <Row k="Mechanism" v={drug.mechanism} mono={false} />
            <Row k="Regulatory" v={`${drug.fdaStatus} · ${drug.clinicalPhase}`} mono={false} />
          </Section>

          <Section title={`ChEMBL assays ${chem?.chemblId ? `· ${chem.chemblId}` : ""}`}>
            {loading ? (
              <p className="px-3 py-3 font-mono text-xs text-zinc-400">querying…</p>
            ) : (
              (chem?.activities ?? []).map((a: any, j: number) => (
                <div key={j} className="grid grid-cols-4 gap-2 border-b border-zinc-100 px-3 py-2 font-mono text-[13px] last:border-0">
                  <span className="text-zinc-500">{a.assayType === "B" ? "Binding" : "Functional"}</span>
                  <span className="truncate text-zinc-600" title={a.targetName}>{a.targetName}</span>
                  <span className="font-bold text-cyan-700">{a.standardType}</span>
                  <span className="font-bold text-emerald-700">{a.standardValue} {a.standardUnits}</span>
                </div>
              ))
            )}
          </Section>
        </div>

        {/* RIGHT — descriptors + links */}
        <div className="space-y-3">
          <Section title="Docking scorecard">
            <Row k="Rank" v={`#${rank} of ${target.drugs.length}`} />
            <Row k="ΔG" v={drug.bindingEnergy} />
            <Row k="K_d" v={`${drug.affinityScore} nM`} />
            <Row k="Threshold" v={passes ? "PASS ≤ −9.0" : "below −9.0"} />
            <Row k="Pocket" v={`${target.pdbId} · ${target.pathway.split("/")[0].trim()}`} />
          </Section>

          <Section title="Descriptors">
            <Row k="Type" v={loading ? "…" : chem?.moleculeType ?? "—"} />
            <Row k="Max phase" v={loading ? "…" : `Phase ${chem?.maxPhase ?? "—"}`} />
            <Row k="Assays" v={loading ? "…" : String(chem?.activities?.length ?? 0)} />
            <Row k="Weight" v={loading ? "…" : `${pub?.molecularWeight} Da`} />
            <Row k="Lipophilicity" v={loading ? "…" : `XLogP ${pub?.xlogp}`} />
            <Row k="Drug-likeness" v={violations === 0 ? "Lipinski PASS" : `${violations} Lipinski violation${violations > 1 ? "s" : ""}`} />
          </Section>

          <Section title="Registry pages">
            <div className="space-y-1.5 p-2.5">
              {links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 hover:border-cyan-400 hover:shadow-sm transition">
                  <span className="truncate font-mono text-xs font-bold text-zinc-700 group-hover:text-cyan-700">{l.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-cyan-600" />
                </a>
              ))}
              <p className="px-1 pt-0.5 font-mono text-[11px] leading-snug text-zinc-400">exact pages for {drug.name} — visit for full data</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
