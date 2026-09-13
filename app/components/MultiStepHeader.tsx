import React from "react";
import { Dna, FileText, ChevronRight } from "lucide-react";

interface MultiStepHeaderProps {
  step: number;
  setStep: (step: number) => void;
  onExportReport: () => void;
  targetName: string;
}

export function MultiStepHeader({
  step,
  setStep,
  onExportReport,
  targetName,
}: MultiStepHeaderProps) {
  const steps = [
    { id: 3, label: "3D Docking & Candidates" },
    { id: 4, label: "Efficacy Distribution" },
    { id: 5, label: "Target Summary & Report" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
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
                Target: {targetName}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Step {step} of 5:{" "}
              {step === 3
                ? "3D Docking & Ranked Drugs"
                : step === 4
                ? "Binding Energy Distribution"
                : "Target Summary & Export"}
            </p>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
          {steps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                    : isCompleted
                    ? "text-zinc-700 hover:bg-zinc-200/60"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <span>{s.id - 2}. {s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 border border-zinc-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>
              RDKit: <strong className="text-emerald-600">Active</strong>
            </span>
          </div>

          <button
            onClick={onExportReport}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Export Patient Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
