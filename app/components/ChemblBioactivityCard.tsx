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
    <div className="animate-slideUp stagger-2 rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-5 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.3)] flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <FlaskConical className="h-4 w-4 text-emerald-600" />
          </span>
          <h4 className="text-sm font-bold text-zinc-900">
            Bioactivity Lab <span className="font-mono text-emerald-700">IC₅₀ / Kᵢ</span>
          </h4>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {chemblData?.chemblId || "CHEMBL939"}
        </span>
      </div>

      <p className="text-xs text-zinc-600 mb-3">
        Verified experimental assay bioactivity records for{" "}
        <span className="text-zinc-900 font-semibold">{drugName}</span> from the
        EMBL-EBI ChEMBL database.
      </p>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          agent querying ChEMBL REST API<span className="animate-blink">_</span>
        </div>
      ) : (
        <div className="space-y-2 animate-fadeIn">
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2">
            <span>Assay Type</span>
            <span>Parameter</span>
            <span>Value (Kᵢ / IC₅₀)</span>
          </div>
          <div className="divide-y divide-zinc-100 rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-sm">
            {chemblData?.activities?.map((act: any, idx: number) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-mono"
              >
                <span className="text-zinc-600 truncate" title={act.targetName}>
                  {act.assayType === "B" ? "Binding" : "Functional"}
                </span>
                <span className="text-cyan-700 font-bold">
                  {act.standardType}
                </span>
                <span className="text-emerald-700 font-bold">
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
