import React, { useState } from "react";
import { Sliders, Dna, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface TumorProfileInputProps {
  selectedTargetKey: string;
  onSelectTarget: (key: string) => void;
  onRunCustomAnalysis: (customProfile: {
    patientId: string;
    gene: string;
    expressionLevel: string;
    mutationType: string;
  }) => void;
  isAnalyzing: boolean;
}

export function TumorProfileInput({
  selectedTargetKey,
  onSelectTarget,
  onRunCustomAnalysis,
  isAnalyzing,
}: TumorProfileInputProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string>("PT-2026-LN");
  const [selectedGene, setSelectedGene] = useState<string>(selectedTargetKey);
  const [expressionLevel, setExpressionLevel] =
    useState<string>("High (TPM > 145.2)");
  const [mutationType, setMutationType] = useState<string>(
    "Exon 19 Deletion (L747_P753insS)",
  );
  const [rawText, setRawText] = useState<string>("");

  const handlePresetLoad = (preset: string) => {
    if (preset === "nsclc") {
      setPatientId("PT-NSCLC-882");
      setSelectedGene("EGFR");
      setExpressionLevel("High (TPM: 182.4)");
      setMutationType("L858R Activating Mutation");
    } else if (preset === "melanoma") {
      setPatientId("PT-MEL-401");
      setSelectedGene("BRAF");
      setExpressionLevel("Amplified (CN: 4.2)");
      setMutationType("V600E Substitution");
    } else if (preset === "crc") {
      setPatientId("PT-CRC-919");
      setSelectedGene("KRAS");
      setExpressionLevel("Overexpressed (TPM: 98.6)");
      setMutationType("G12C Covalent Anchor");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectTarget(selectedGene);
    onRunCustomAnalysis({
      patientId,
      gene: selectedGene,
      expressionLevel,
      mutationType,
    });
    setIsOpen(false);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-cyan-950/20 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Patient Tumor Expression Profile
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Active Profiling Engine
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              Input RNA-Seq expression or clinical NGS mutation report for
              instant 10s docking simulation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>
              {isOpen ? "Hide Profile Editor" : "Input Patient Profile"}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Tumor Profile Form */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 pt-5 border-t border-zinc-200 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Clinical Case Presets
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePresetLoad("nsclc")}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
              >
                NSCLC (EGFR)
              </button>
              <button
                type="button"
                onClick={() => handlePresetLoad("melanoma")}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
              >
                Melanoma (BRAF)
              </button>
              <button
                type="button"
                onClick={() => handlePresetLoad("crc")}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
              >
                CRC (KRAS)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Patient / Sample ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Primary Target Gene
              </label>
              <select
                value={selectedGene}
                onChange={(e) => setSelectedGene(e.target.value)}
                className="w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none"
              >
                <option value="EGFR">EGFR (Epidermal Growth Factor)</option>
                <option value="BRAF">BRAF (Serine/Threonine Kinase)</option>
                <option value="TP53">TP53 (Tumor Suppressor)</option>
                <option value="KRAS">KRAS (GTPase Oncogene)</option>
                <option value="ALK">ALK (Anaplastic Lymphoma Kinase)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Expression Level (RNA-Seq)
              </label>
              <input
                type="text"
                value={expressionLevel}
                onChange={(e) => setExpressionLevel(e.target.value)}
                required
                className="w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Mutation Variant
              </label>
              <input
                type="text"
                value={mutationType}
                onChange={(e) => setMutationType(e.target.value)}
                required
                className="w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-600 mb-1">
              Raw FastQ / VCF / Tumor Transcriptome snippet (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Paste transcriptomic counts or clinical biomarkers here (e.g. EGFR exon 19 del detected with VAF 42.1%)..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs text-zinc-700 font-mono focus:border-cyan-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>
                RDKit pipeline automatically maps variant to 3D PDB structure.
              </span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 text-xs font-bold text-black hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>
                {isAnalyzing
                  ? "Running 10s Docking..."
                  : "Run AI Docking Pipeline"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
