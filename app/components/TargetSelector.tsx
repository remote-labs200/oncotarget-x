import React from "react";
import { Crosshair, CheckCircle2, RefreshCw } from "lucide-react";
import { CANCER_TARGETS, TargetData } from "@/app/data/cancerTargets";

interface TargetSelectorProps {
  selectedTargetKey: string;
  onSelectTarget: (key: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
}

export function TargetSelector({
  selectedTargetKey,
  onSelectTarget,
  onRunAnalysis,
  isAnalyzing,
  analysisProgress,
}: TargetSelectorProps) {
  const target: TargetData =
    CANCER_TARGETS[selectedTargetKey] || CANCER_TARGETS["EGFR"];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-700">
            Target Biomarker Selector
          </h2>
        </div>
        <span className="text-xs text-zinc-500">
          PDB ID: <code className="text-cyan-400">{target.pdbId}</code>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {Object.keys(CANCER_TARGETS).map((key) => {
          const t = CANCER_TARGETS[key];
          const isSelected = selectedTargetKey === key;
          return (
            <button
              key={key}
              onClick={() => onSelectTarget(key)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                  : "bg-white/60 border-zinc-200 hover:border-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`font-bold text-sm ${isSelected ? "text-cyan-400" : "text-white"}`}
                >
                  {t.name}
                </span>
                {isSelected && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                )}
              </div>
              <span className="text-[10px] text-zinc-600 truncate w-full">
                {t.fullName}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-200/80 text-xs">
        <div className="flex items-center gap-4 text-zinc-600">
          <div>
            <strong className="text-zinc-200">Mutation Frequency:</strong>{" "}
            {target.mutationFrequency}
          </div>
          <div className="hidden sm:block">
            <strong className="text-zinc-200">Pathway:</strong> {target.pathway}
          </div>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-zinc-200 font-medium transition-all border border-zinc-700 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin text-cyan-400" : ""}`}
          />
          <span>
            {isAnalyzing
              ? `Docking (${analysisProgress}%)`
              : "Re-run 10s Docking"}
          </span>
        </button>
      </div>
    </div>
  );
}
