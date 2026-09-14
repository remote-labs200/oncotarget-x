import React, { useState } from "react";
import { Dna, Upload, ArrowRight, Crosshair, CheckCircle2 } from "lucide-react";
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

const MUTATIONS: Record<string, string> = {
  BRAF: "V600E Kinase Domain Mutation",
};

export function LandingHero({ onStartAnalysis, onQuickDemo }: LandingHeroProps) {
  const [patientId, setPatientId] = useState<string>("PT-2026-LN");
  const [selectedGene, setSelectedGene] = useState<string>("BRAF");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const activeTarget = CANCER_TARGETS[selectedGene] || Object.values(CANCER_TARGETS)[0];

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
      expressionLevel: "High (TPM > 185.4)",
      mutationType: MUTATIONS[selectedGene] ?? "Exon 19 Deletion",
      fasta: "",
    });
  };

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col selection:bg-cyan-500 selection:text-white relative">
      {/* Full-bleed docking artwork background — heavily blurred into a soft glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -inset-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-docking.webp')", filter: "blur(28px) saturate(1.2)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-[#f7fafc]/95" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-white/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Dna className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl text-zinc-900">
              OncoTarget-X
            </span>
          </div>
          <button
            onClick={onQuickDemo}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition cursor-pointer"
          >
            Quick Demo
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 flex-1 flex flex-col justify-center items-center text-center py-14">
        <h1 className="animate-fadeIn text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.02]">
          10-Second Protein-Ligand
          <span className="text-gradient-agentic block">Binding & Drug Repurposing</span>
        </h1>
        <p className="animate-fadeIn stagger-1 mt-4 text-lg sm:text-xl text-zinc-600 max-w-xl">
          Pick a target. Drop a profile. Get ranked drugs in seconds.
        </p>

        {/* Simple input card */}
        <div className="animate-slideUp stagger-2 mt-10 w-full rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl p-6 sm:p-8 shadow-[0_24px_70px_-24px_rgba(6,182,212,0.45)] text-left">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-md bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-white">INIT BOX</span>
            <span className="font-mono text-[11px] text-zinc-400">configure → launch agent</span>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Gene pills */}
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-bold text-zinc-800">Target</span>
                <span className="ml-auto font-mono text-xs text-cyan-700">{activeTarget.pdbId}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.keys(CANCER_TARGETS).map((key) => {
                  const isSelected = selectedGene === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setSelectedGene(key)}
                      className={`rounded-xl border px-3 py-2.5 text-base font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-lg scale-[1.03]"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {key}
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-300" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File + patient ID */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`flex items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-4 transition-all ${
                isDragging ? "border-cyan-500 bg-cyan-50" : "border-zinc-300 bg-white"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
                <Upload className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-800">
                  {fileName ?? "Drop tumor profile here"}
                </p>
                <label className="text-xs text-cyan-700 font-semibold cursor-pointer hover:underline">
                  or browse files
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                placeholder="Patient ID"
                className="w-32 shrink-0 rounded-xl bg-zinc-50 border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Big launch */}
            <button
              type="submit"
              className="shimmer-bar w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold text-white hover:from-cyan-600 hover:to-blue-700 hover:shadow-[0_16px_40px_-10px_rgba(6,182,212,0.7)] transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <span>Run Agent</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </main>

      <footer className="py-5 text-center">
        <p className="text-xs text-zinc-500">© 2026 OncoTarget-X · Precision Oncology</p>
      </footer>
    </div>
  );
}
