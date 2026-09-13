"use client";

import React, { useEffect, useState } from "react";
import { Activity, Database, FlaskConical, ExternalLink } from "lucide-react";

interface ChemblBioactivityCardProps {
  drugName: string;
}

export function ChemblBioactivityCard({
  drugName,
}: ChemblBioactivityCardProps) {
  const [chemblData, setChemblData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchChembl() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/chembl?name=${encodeURIComponent(drugName)}`,
        );
        const data = await res.json();
        if (isMounted && data.success) {
          setChemblData(data);
        }
      } catch (err) {
        console.error("ChEMBL fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchChembl();
    return () => {
      isMounted = false;
    };
  }, [drugName]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-zinc-900">
            ChEMBL Bioactivity Lab Data ($IC_{50}$ / $K_i$)
          </h4>
        </div>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          {chemblData?.chemblId || "CHEMBL939"}
        </span>
      </div>

      <p className="text-xs text-zinc-600 mb-3">
        Verified experimental assay bioactivity records for{" "}
        <span className="text-zinc-900 font-semibold">{drugName}</span> from the
        EMBL-EBI ChEMBL database.
      </p>

      {loading ? (
        <div className="py-6 flex items-center justify-center text-xs text-zinc-500 font-mono">
          Querying ChEMBL REST API...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">
            <span>Assay Type</span>
            <span>Parameter</span>
            <span>Value ($K_i / IC_{50}$)</span>
          </div>
          <div className="divide-y divide-zinc-800/80 rounded-xl bg-white border border-zinc-200 overflow-hidden">
            {chemblData?.activities?.map((act: any, idx: number) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-mono"
              >
                <span className="text-zinc-700 truncate" title={act.targetName}>
                  {act.assayType === "B" ? "Binding" : "Functional"}
                </span>
                <span className="text-cyan-400 font-bold">
                  {act.standardType}
                </span>
                <span className="text-emerald-400 font-bold">
                  {act.standardValue} {act.standardUnits}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
            <span>
              Molecule Type: {chemblData?.moleculeType || "Small molecule"}
            </span>
            <a
              href={`https://www.ebi.ac.uk/chembl/g/#browse/activities/${chemblData?.chemblId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>ChEMBL Browser</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
