import React, { useState } from "react";
import { Award, Download } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface PatientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetData;
  currentDrug: TargetData["drugs"][0];
}

export function PatientReportModal({
  isOpen,
  onClose,
  target,
  currentDrug,
}: PatientReportModalProps) {
  const [patientId, setPatientId] = useState<string>("PT-94821-X");
  const [tumorType, setTumorType] = useState<string>(
    "Non-Small Cell Lung Cancer (Adenocarcinoma)",
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-50 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Precision Oncology Patient Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Report Content Preview */}
        <div className="space-y-4 bg-white p-5 rounded-xl border border-zinc-200 font-mono text-xs text-zinc-700">
          <div className="flex justify-between border-b border-zinc-200 pb-2">
            <span>INSTITUTION: OncoTarget-X Clinical AI Labs</span>
            <span>DATE: 2026-09-12</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              Patient ID:{" "}
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="bg-zinc-50 px-2 py-1 rounded text-cyan-400 w-full mt-1 border border-zinc-200 font-mono"
              />
            </div>
            <div>
              Tumor Type:{" "}
              <input
                type="text"
                value={tumorType}
                onChange={(e) => setTumorType(e.target.value)}
                className="bg-zinc-50 px-2 py-1 rounded text-cyan-400 w-full mt-1 border border-zinc-200 font-mono"
              />
            </div>
          </div>
          <div className="pt-2">
            <span className="text-zinc-600">BIOMARKER MUTATION PROFILE:</span>
            <div className="text-cyan-400 font-bold mt-1">
              Target: {target.name} ({target.fullName}) [PDB: {target.pdbId}]
            </div>
          </div>
          <div>
            <span className="text-zinc-600">TOP RANKED OFF-LABEL THERAPY:</span>
            <div className="text-emerald-400 font-bold mt-1">
              {currentDrug.name} — {currentDrug.bindingEnergy} ($K_d$:{" "}
              {currentDrug.affinityScore} nM)
            </div>
            <div className="text-zinc-600 mt-1">
              Mechanism: {currentDrug.mechanism}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-700 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert("Patient Report PDF successfully generated & downloaded!");
              onClose();
            }}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
