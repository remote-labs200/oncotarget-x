import React, { useEffect, useState } from "react";
import { ArrowUpRight, PanelRightClose, PanelRightOpen } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface DrugTableProps {
  target: TargetData;
  selectedDrugIndex: number;
  onSelectDrug: (index: number) => void;
  onOpenDrug: (index: number) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DrugTable({
  target,
  selectedDrugIndex,
  onSelectDrug,
  onOpenDrug,
  collapsed = false,
  onToggleCollapse,
}: DrugTableProps) {
  const [pubchemData, setPubchemData] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchPubchemDetails() {
      const currentDrug = target.drugs[selectedDrugIndex];
      if (!currentDrug || pubchemData[currentDrug.name]) return;
      try {
        const res = await fetch(
          `/api/pubchem?name=${encodeURIComponent(currentDrug.name)}`,
        );
        const data = await res.json();
        if (data.success) {
          setPubchemData((prev) => ({ ...prev, [currentDrug.name]: data }));
        }
      } catch (err) {
        console.error("PubChem fetch error:", err);
      }
    }
    fetchPubchemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, selectedDrugIndex]);

  // Collapsed rail — only the 1..5 drug buttons, frees space for the 3D canvas
  if (collapsed) {
    return (
      <div className="lg:col-span-1 rounded-3xl border border-white bg-white/80 backdrop-blur-xl shadow-lg flex lg:flex-col items-center gap-2 p-2.5 overflow-hidden">
        <button
          onClick={onToggleCollapse}
          title="Expand candidates"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-cyan-50 hover:text-cyan-700 transition cursor-pointer"
        >
          <PanelRightOpen className="h-4 w-4" />
        </button>
        <div className="flex lg:flex-col gap-2 overflow-y-auto">
          {target.drugs.map((drug, idx) => {
            const isSelected = selectedDrugIndex === idx;
            return (
              <button
                key={drug.name}
                onClick={() => onSelectDrug(idx)}
                title={`${idx + 1}. ${drug.name} (${drug.bindingEnergy})`}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105"
                    : idx === 0
                      ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:border-cyan-300 hover:text-cyan-700"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideUp stagger-1 lg:col-span-3 rounded-2xl border border-white bg-white/80 backdrop-blur-xl shadow-lg flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2 bg-white/60">
        <h3 className="text-xs font-bold text-zinc-900">
          Candidates{" "}
          <span className="font-mono text-cyan-700">({target.name})</span>
        </h3>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-500/25 px-1.5 py-px text-[9px] font-semibold text-emerald-700">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            {target.drugs.length}
          </span>
          <button
            onClick={onToggleCollapse}
            title="Collapse to number rail"
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-cyan-50 hover:text-cyan-700 transition cursor-pointer"
          >
            <PanelRightClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ultra-compact single-line rows */}
      <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto">
        {target.drugs.map((drug, idx) => {
          const isSelected = selectedDrugIndex === idx;
          return (
            <div
              key={drug.name}
              onClick={() => onSelectDrug(idx)}
              title={`${drug.name} · ${drug.bindingEnergy} · K_d ${drug.affinityScore} nM · click to dock, ↗ for dossier`}
              className={`group flex items-center gap-2 px-2.5 py-[7px] transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-50 to-blue-50/70 shadow-[inset_3px_0_0_#06b6d4]"
                  : "hover:bg-zinc-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  idx === 0
                    ? "bg-amber-400 text-white"
                    : isSelected
                      ? "bg-cyan-500 text-white"
                      : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {idx + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-900">
                {drug.name}
              </span>
              <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-px text-[10px] font-bold text-emerald-700 border border-emerald-500/25 font-mono">
                {drug.bindingEnergy.replace(" kcal/mol", "")}
              </span>
              <p className="text-xs text-zinc-500 truncate line-clamp-1">
                {drug.indication?.split(" ").slice(0, 12).join(" ")}
                {drug.indication?.length > 12 ? "..." : ""}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDrug(idx);
                }}
                title={`Open full dossier for ${drug.name}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
