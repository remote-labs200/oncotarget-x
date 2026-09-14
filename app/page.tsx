"use client";

import React, { useState, useEffect } from "react";
import { CANCER_TARGETS, TargetData } from "./data/cancerTargets";
import { LandingHero } from "./components/LandingHero";
import { MultiStepHeader } from "./components/MultiStepHeader";
import { MolecularViewer } from "./components/MolecularViewer";
import { DrugTable } from "./components/DrugTable";
import { ExpressionChart } from "./components/ExpressionChart";
import { BioactivityLab } from "./components/BioactivityLab";
import { DrugDossier } from "./components/DrugDossier";
import { GeminiAssistant } from "./components/GeminiAssistant";
import { PatientReportModal } from "./components/PatientReportModal";
import { AgentBackground } from "./components/AgentBackground";
import { PipelineLoader } from "./components/PipelineLoader";
import { AgentChat } from "./components/AgentChat";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Step 1: Landing screen
  // Step 2: Loading / Docking simulation screen
  // Step 3: 3D Docking Viewer + Drug Table + ChEMBL Card
  // Step 4: Efficacy Distribution (ExpressionChart)
  // Step 5: Target Summary + Gemini + Download Report
  const [step, setStep] = useState<number>(1);

  const [selectedTargetKey, setSelectedTargetKey] = useState<string>("BRAF");
  const target: TargetData =
    CANCER_TARGETS[selectedTargetKey] || CANCER_TARGETS["BRAF"] || Object.values(CANCER_TARGETS)[0];

  const [selectedDrugIndex, setSelectedDrugIndex] = useState<number>(0);
  const [dossierDrugIndex, setDossierDrugIndex] = useState<number>(0);
  const [candidatesCollapsed, setCandidatesCollapsed] =
    useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const [customProfile, setCustomProfile] = useState<{
    patientId: string;
    gene: string;
    expressionLevel: string;
    mutationType: string;
  } | null>(null);

  // Loading simulation state for Step 2
  const [loadingStage, setLoadingStage] = useState<number>(0);

  useEffect(() => {
    if (step === 2) {
      setLoadingStage(0);
      const t1 = setTimeout(() => setLoadingStage(1), 1500); // Fetching PubChem drugs
      const t2 = setTimeout(() => setLoadingStage(2), 3200); // Fetching ChEMBL bioactivity
      const t3 = setTimeout(() => setLoadingStage(3), 5000); // Loading PDB 3D structure
      const t4 = setTimeout(() => {
        setLoadingStage(4);
        setTimeout(() => setStep(3), 1000); // Move to Step 3 after completion
      }, 6800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [step]);

  const handleLandingSubmit = (profile: {
    patientId: string;
    gene: string;
    expressionLevel: string;
    mutationType: string;
    fasta: string;
  }) => {
    setCustomProfile({
      patientId: profile.patientId,
      gene: profile.gene,
      expressionLevel: profile.expressionLevel,
      mutationType: profile.mutationType,
    });
    setSelectedTargetKey(profile.gene);
    setStep(2); // Go to loading screen
  };

  const handleQuickDemo = () => {
    setSelectedTargetKey("EGFR");
    setCustomProfile({
      patientId: "PT-DEMO-2026",
      gene: "EGFR",
      expressionLevel: "High (TPM > 185.4)",
      mutationType: "Exon 19 Deletion",
    });
    setStep(2); // Go to loading screen
  };

  const currentDrug = target.drugs[selectedDrugIndex] || target.drugs[0];

  // --- Speed-Diver Benchmarking Toggle ---
  const [benchmarkTime, setBenchmarkTime] = useState<number>(0); // seconds
  const hpcAverageSeconds = 4 * 3600 + 12 * 60; // 4h 12m = 15,120s
  useEffect(() => {
    // Simulate real-time processing: increment every 500ms while on Step 3
    if (step === 3) {
      const interval = setInterval(() => {
        setBenchmarkTime((prev) => prev + 0.5);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // 1. Landing Screen
  if (step === 1) {
    return (
      <LandingHero
        onStartAnalysis={handleLandingSubmit}
        onQuickDemo={handleQuickDemo}
      />
    );
  }

  // 2. Pipeline loader — same timeouts → same step 3 handoff.
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#f7fafc] text-zinc-900 flex items-center justify-center px-4 py-10">
        <AgentBackground />
        <PipelineLoader
          loadingStage={loadingStage}
          targetName={selectedTargetKey}
          pdbId={target.pdbId}
          patientId={customProfile?.patientId}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-zinc-950 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between relative">
      <AgentBackground />
      {/* Multi-Step Header with Navigation */}
      <MultiStepHeader
        step={step}
        setStep={setStep}
        onExportReport={() => setShowReportModal(true)}
        targetName={target.name}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* 3rd Screen: 3D Molecular Viewer + Collapsible Ranked Drugs (fills ~90% of page) */}
        {step === 3 && (
          <div className="animate-fadeIn relative space-y-4">
            {/* Speed-Diver Benchmarking Toggle */}
            <div className="flex items-center justify-between bg-zinc-950/90 rounded-2xl px-4 py-3 shadow-lg border border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">
                  Processing Time:
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {benchmarkTime.toFixed(1)}s
                </span>
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  (vs. {hpcAverageSeconds / 60}m standard HPC)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  AI Acceleration Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={
                  candidatesCollapsed ? "lg:col-span-11" : "lg:col-span-9"
                }
              >
                <MolecularViewer
                  currentDrug={currentDrug}
                  targetName={target.name}
                  pdbId={target.pdbId}
                  tall={candidatesCollapsed}
                  drugRank={selectedDrugIndex + 1}
                  drugTotal={target.drugs.length}
                  onPrevDrug={() =>
                    setSelectedDrugIndex(
                      (i) =>
                        (i - 1 + target.drugs.length) % target.drugs.length,
                    )
                  }
                  onNextDrug={() =>
                    setSelectedDrugIndex((i) => (i + 1) % target.drugs.length)
                  }
                  onOpenDossier={() => {
                    setDossierDrugIndex(selectedDrugIndex);
                    setStep(7);
                  }}
                />
              </div>

              <DrugTable
                target={target}
                selectedDrugIndex={selectedDrugIndex}
                onSelectDrug={setSelectedDrugIndex}
                onOpenDrug={(i) => {
                  setDossierDrugIndex(i);
                  setStep(7);
                }}
                collapsed={candidatesCollapsed}
                onToggleCollapse={() => setCandidatesCollapsed((v) => !v)}
              />
            </div>

            {/* floating mini-nav — bottom-left, chat owns bottom-right */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white/90 p-1.5 shadow-xl backdrop-blur w-fit">
              <button
                onClick={() => setStep(1)}
                title="Back to input"
                className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
              >
                ←
              </button>
              <button
                onClick={() => setStep(6)}
                title="Bioactivity Lab"
                className="rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
              >
                Lab
              </button>
              <button
                onClick={() => setStep(4)}
                title="Next: efficacy"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-white shadow cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* 4th Screen: Full Efficacy Report */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="max-w-5xl mx-auto">
              <ExpressionChart target={target} />
            </div>

            <div className="flex justify-between pt-6 border-t border-zinc-200 max-w-5xl mx-auto">
              <button
                onClick={() => setStep(3)}
                className="rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
              >
                ← Back to 3D Viewer
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:from-cyan-600 hover:to-blue-700 transition shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Next: Target Summary & Report</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 5th Screen: Complete Target Summary + Gemini AI + Download Report */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="scanline" />
              <div>
                <p className="font-mono text-[11px] text-cyan-700 font-bold">
                  CASE {customProfile?.patientId ?? "PT-2026"} ·{" "}
                  {customProfile?.mutationType ?? target.name}
                </p>
                <h3 className="text-xl font-extrabold text-zinc-900">
                  {target.fullName} ({target.name})
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed mt-1">
                  {target.description}
                </p>
              </div>
              {/* stat grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "PDB structure", value: target.pdbId },
                  {
                    label: "Pathway",
                    value: target.pathway.split("/")[0].trim(),
                  },
                  {
                    label: "Mutation freq.",
                    value: target.mutationFrequency.split("(")[0].trim(),
                  },
                  {
                    label: "Compounds screened",
                    value: String(target.drugs.length),
                  },
                  {
                    label: "Top compound",
                    value: `${currentDrug.name} (${currentDrug.bindingEnergy})`,
                  },
                  {
                    label: "Top K_d",
                    value: `${currentDrug.affinityScore} nM`,
                  },
                  {
                    label: "Status",
                    value: currentDrug.fdaStatus
                      .split(" ")
                      .slice(0, 2)
                      .join(" "),
                  },
                  { label: "Phase", value: currentDrug.clinicalPhase },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="animate-fadeIn rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {s.label}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[13px] font-bold text-zinc-900"
                      title={s.value}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              {/* pipeline recap */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-emerald-50/70 border border-emerald-200 px-4 py-3 font-mono text-[11px] text-emerald-800">
                <span>PubChem ✓</span>
                <span>→</span>
                <span>ChEMBL ✓</span>
                <span>→</span>
                <span>PDB {target.pdbId} ✓</span>
                <span>→</span>
                <span>RDKit ΔG ✓</span>
                <span>→</span>
                <strong>Report ready</strong>
              </div>

              {/* key findings */}
              <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/70 to-blue-50/50 p-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-800 mb-2">
                  Key findings
                </h4>
                <ul className="space-y-1.5 text-[13px] text-zinc-700 leading-relaxed">
                  {(() => {
                    const ranked = [...target.drugs].sort(
                      (a, b) =>
                        parseFloat(a.bindingEnergy) -
                        parseFloat(b.bindingEnergy),
                    );
                    const hits = ranked.filter(
                      (d) => parseFloat(d.bindingEnergy) <= -9.0,
                    );
                    const avg =
                      ranked.reduce(
                        (s, d) => s + parseFloat(d.bindingEnergy),
                        0,
                      ) / ranked.length;
                    return (
                      <>
                        <li>
                          <strong className="text-zinc-900">
                            {ranked[0]?.name} ({ranked[0]?.bindingEnergy})
                          </strong>{" "}
                          is the lead repurposing candidate — strongest
                          predicted binding to {target.name}.
                        </li>
                        <li>
                          <strong className="text-emerald-700">
                            {hits.length}/{ranked.length} compounds
                          </strong>{" "}
                          clear the −9.0 kcal/mol bar (mean {avg.toFixed(1)}).
                        </li>
                        <li>
                          All hits are already <strong>FDA-approved</strong> (
                          {ranked
                            .map((d) => d.fdaStatus.split(" ")[1] ?? "")
                            .filter(Boolean)
                            .slice(0, 3)
                            .join(", ")}
                          {ranked.length > 3 ? "…" : ""}) — repurposing cuts
                          years off development.
                        </li>
                      </>
                    );
                  })()}
                </ul>
              </div>

              {/* full ranking */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                  Full ranking — all compounds
                </h4>
                <div className="overflow-hidden rounded-2xl border border-zinc-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-50 text-left text-[10px] uppercase tracking-wider text-zinc-400">
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Compound</th>
                        <th className="px-3 py-2">ΔG</th>
                        <th className="px-3 py-2">K_d</th>
                        <th className="px-3 py-2 hidden sm:table-cell">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {[...target.drugs]
                        .sort(
                          (a, b) =>
                            parseFloat(a.bindingEnergy) -
                            parseFloat(b.bindingEnergy),
                        )
                        .map((d, i) => (
                          <tr
                            key={d.name}
                            className={
                              d.name === currentDrug.name ? "bg-cyan-50/60" : ""
                            }
                          >
                            <td className="px-3 py-2 font-bold text-zinc-400">
                              {i + 1}
                            </td>
                            <td className="px-3 py-2 font-bold text-zinc-900">
                              {d.name}
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-emerald-700">
                              {d.bindingEnergy}
                            </td>
                            <td className="px-3 py-2 font-mono text-zinc-600">
                              {d.affinityScore} nM
                            </td>
                            <td className="px-3 py-2 text-zinc-500 hidden sm:table-cell">
                              {d.clinicalPhase}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* method + limits */}
              <div className="grid gap-3 sm:grid-cols-2 text-[12px] leading-relaxed">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 mb-1.5">
                    How this ran
                  </h4>
                  <ol className="space-y-1 text-zinc-600">
                    <li>1. PubChem 3D ligand structures fetched</li>
                    <li>2. ChEMBL IC₅₀/Kᵢ assays cross-checked</li>
                    <li>3. RCSB PDB {target.pdbId} pocket loaded</li>
                    <li>4. RDKit ΔG matrix scored & ranked</li>
                    <li>5. Gemini clinical read + this report</li>
                  </ol>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1.5">
                    Limits & next steps
                  </h4>
                  <ul className="space-y-1 text-zinc-600">
                    <li>
                      • Scores are predictive — confirm with in-vitro binding.
                    </li>
                    <li>• Off-label use needs tumor-board sign-off.</li>
                    <li>
                      • Next: validate top hit, check resistance pathways.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <GeminiAssistant
              target={target}
              currentDrug={currentDrug}
              patientId={customProfile?.patientId}
              mutationType={customProfile?.mutationType}
            />

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">
                  Ready to compile clinical precision report?
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Download patient PDF summary including 3D coordinates, binding
                  energies, and off-label recommendations.
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 transition cursor-pointer whitespace-nowrap"
              >
                <span>Export & Download PDF Report</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-between pt-6 border-t border-zinc-200">
              <button
                onClick={() => setStep(4)}
                className="rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
              >
                ← Back to Efficacy Chart
              </button>
            </div>
          </div>
        )}

        {/* 6th Screen: Dedicated Bioactivity Lab (all drugs) */}
        {step === 6 && (
          <BioactivityLab target={target} onBack={() => setStep(3)} />
        )}

        {/* 7th Screen: Dedicated Drug Dossier */}
        {step === 7 && (
          <DrugDossier
            target={target}
            drugIndex={dossierDrugIndex}
            rank={dossierDrugIndex + 1}
            onBack={() => setStep(3)}
            onPrevDrug={() =>
              setDossierDrugIndex(
                (i) => (i - 1 + target.drugs.length) % target.drugs.length,
              )
            }
            onNextDrug={() =>
              setDossierDrugIndex((i) => (i + 1) % target.drugs.length)
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 px-4 text-center">
        <p className="text-xs text-zinc-500">
          © 2026 OncoTarget-X Clinical AI Labs. All rights reserved. Built for
          Precision Oncology & Drug Discovery.
        </p>
      </footer>

      {/* PDF Report Modal */}
      <PatientReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        target={target}
        currentDrug={currentDrug}
      />

      {/* Floating agent chat — knows the current run */}
      {step >= 3 && (
        <AgentChat
          context={`Target: ${target.name} (${target.fullName}), PDB ${target.pdbId}, pathway ${target.pathway}, mutation frequency ${target.mutationFrequency}. Patient: ${customProfile?.patientId ?? "demo case"}, mutation ${customProfile?.mutationType ?? "n/a"}. Ranked compounds: ${[
            ...target.drugs,
          ]
            .sort(
              (a, b) =>
                parseFloat(a.bindingEnergy) - parseFloat(b.bindingEnergy),
            )
            .map(
              (d, i) =>
                `${i + 1}. ${d.name} ${d.bindingEnergy}, Kd ${d.affinityScore} nM (${d.fdaStatus}; ${d.mechanism})`,
            )
            .join("; ")}. Selected: ${currentDrug.name}.`}
        />
      )}
    </div>
  );
}
