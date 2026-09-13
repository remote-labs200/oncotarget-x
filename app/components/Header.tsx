import React from "react";
import { Dna, FileText } from "lucide-react";

interface HeaderProps {
  onExportReport: () => void;
}

export function Header({ onExportReport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Dna className="h-6 w-6 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-white">
                OncoTarget-X
              </span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-500/20">
                AI Precision v2.4
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              10-Second Protein-Ligand Binding & Drug Repurposing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-600 border border-zinc-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>
              RDKit Scoring Engine:{" "}
              <strong className="text-emerald-400">Ready</strong>
            </span>
          </div>

          <button
            onClick={onExportReport}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Export Patient Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
