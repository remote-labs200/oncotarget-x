"use client";

import React, { useState, useEffect } from "react";
import { CANCER_TARGETS, TargetData } from "./data/cancerTargets";
import { LandingHero } from "./components/LandingHero";
import { MultiStepHeader } from "./components/MultiStepHeader";
import { MolecularViewer } from "./components/MolecularViewer";
import { DrugTable } from "./components/DrugTable";
import { ChemblBioactivityCard } from "./components/ChemblBioactivityCard";
import { ExpressionChart } from "./components/ExpressionChart";
import { GeminiAssistant } from "./components/GeminiAssistant";
import { PatientReportModal } from "./components/PatientReportModal";
import { Dna, Database, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  // Step 1: Landing screen
  // Step 2: Loading / Docking simulation screen
  // Step 3: 3D Docking Viewer + Drug Table + ChEMBL Card
  // Step 4: Efficacy Distribution (ExpressionChart)
  // Step 5: Target Summary + Gemini + Download Report
  const [step, setStep] = useState<number>(1);

  const [selectedTargetKey, setSelectedTargetKey] = useState<string>("EGFR");
  const target: TargetData =
    CANCER_TARGETS[selectedTargetKey] || CANCER_TARGETS["EGFR"];

  const [selectedDrugIndex, setSelectedDrugIndex] = useState<number>(0);
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

  // 1. Landing Screen
  if (step === 1) {
    return (
      <LandingHero
        onStartAnalysis={handleLandingSubmit}
        onQuickDemo={handleQuickDemo}
      />
    );
  }

  // 2. Loading Simulation Screen
  if (step === 2) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-4 selection:bg-cyan-500 selection:text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/25">
            <Dna className="h-8 w-8 text-white animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 mb-1">
              Executing 10s AI Docking Pipeline
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Target: {selectedTargetKey} | Case: {customProfile?.patientId}
            </p>
          </div>

          <div className="space-y-3 text-left bg-white p-4 rounded-2xl border border-zinc-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {loadingStage >= 1 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                )}
                <strong className="text-zinc-800">Fetching FDA Drugs from PubChem</strong>
              </span>
              <span className="text-[10px] text-zinc-400">CID 3D SDF</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {loadingStage >= 2 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : loadingStage === 1 ? (
                  <div className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-zinc-200"></div>
                )}
                <strong className="text-zinc-800">Querying ChEMBL Bioactivity API</strong>
              </span>
              <span className="text-[10px] text-zinc-400">IC₅₀ / Kᵢ</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {loadingStage >= 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : loadingStage === 2 ? (
                  <div className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-zinc-200"></div>
                )}
                <strong className="text-zinc-800">Loading PDB 3D Crystal Structure</strong>
              </span>
              <span className="text-[10px] text-zinc-400">PDB: {target.pdbId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {loadingStage >= 4 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : loadingStage === 3 ? (
                  <div className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-zinc-200"></div>
                )}
                <strong className="text-zinc-800">Protein-Ligand Docking & Scoring</strong>
              </span>
              <span className="text-[10px] text-zinc-400">RDKit Matrix</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                style={{
                  width:
                    loadingStage === 0
                      ? "25%"
                      : loadingStage === 1
                      ? "50%"
                      : loadingStage === 2
                      ? "75%"
                      : "100%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      {/* Multi-Step Header with Navigation */}
      <MultiStepHeader
        step={step}
        setStep={setStep}
        onExportReport={() => setShowReportModal(true)}
        targetName={target.name}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* 3rd Screen: 3D Molecular Viewer + Ranked Drugs + ChEMBL */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MolecularViewer
                  currentDrug={currentDrug}
                  targetName={target.name}
                  pdbId={target.pdbId}
                />
              </div>

              <DrugTable
                target={target}
                selectedDrugIndex={selectedDrugIndex}
                onSelectDrug={setSelectedDrugIndex}
              />
            </div>

            <div className="w-full">
              <ChemblBioactivityCard drugName={currentDrug.name} />
            </div>

            <div className="flex justify-between pt-6 border-t border-zinc-200">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
              >
                ← Back to Input
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:from-cyan-600 hover:to-blue-700 transition shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Next: Efficacy Distribution</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4th Screen: Compound Efficacy & Binding Score Distribution */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="max-w-4xl mx-auto">
              <ExpressionChart target={target} />
            </div>

            <div className="flex justify-between pt-6 border-t border-zinc-200 max-w-4xl mx-auto">
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

        {/* 5th Screen: Target Summary + Gemini AI + Download Report */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">
                Target Summary: {target.fullName} ({target.name})
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {target.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-200 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-1">Primary Pathway</span>
                  <strong className="text-zinc-900">{target.pathway}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">Top Compound</span>
                  <strong className="text-cyan-600">
                    {currentDrug.name} ({currentDrug.bindingEnergy})
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">Regulatory Status</span>
                  <strong className="text-emerald-600">{currentDrug.fdaStatus}</strong>
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
                  Download patient PDF summary including 3D coordinates, binding energies, and off-label recommendations.
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
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 px-4 text-center">
        <p className="text-xs text-zinc-500">
          © 2026 OncoTarget-X Clinical AI Labs. All rights reserved. Built for Precision Oncology & Drug Discovery.
        </p>
      </footer>

      {/* PDF Report Modal */}
      <PatientReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        target={target}
        currentDrug={currentDrug}
      />
    </div>
  );
}
