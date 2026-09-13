import React, { useState } from "react";
import {
  Dna,
  Upload,
  FileText,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Database,
  Crosshair,
  CheckCircle2,
} from "lucide-react";
import { CANCER_TARGETS } from "@/app/data/cancerTargets";

interface LandingHeroProps {
  onStartAnalysis: (profileData: {
    patientId: string;
    gene: string;
    expressionLevel: string;
    mutationType: string;
    fasta: string;
  }) => void;
  onQuickDemo: () => void;
}

export function LandingHero({
  onStartAnalysis,
  onQuickDemo,
}: LandingHeroProps) {
  const [patientId, setPatientId] = useState<string>("PT-2026-LN");
  const [selectedGene, setSelectedGene] = useState<string>("EGFR");
  const [expressionLevel, setExpressionLevel] =
    useState<string>("High (TPM > 185.4)");
  const [mutationType, setMutationType] = useState<string>(
    "Exon 19 Deletion (L747_P753insS)",
  );
  const [fastaSequence, setFastaSequence] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const activeTarget = CANCER_TARGETS[selectedGene] || CANCER_TARGETS["EGFR"];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartAnalysis({
      patientId,
      gene: selectedGene,
      expressionLevel,
      mutationType,
      fasta: fastaSequence,
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Dna className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-zinc-900">
                  OncoTarget-X
                </span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-700 border border-cyan-500/20">
                  AI Precision v2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-600">
                10-Second Protein-Ligand Binding & Drug Repurposing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 border border-zinc-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>
                RDKit Engine:{" "}
                <strong className="text-emerald-600">Online</strong>
              </span>
            </div>
            <button
              onClick={onQuickDemo}
              className="rounded-xl bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-800 transition-all border border-zinc-300 cursor-pointer"
            >
              Launch Quick Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Upload Center */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 border border-cyan-500/20 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen Computational Oncology & Rapid Docking</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 mb-3 max-w-3xl">
          AI Precision v2.4
          <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
            10-Second Protein-Ligand Binding & Drug Repurposing
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mb-8">
          Upload a patient&apos;s tumor gene expression profile or select a biomarker target below to instantly compute 3D protein structures and ranked FDA off-label drugs.
        </p>

        {/* Upload & Input Center Card */}
        <div className="w-full rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 shadow-xl text-left relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Dna className="w-48 h-48 text-cyan-600" />
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
            {/* Target Biomarker Selector moved right into the Landing Page */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crosshair className="h-5 w-5 text-cyan-600" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-800">
                    Target Biomarker Selector
                  </h2>
                </div>
                <span className="text-xs text-zinc-500">
                  PDB ID: <code className="text-cyan-600 font-bold">{activeTarget.pdbId}</code>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                {Object.keys(CANCER_TARGETS).map((key) => {
                  const t = CANCER_TARGETS[key];
                  const isSelected = selectedGene === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setSelectedGene(key);
                        if (key === "EGFR") setMutationType("Exon 19 Deletion (L747_P753insS)");
                        if (key === "BRAF") setMutationType("V600E Kinase Domain Mutation");
                        if (key === "TP53") setMutationType("R273H DNA-Binding Mutation");
                        if (key === "KRAS") setMutationType("G12C Covalent Switch Mutation");
                        if (key === "ALK") setMutationType("EML4-ALK Fusion Variant 1");
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-cyan-50 border-cyan-500 shadow-md ring-1 ring-cyan-500"
                          : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span
                          className={`font-bold text-sm ${isSelected ? "text-cyan-700" : "text-zinc-800"}`}
                        >
                          {t.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 truncate w-full">
                        {t.fullName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                <div>
                  <strong className="text-zinc-800">Mutation Frequency:</strong>{" "}
                  {activeTarget.mutationFrequency}
                </div>
                <div>
                  <strong className="text-zinc-800">Pathway:</strong> {activeTarget.pathway}
                </div>
              </div>
            </div>

            {/* Big Drag and Drop Box */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Patient Tumor Profile / RNA-Seq Expression Data (Drag & Drop or Click)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? "border-cyan-500 bg-cyan-50/50"
                    : "border-zinc-300 hover:border-zinc-400 bg-white"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-200">
                    <Upload className="h-5 w-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-800">
                      {fileName
                        ? `Uploaded: ${fileName}`
                        : "Drag & drop patient tumor profile (.vcf, .csv, .json, .txt)"}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Supports TCGA expression matrices, clinical NGS reports, or VCF variant files
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 cursor-pointer border border-zinc-300">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Patient ID / Case Reference
                </label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Mutation Variant / Expression
                </label>
                <input
                  type="text"
                  value={mutationType}
                  onChange={(e) => setMutationType(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* FASTA Sequence Input Box */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Target Protein FASTA Sequence (Optional for custom homology modeling)
              </label>
              <textarea
                rows={2}
                placeholder=">sp|P00533|EGFR_HUMAN Epidermal growth factor receptor..."
                value={fastaSequence}
                onChange={(e) => setFastaSequence(e.target.value)}
                className="w-full rounded-xl bg-white border border-zinc-300 p-3 text-xs text-zinc-800 font-mono focus:border-cyan-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <ShieldCheck className="h-4 w-4 text-cyan-600" />
                <span>
                  HIPAA-compliant secure local processing with RDKit scoring matrix.
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-bold text-white hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Launch 10s AI Docking Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="border-t border-zinc-200 bg-white py-6 px-4 text-center">
        <p className="text-xs text-zinc-500">
          © 2026 OncoTarget-X Clinical AI Labs. All rights reserved. Built for Precision Oncology & Drug Discovery.
        </p>
      </footer>
    </div>
  );
}
