import React, { useEffect, useState } from "react";
import { BarChart3, ExternalLink } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface DrugTableProps {
  target: TargetData;
  selectedDrugIndex: number;
  onSelectDrug: (index: number) => void;
}

export function DrugTable({
  target,
  selectedDrugIndex,
  onSelectDrug,
}: DrugTableProps) {
  const [pubchemData, setPubchemData] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchPubchemDetails() {
      const currentDrug = target.drugs[selectedDrugIndex];
      if (!currentDrug) return;
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
  }, [target, selectedDrugIndex]);

  const activeDrug = target.drugs[selectedDrugIndex];
  const activePubChem = pubchemData[activeDrug?.name];

  return (
    <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 backdrop-blur-xl shadow-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 bg-white/40">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Ranked Off-Label Candidates ({target.name})
          </h3>
        </div>
        <span className="text-xs text-zinc-600">
          PubChem & ChEMBL Integrated
        </span>
      </div>

      <div className="flex-1 divide-y divide-zinc-800/60 overflow-y-auto max-h-[380px]">
        {target.drugs.map((drug, idx) => {
          const isSelected = selectedDrugIndex === idx;
          return (
            <div
              key={drug.name}
              onClick={() => onSelectDrug(idx)}
              className={`p-4 transition-all cursor-pointer ${
                isSelected
                  ? "bg-cyan-500/10 border-l-4 border-l-cyan-400"
                  : "hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      idx === 0
                        ? "bg-amber-400 text-black"
                        : idx === 1
                          ? "bg-zinc-300 text-black"
                          : "bg-zinc-800 text-zinc-700"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-white">{drug.name}</h4>
                </div>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  {drug.bindingEnergy}
                </span>
              </div>

              <p className="text-xs text-zinc-700 mb-2">{drug.indication}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-600">
                <span className="truncate max-w-[200px]">{drug.mechanism}</span>
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${drug.pubChemId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>CID: {drug.pubChemId}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {activePubChem && (
        <div className="p-3 bg-white border-t border-zinc-200 text-[11px] font-mono text-zinc-600 space-y-1">
          <div className="text-cyan-400 font-semibold flex items-center justify-between">
            <span>PubChem Live Property: {activeDrug.name}</span>
            <span className="text-emerald-400">
              MW: {activePubChem.molecularWeight} g/mol
            </span>
          </div>
          <div
            className="truncate text-zinc-700"
            title={activePubChem.iupacName}
          >
            IUPAC: {activePubChem.iupacName}
          </div>
        </div>
      )}
    </div>
  );
}
